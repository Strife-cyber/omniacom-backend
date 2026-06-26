import { prisma } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";
import { ETAPES_MODELE } from "../constants/etapes-modele.js";
import {
  isRooftop,
  calcRetardJours,
  deriveEtapeStatus,
  calcAvancementReel,
} from "../utils/chantier-calculs.js";

const CHANTIER_INCLUDE = {
  bonDeCommande: true,
  etapesChantier: { orderBy: { ordre: "asc" } },
  photos: { orderBy: { createdAt: "desc" } },
};

/** Assure que le catalogue des etapes modele existe en base. */
export async function ensureEtapesModele() {
  for (const modele of ETAPES_MODELE) {
    await prisma.etapeModele.upsert({
      where: { code: modele.code },
      update: { libelle: modele.libelle, ordre: modele.ordre, actifPourRooftop: modele.actifPourRooftop },
      create: modele,
    });
  }
}

/** Cree les etapes standard pour un chantier. */
async function seedEtapesForChantier(chantierId, typeSite) {
  const rooftop = isRooftop(typeSite);
  const data = ETAPES_MODELE.map((m) => ({
    chantierId,
    codeEtape: m.code,
    nomEtape: m.libelle,
    ordre: m.ordre,
    status: rooftop && !m.actifPourRooftop ? "NON_APPLICABLE" : "EN_ATTENTE",
    datePlanifiee: null,
    dateReelle: null,
    retardJours: 0,
  }));
  await prisma.etapeChantier.createMany({ data, skipDuplicates: true });
}

/** Recalcule avancementReel d'un chantier. */
async function refreshAvancement(chantierId) {
  const etapes = await prisma.etapeChantier.findMany({ where: { chantierId } });
  const avancementReel = calcAvancementReel(etapes);
  return prisma.chantier.update({
    where: { id: chantierId },
    data: { avancementReel },
  });
}

export async function findAll(filters = {}) {
  const where = {};
  if (filters.status) where.status = filters.status;
  if (filters.projet) where.projet = { contains: filters.projet, mode: "insensitive" };
  return prisma.chantier.findMany({
    where,
    include: CHANTIER_INCLUDE,
    orderBy: { dateGo: "desc" },
  });
}

export async function findDailyProgress() {
  return prisma.chantier.findMany({
    include: {
      bonDeCommande: true,
      etapesChantier: { orderBy: { ordre: "asc" } },
    },
    orderBy: { nomSite: "asc" },
  });
}

export async function findById(id) {
  const item = await prisma.chantier.findUnique({
    where: { id },
    include: CHANTIER_INCLUDE,
  });
  if (!item) throw new ApiError(404, "Chantier introuvable");
  return item;
}

export async function create(data) {
  await ensureEtapesModele();
  const { status, ...rest } = data;
  const chantier = await prisma.chantier.create({
    data: { ...rest, status: status ?? "ON_GOING" },
  });
  await seedEtapesForChantier(chantier.id, chantier.typeSite);
  return findById(chantier.id);
}

export async function update(id, data) {
  await findById(id);
  const updated = await prisma.chantier.update({ where: { id }, data });
  if (data.typeSite) {
    const rooftop = isRooftop(data.typeSite);
    const etapes = await prisma.etapeChantier.findMany({ where: { chantierId: id } });
    for (const etape of etapes) {
      const modele = ETAPES_MODELE.find((m) => m.code === etape.codeEtape);
      if (!modele) continue;
      const na = rooftop && !modele.actifPourRooftop;
      await prisma.etapeChantier.update({
        where: { id: etape.id },
        data: { status: na ? "NON_APPLICABLE" : etape.status === "NON_APPLICABLE" ? "EN_ATTENTE" : etape.status },
      });
    }
  }
  await refreshAvancement(id);
  return findById(updated.id);
}

export async function remove(id) {
  await findById(id);
  return prisma.chantier.delete({ where: { id } });
}

export async function addPhoto(chantierId, url, legende) {
  await findById(chantierId);
  return prisma.chantierPhoto.create({ data: { chantierId, url, legende } });
}

export async function removePhoto(photoId) {
  const photo = await prisma.chantierPhoto.findUnique({ where: { id: photoId } });
  if (!photo) throw new ApiError(404, "Photo introuvable");
  return prisma.chantierPhoto.delete({ where: { id: photoId } });
}

export async function setCoverPhoto(chantierId, photoUrl) {
  await findById(chantierId);
  return prisma.chantier.update({ where: { id: chantierId }, data: { photoUrl } });
}
