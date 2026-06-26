import { prisma } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";
import {
  calcRetardJours,
  deriveEtapeStatus,
  calcAvancementReel,
} from "../utils/chantier-calculs.js";

export async function findAll(query = {}) {
  const where = {};
  if (query.chantierId) where.chantierId = parseInt(query.chantierId, 10);
  return prisma.etapeChantier.findMany({
    where,
    orderBy: { ordre: "asc" },
  });
}

export async function findById(id) {
  const item = await prisma.etapeChantier.findUnique({ where: { id } });
  if (!item) throw new ApiError(404, "EtapeChantier introuvable");
  return item;
}

function buildEtapeData(data) {
  const payload = { ...data };
  if (payload.datePlanifiee) payload.datePlanifiee = new Date(payload.datePlanifiee);
  if (payload.dateReelle) payload.dateReelle = new Date(payload.dateReelle);
  if (payload.datePlanifiee || payload.dateReelle) {
    payload.retardJours = calcRetardJours(payload.datePlanifiee, payload.dateReelle);
    payload.status = deriveEtapeStatus(payload);
  }
  return payload;
}

async function syncChantierAvancement(chantierId) {
  const etapes = await prisma.etapeChantier.findMany({ where: { chantierId } });
  await prisma.chantier.update({
    where: { id: chantierId },
    data: { avancementReel: calcAvancementReel(etapes) },
  });
}

export async function create(data) {
  const payload = buildEtapeData(data);
  const item = await prisma.etapeChantier.create({ data: payload });
  await syncChantierAvancement(item.chantierId);
  return item;
}

export async function update(id, data) {
  const existing = await findById(id);
  const merged = { ...existing, ...data };
  const payload = buildEtapeData(merged);
  delete payload.id;
  delete payload.chantierId;
  const item = await prisma.etapeChantier.update({ where: { id }, data: payload });
  await syncChantierAvancement(existing.chantierId);
  return item;
}

export async function remove(id) {
  const existing = await findById(id);
  await prisma.etapeChantier.delete({ where: { id } });
  await syncChantierAvancement(existing.chantierId);
  return existing;
}
