import ExcelJS from "exceljs";
import { prisma } from "../models/index.js";
import { ETAPES_MODELE } from "../constants/etapes-modele.js";
import { mapCommentToStatus } from "../utils/chantier-calculs.js";
import * as chantierService from "./chantier.service.js";
import * as bcService from "./bon-de-commande.service.js";
import * as etapeService from "./etape-chantier.service.js";

function parseCellDate(value) {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === "number") {
    const d = ExcelJS.ValueType ? new Date((value - 25569) * 86400 * 1000) : new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const s = String(value).trim();
  if (!s || s.toLowerCase() === "on going") return null;
  const fr = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (fr) return new Date(`${fr[3]}-${fr[2].padStart(2, "0")}-${fr[1].padStart(2, "0")}`);
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

function normalizeBcNumero(raw) {
  if (!raw) return null;
  return String(raw).trim().replace(/\s+/g, "");
}

async function linkBc(numeroBc, projet, montantPo) {
  const num = normalizeBcNumero(numeroBc);
  if (!num) return null;
  const bc = await bcService.upsertByNumero(num, {
    montantPo: montantPo ?? 0,
    projetAssocie: projet ?? undefined,
    montantFacture: 0,
    montantRestant: montantPo ?? 0,
  });
  return bc.id;
}

/** Import Daily Reporting Tracker depuis un fichier Excel. */
export async function importDailyTracker(filePath) {
  await chantierService.ensureEtapesModele();
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(filePath);
  const ws = wb.worksheets[0];
  if (!ws) throw new Error("Feuille Excel introuvable");

  let imported = 0;
  const startRow = ws.getRow(2).getCell(1).value === "Plan Date" ||
    String(ws.getRow(2).getCell(9).value).includes("Plan") ? 3 : 2;

  for (let r = startRow; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const nomSite = row.getCell(6).value;
    if (!nomSite) continue;

    const codeSite = String(row.getCell(5).value ?? "").trim();
    const comment = String(row.getCell(4).value ?? "").trim();
    const data = {
      entreprise: String(row.getCell(2).value ?? "OMNIACOM").trim(),
      projet: String(row.getCell(3).value ?? "").trim() || undefined,
      comment: comment || undefined,
      codeSite: codeSite || `SITE-${r}`,
      nomSite: String(nomSite).trim(),
      typeSite: String(row.getCell(8).value ?? "Greenfield").trim(),
      dateGo: parseCellDate(row.getCell(7).value) ?? new Date(),
      status: mapCommentToStatus(comment),
    };

    let chantier = codeSite
      ? await prisma.chantier.findFirst({ where: { codeSite } })
      : await prisma.chantier.findFirst({ where: { nomSite: data.nomSite } });

    if (chantier) {
      chantier = await prisma.chantier.update({ where: { id: chantier.id }, data });
    } else {
      chantier = await chantierService.create(data);
    }

    let col = 9;
    for (const m of ETAPES_MODELE) {
      const plan = parseCellDate(row.getCell(col).value);
      const actual = parseCellDate(row.getCell(col + 1).value);
      col += 2;
      const etape = await prisma.etapeChantier.findFirst({
        where: { chantierId: chantier.id, codeEtape: m.code },
      });
      if (!etape) continue;
      await etapeService.update(etape.id, {
        datePlanifiee: plan,
        dateReelle: actual,
      });
    }
    imported++;
  }
  return { imported };
}

/** Import DAILY PROGRESS + paiements depuis suivi BC. */
export async function importBcSuivi(filePath) {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(filePath);
  let sitesImported = 0;
  let lignesImported = 0;

  const wsProgress = wb.getWorksheet("DAILY PROGRESS") ?? wb.worksheets[0];
  if (wsProgress) {
    for (let r = 2; r <= wsProgress.rowCount; r++) {
      const row = wsProgress.getRow(r);
      const nomSite = row.getCell(6).value;
      const po = row.getCell(4).value;
      if (!nomSite && !po) continue;
      if (!nomSite) continue;
      if (String(row.getCell(1).value).includes("TOTAL")) break;

      const numeroBc = normalizeBcNumero(po);
      const prixSite = Number(row.getCell(5).value) || undefined;
      const bcId = numeroBc
        ? await linkBc(numeroBc, String(row.getCell(1).value ?? ""), prixSite)
        : null;

      const codeSite = String(row.getCell(3).value ?? "").trim();
      const payload = {
        entreprise: "OMNIACOM",
        projet: String(row.getCell(1).value ?? "").trim() || undefined,
        statutSite: String(row.getCell(2).value ?? "CW").trim(),
        codeSite: codeSite || `IMP-${r}`,
        nomSite: String(nomSite).trim(),
        typeSite: String(row.getCell(7).value ?? "").trim(),
        hauteurTour: String(row.getCell(8).value ?? "").trim() || undefined,
        fournisseurTour: String(row.getCell(10).value ?? "").trim() || undefined,
        prixSite,
        bonDeCommandeId: bcId,
        comment: String(row.getCell(9).value ?? "").trim() || undefined,
        status: mapCommentToStatus(String(row.getCell(9).value ?? "")),
      };

      const existing = codeSite
        ? await prisma.chantier.findFirst({ where: { codeSite } })
        : await prisma.chantier.findFirst({ where: { nomSite: payload.nomSite } });

      if (existing) {
        await prisma.chantier.update({ where: { id: existing.id }, data: payload });
      } else {
        await chantierService.create(payload);
      }
      sitesImported++;
    }
  }

  const wsPay = wb.getWorksheet("Suivi Paiement OCM");
  if (wsPay) {
    let currentBcId = null;
    for (let r = 1; r <= wsPay.rowCount; r++) {
      const row = wsPay.getRow(r);
      const c1 = String(row.getCell(1).value ?? "");
      const c2 = String(row.getCell(2).value ?? "");
      if (c2.startsWith("BC")) {
        const bc = await bcService.upsertByNumero(normalizeBcNumero(c2), {
          montantPo: 0,
          montantFacture: 0,
          montantRestant: 0,
        });
        currentBcId = bc.id;
      }
      if (c1 === "PO Amount" && Number(row.getCell(3).value) > 0 && currentBcId) {
        const montant = Number(row.getCell(3).value);
        const statutRaw = String(row.getCell(4).value ?? "");
        await prisma.ligneFacturation.create({
          data: {
            bonDeCommandeId: currentBcId,
            montantHt: montant,
            statutPaiement: statutRaw.toLowerCase().includes("not") ? "NOT_PAID" : "PAID",
            description: `Import ligne ${r}`,
          },
        });
        lignesImported++;
      }
    }
    const bons = await bcService.findAll();
    for (const bc of bons) await bcService.syncMontants(bc.id);
  }

  return { sitesImported, lignesImported };
}
