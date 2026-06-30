import ExcelJS from "exceljs";
import { prisma } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";

const technicienInclude = {
  technicien: { select: { id: true, nom: true, prenom: true } },
};

function calcJoursRetard(dateDelaiVerification, dateEnvoie) {
  if (!dateDelaiVerification || !dateEnvoie) return 0;
  const diff = new Date(dateEnvoie) - new Date(dateDelaiVerification);
  return Math.round(diff / (1000 * 60 * 60 * 24));
}

export async function findAll(search) {
  return prisma.verificationEPI.findMany({
    where: search
      ? {
          technicien: {
            OR: [
              { nom: { contains: search, mode: "insensitive" } },
              { prenom: { contains: search, mode: "insensitive" } },
            ],
          },
        }
      : undefined,
    include: technicienInclude,
    orderBy: { dateDerniereVerif: "desc" },
  });
}

export async function findById(id) {
  const item = await prisma.verificationEPI.findUnique({
    where: { id },
    include: technicienInclude,
  });
  if (!item) throw new ApiError(404, "Vérification EPI introuvable");
  return item;
}

export async function create(data) {
  const { technicienId, dateDerniereVerif, dateDemande, dateDelaiVerification, dateEnvoie, prochaineDate } = data;

  const technicien = await prisma.technicien.findUnique({ where: { id: Number(technicienId) } });
  if (!technicien) throw new ApiError(404, "Technicien introuvable");

  const joursRetard = calcJoursRetard(dateDelaiVerification, dateEnvoie);

  return prisma.verificationEPI.create({
    data: {
      technicienId: Number(technicienId),
      dateDerniereVerif: new Date(dateDerniereVerif),
      dateDemande: new Date(dateDemande),
      dateDelaiVerification: dateDelaiVerification ? new Date(dateDelaiVerification) : null,
      dateEnvoie: new Date(dateEnvoie),
      joursRetard,
      prochaineDate: new Date(prochaineDate),
    },
    include: technicienInclude,
  });
}

export async function update(id, data) {
  const existing = await findById(id);

  const { technicienId, dateDerniereVerif, dateDemande, dateDelaiVerification, dateEnvoie, prochaineDate } = data;

  const delai = dateDelaiVerification !== undefined ? dateDelaiVerification : existing.dateDelaiVerification;
  const envoi = dateEnvoie !== undefined ? dateEnvoie : existing.dateEnvoie;

  return prisma.verificationEPI.update({
    where: { id },
    data: {
      ...(technicienId !== undefined && { technicienId: Number(technicienId) }),
      ...(dateDerniereVerif !== undefined && { dateDerniereVerif: new Date(dateDerniereVerif) }),
      ...(dateDemande !== undefined && { dateDemande: new Date(dateDemande) }),
      ...(dateDelaiVerification !== undefined && { dateDelaiVerification: dateDelaiVerification ? new Date(dateDelaiVerification) : null }),
      ...(dateEnvoie !== undefined && { dateEnvoie: new Date(dateEnvoie) }),
      ...(prochaineDate !== undefined && { prochaineDate: new Date(prochaineDate) }),
      joursRetard: calcJoursRetard(delai, envoi),
    },
    include: technicienInclude,
  });
}

export async function remove(id) {
  await findById(id);
  return prisma.verificationEPI.delete({ where: { id } });
}

export async function findHistorique(technicienId, mois, annee) {
  const technicien = await prisma.technicien.findUnique({ where: { id: technicienId } });
  if (!technicien) throw new ApiError(404, "Technicien introuvable");

  let dateDebut, dateFin;
  if (annee) {
    const m = mois ? parseInt(mois) - 1 : 0;
    const mFin = mois ? parseInt(mois) : 12;
    dateDebut = new Date(parseInt(annee), m, 1);
    dateFin = new Date(parseInt(annee), mFin, 1);
  }

  return prisma.verificationEPI.findMany({
    where: {
      technicienId,
      ...(dateDebut && dateFin
        ? { dateDerniereVerif: { gte: dateDebut, lt: dateFin } }
        : {}),
    },
    include: technicienInclude,
    orderBy: { dateDerniereVerif: "desc" },
  });
}

export async function exportExcel() {
  const verifications = await prisma.verificationEPI.findMany({
    include: technicienInclude,
    orderBy: { dateDerniereVerif: "desc" },
  });

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Suivi EPI");

  sheet.columns = [
    { header: "Nom", key: "nom", width: 20 },
    { header: "Prénom", key: "prenom", width: 20 },
    { header: "Date dernière vérif.", key: "dateDerniereVerif", width: 22 },
    { header: "Date demande évidences", key: "dateDemande", width: 24 },
    { header: "Date envoi ressource", key: "dateEnvoie", width: 22 },
    { header: "Jours de retard", key: "joursRetard", width: 16 },
    { header: "Date prochaine vérif.", key: "prochaineDate", width: 22 },
  ];

  sheet.getRow(1).font = { bold: true };

  const fmt = (d) => d ? new Date(d).toLocaleDateString("fr-FR") : "";

  for (const v of verifications) {
    sheet.addRow({
      nom: v.technicien?.nom ?? "",
      prenom: v.technicien?.prenom ?? "",
      dateDerniereVerif: fmt(v.dateDerniereVerif),
      dateDemande: fmt(v.dateDemande),
      dateEnvoie: fmt(v.dateEnvoie),
      joursRetard: v.joursRetard,
      prochaineDate: fmt(v.prochaineDate),
    });
  }

  return workbook;
}
