import { prisma } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";

// =============================================================================
// Service VerificationEPI
// =============================================================================

/**
 * Recupere tous les verification-e-p-is.
 * @returns {Promise<Array>} Liste des verification-e-p-is
 */
export async function findAll(page = 1, pageSize = 20) {
  const skip = (page - 1) * pageSize;

  const [data, total] = await Promise.all([
    prisma.verificationEPI.findMany({
      skip,
      take: pageSize,
    }),
    prisma.verificationEPI.count(),
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
  const item = await prisma.verificationEPI.findUnique({ where: { id: id } });

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
  // Ajoutez ici les validations metier avant la creation
  return prisma.verificationEPI.create({ data });
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
  return prisma.verificationEPI.update({ where: { id: id }, data });
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
