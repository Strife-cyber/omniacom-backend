import ExcelJS from "exceljs";
import { ETAPES_MODELE } from "../constants/etapes-modele.js";
import * as chantierService from "./chantier.service.js";
import * as bcService from "./bon-de-commande.service.js";
import { calcRetardJours } from "../utils/chantier-calculs.js";

function fmtDate(d) {
  if (!d) return "";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "";
  return dt.toLocaleDateString("fr-FR");
}

function etapeMap(etapes) {
  const map = {};
  for (const e of etapes) map[e.codeEtape] = e;
  return map;
}

/** Export Daily Reporting Tracker (.xlsx). */
export async function exportDailyTracker() {
  const chantiers = await chantierService.findDailyProgress();
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Sheet1");

  const fixedHeaders = [
    "#", "Company", "Project", "Comment", "Site code", "Site Name",
    "Date for the CW GO", "Site Type (Greenfield/Rooftop)",
  ];
  const row1 = [...fixedHeaders];
  for (const m of ETAPES_MODELE) row1.push(m.libelle, "");
  row1.push("Count of days");
  ws.addRow(row1);

  const row2 = ["", "", "", "", "", "", "", ""];
  for (let i = 0; i < ETAPES_MODELE.length; i++) {
    row2.push("Plan Date", "Actual Date");
  }
  ws.addRow(row2);

  chantiers.forEach((c, idx) => {
    const em = etapeMap(c.etapesChantier);
    const row = [
      idx + 1,
      c.entreprise,
      c.projet ?? "",
      c.comment ?? "",
      c.codeSite,
      c.nomSite,
      fmtDate(c.dateGo),
      c.typeSite,
    ];
    let maxRetard = 0;
    for (const m of ETAPES_MODELE) {
      const e = em[m.code];
      row.push(fmtDate(e?.datePlanifiee), fmtDate(e?.dateReelle));
      if (e?.retardJours > maxRetard) maxRetard = e.retardJours;
    }
    row.push(maxRetard || calcRetardJours(c.dateGo, new Date()));
    ws.addRow(row);
  });

  return wb.xlsx.writeBuffer();
}

/** Export suivi BC (DAILY PROGRESS + Suivi Paiement). */
export async function exportBcSuivi() {
  const chantiers = await chantierService.findDailyProgress();
  const summary = await bcService.findSummary();
  const wb = new ExcelJS.Workbook();

  const ws1 = wb.addWorksheet("DAILY PROGRESS");
  ws1.addRow([
    "Projet", "Actual Site Status", "Site Code", "PO", "Price",
    "Site name", "Site Type", "Final tower Hight", "PROGRESS", "Tower Provider",
  ]);
  for (const c of chantiers) {
    ws1.addRow([
      c.projet ?? "",
      c.statutSite ?? "CW",
      c.codeSite,
      c.bonDeCommande?.numeroBc ?? "",
      c.prixSite ? Number(c.prixSite) : "",
      c.nomSite,
      c.typeSite,
      c.hauteurTour ?? "",
      c.status === "DONE" ? "Done" : c.comment ?? "on going",
      c.fournisseurTour ?? "",
    ]);
  }

  const ws2 = wb.addWorksheet("Suivi Paiement OCM");
  for (const bc of summary.bons) {
    ws2.addRow([]);
    ws2.addRow(["", bc.numeroBc]);
    ws2.addRow(["PO Amount", "PO", "invoiced HT", "Payment status"]);
    ws2.addRow([Number(bc.montantPo), bc.numeroBc, "", ""]);
    for (const l of bc.lignesFacturation) {
      ws2.addRow([
        "",
        bc.numeroBc,
        Number(l.montantHt),
        l.statutPaiement === "PAID" ? "Paid" : "Not Paid",
      ]);
    }
    ws2.addRow(["TOTAL :", "", Number(bc.montantFacture)]);
  }
  ws2.addRow([]);
  ws2.addRow(["PO Amount", "PO", "invoiced HT", "Not invoiced Amount"]);
  for (const bc of summary.bons) {
    ws2.addRow([
      Number(bc.montantPo),
      bc.numeroBc,
      Number(bc.montantFacture),
      Number(bc.montantRestant),
    ]);
  }
  ws2.addRow([
    summary.totaux.totalPo,
    "",
    summary.totaux.totalFacture,
    summary.totaux.totalRestant,
  ]);

  return wb.xlsx.writeBuffer();
}

/** Export liste chantiers simplifiee. */
export async function exportChantiersList() {
  const chantiers = await chantierService.findAll();
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Chantiers");
  ws.addRow([
    "Code Site", "Nom Site", "Entreprise", "Projet", "Type", "Statut",
    "Avancement planifie", "Avancement reel", "Date GO", "PO", "Fournisseur",
  ]);
  for (const c of chantiers) {
    ws.addRow([
      c.codeSite, c.nomSite, c.entreprise, c.projet ?? "", c.typeSite, c.status,
      c.avancementPlanifie, c.avancementReel, fmtDate(c.dateGo),
      c.bonDeCommande?.numeroBc ?? "", c.fournisseurTour ?? "",
    ]);
  }
  return wb.xlsx.writeBuffer();
}

/** Export liste utilisateurs. */
export async function exportUtilisateurs(users) {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Utilisateurs");
  ws.addRow(["ID", "Nom", "Email", "Role", "Photo"]);
  for (const u of users) {
    ws.addRow([u.id, u.nom, u.email, u.role, u.photoUrl ?? ""]);
  }
  return wb.xlsx.writeBuffer();
}
