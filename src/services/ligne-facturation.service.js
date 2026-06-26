import { prisma } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";
import { syncMontants } from "./bon-de-commande.service.js";

export async function findAll(query = {}) {
  const where = {};
  if (query.bonDeCommandeId) where.bonDeCommandeId = parseInt(query.bonDeCommandeId, 10);
  return prisma.ligneFacturation.findMany({
    where,
    orderBy: { id: "asc" },
  });
}

export async function findById(id) {
  const item = await prisma.ligneFacturation.findUnique({ where: { id } });
  if (!item) throw new ApiError(404, "LigneFacturation introuvable");
  return item;
}

function normalizeStatut(statut) {
  if (!statut) return "NOT_PAID";
  const s = String(statut).toUpperCase();
  if (s === "PAID" || s === "PAYE" || s.includes("PAID")) return "PAID";
  return "NOT_PAID";
}

export async function create(data) {
  const item = await prisma.ligneFacturation.create({
    data: {
      ...data,
      statutPaiement: normalizeStatut(data.statutPaiement),
      dateFacture: data.dateFacture ? new Date(data.dateFacture) : null,
    },
  });
  await syncMontants(item.bonDeCommandeId);
  return item;
}

export async function update(id, data) {
  await findById(id);
  const payload = { ...data };
  if (payload.statutPaiement) payload.statutPaiement = normalizeStatut(payload.statutPaiement);
  if (payload.dateFacture) payload.dateFacture = new Date(payload.dateFacture);
  const item = await prisma.ligneFacturation.update({ where: { id }, data: payload });
  await syncMontants(item.bonDeCommandeId);
  return item;
}

export async function remove(id) {
  const item = await findById(id);
  await prisma.ligneFacturation.delete({ where: { id } });
  await syncMontants(item.bonDeCommandeId);
  return item;
}
