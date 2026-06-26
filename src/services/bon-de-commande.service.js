import { prisma } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";

const BC_INCLUDE = {
  chantiers: true,
  lignesFacturation: { orderBy: { id: "asc" } },
};

/** Recalcule montantFacture et montantRestant d'un BC. */
export async function syncMontants(bonDeCommandeId) {
  const lignes = await prisma.ligneFacturation.findMany({ where: { bonDeCommandeId } });
  const montantFacture = lignes.reduce((s, l) => s + Number(l.montantHt), 0);
  const bc = await prisma.bonDeCommande.findUnique({ where: { id: bonDeCommandeId } });
  const montantRestant = Math.max(0, Number(bc.montantPo) - montantFacture);
  return prisma.bonDeCommande.update({
    where: { id: bonDeCommandeId },
    data: { montantFacture, montantRestant },
  });
}

export async function findAll() {
  return prisma.bonDeCommande.findMany({
    include: BC_INCLUDE,
    orderBy: { numeroBc: "asc" },
  });
}

export async function findSummary() {
  const bons = await findAll();
  const totalPo = bons.reduce((s, b) => s + Number(b.montantPo), 0);
  const totalFacture = bons.reduce((s, b) => s + Number(b.montantFacture), 0);
  const totalRestant = bons.reduce((s, b) => s + Number(b.montantRestant), 0);
  return {
    bons,
    totaux: { totalPo, totalFacture, totalRestant, nbBons: bons.length },
  };
}

export async function findById(id) {
  const item = await prisma.bonDeCommande.findUnique({
    where: { id },
    include: BC_INCLUDE,
  });
  if (!item) throw new ApiError(404, "BonDeCommande introuvable");
  return item;
}

export async function findByNumero(numeroBc) {
  return prisma.bonDeCommande.findUnique({
    where: { numeroBc },
    include: BC_INCLUDE,
  });
}

export async function create(data) {
  const { montantFacture, montantRestant, ...rest } = data;
  const bc = await prisma.bonDeCommande.create({
    data: {
      ...rest,
      montantFacture: montantFacture ?? 0,
      montantRestant: montantRestant ?? rest.montantPo ?? 0,
    },
  });
  return findById(bc.id);
}

export async function update(id, data) {
  await findById(id);
  const bc = await prisma.bonDeCommande.update({ where: { id }, data });
  await syncMontants(id);
  return findById(bc.id);
}

export async function remove(id) {
  await findById(id);
  return prisma.bonDeCommande.delete({ where: { id } });
}

export async function upsertByNumero(numeroBc, data) {
  const existing = await findByNumero(numeroBc);
  if (existing) {
    return prisma.bonDeCommande.update({
      where: { id: existing.id },
      data: { ...data, numeroBc },
    });
  }
  return prisma.bonDeCommande.create({ data: { numeroBc, ...data } });
}
