import { prisma } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";

// =============================================================================
// Service VerificationEPI
// =============================================================================

/**
 * Recupere tous les verification-e-p-is.
 * @returns {Promise<Array>} Liste des verification-e-p-is
 */
export async function findAll(page = 1, pageSize = 20, filters = {}) {
  const skip = (page - 1) * pageSize;

  const where = {};
  if (filters.technicienId) where.technicienId = Number(filters.technicienId);
  if (filters.nom) {
    where.technicien = {
      OR: [
        { nom: { contains: filters.nom, mode: "insensitive" } },
        { prenom: { contains: filters.nom, mode: "insensitive" } },
      ],
    };
  }
  if (filters.mois && filters.annee) {
    const debut = new Date(Number(filters.annee), Number(filters.mois) - 1, 1);
    const fin = new Date(Number(filters.annee), Number(filters.mois), 1);
    where.dateDemande = { gte: debut, lt: fin };
  }

  const [data, total] = await Promise.all([
    prisma.verificationEPI.findMany({
      skip,
      take: pageSize,
      where,
      include: { technicien: { select: { nom: true, prenom: true } } },
    }),
    prisma.verificationEPI.count({ where }),
  ]);

  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

/**
 * Recupere un verification-e-p-i par son ID.
 * @param {number} id - Identifiant du verification-e-p-i
 * @returns {Promise<Object>} Le verification-e-p-i trouve
 * @throws {ApiError} 404 si introuvable
 */
export async function findById(id) {
  const item = await prisma.verificationEPI.findUnique({
    where: { id },
    include: { technicien: { select: { nom: true, prenom: true } } },
  });

  if (!item) {
    throw new ApiError(404, "VerificationEPI introuvable");
  }

  return item;
}

/**
 * Cree un nouveau verification-e-p-i.
 * @param {number} technicienId
 * @param {Date} dateDerniereVerif
 * @param {Date} dateDemande
 * @param {Date} dateEnvoie
 * @param {number} joursRetard
 * @param {Date} prochaineDate
 * @returns {Promise<Object>} Le verification-e-p-i cree
 */
export async function create(data) {
  const {
    technicienId,
    dateDerniereVerif,
    dateDemande,
    dateEnvoie,
    joursRetard = 0,
    prochaineDate,
  } = data;
  return prisma.verificationEPI.create({
    data: {
      technicienId: Number(technicienId),
      dateDerniereVerif: dateDerniereVerif ? new Date(dateDerniereVerif) : null,
      dateDemande: new Date(dateDemande),
      dateEnvoie: dateEnvoie ? new Date(dateEnvoie) : null,
      joursRetard: Number(joursRetard),
      prochaineDate: prochaineDate ? new Date(prochaineDate) : null,
    },
    include: { technicien: { select: { nom: true, prenom: true } } },
  });
}

/**
 * Met a jour un verification-e-p-i existant.
 * @param {number} id - Identifiant du verification-e-p-i
 * @param {Object} data - Donnees a mettre a jour
 * @returns {Promise<Object>} Le verification-e-p-i mis a jour
 * @throws {ApiError} 404 si introuvable
 */
export async function update(id, data) {
  await findById(id);
  const {
    technicienId,
    dateDerniereVerif,
    dateDemande,
    dateEnvoie,
    joursRetard,
    prochaineDate,
  } = data;
  const payload = {};
  if (technicienId !== undefined) payload.technicienId = Number(technicienId);
  if (dateDerniereVerif !== undefined) payload.dateDerniereVerif = dateDerniereVerif ? new Date(dateDerniereVerif) : null;
  if (dateDemande !== undefined) payload.dateDemande = new Date(dateDemande);
  if (dateEnvoie !== undefined) payload.dateEnvoie = dateEnvoie ? new Date(dateEnvoie) : null;
  if (joursRetard !== undefined) payload.joursRetard = Number(joursRetard);
  if (prochaineDate !== undefined) payload.prochaineDate = prochaineDate ? new Date(prochaineDate) : null;
  return prisma.verificationEPI.update({
    where: { id },
    data: payload,
    include: { technicien: { select: { nom: true, prenom: true } } },
  });
}

/**
 * Supprime un verification-e-p-i.
 * @param {number} id - Identifiant du verification-e-p-i
 * @returns {Promise<Object>} Le verification-e-p-i supprime
 * @throws {ApiError} 404 si introuvable
 */
export async function remove(id) {
  await findById(id);
  return prisma.verificationEPI.delete({ where: { id: id } });
}
