import { prisma } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";

// =============================================================================
// Service VerificationEPI_Equipement
// =============================================================================

/**
 * Recupere tous les verification-e-p-i_-equipements.
 * @returns {Promise<Array>} Liste des verification-e-p-i_-equipements
 */
export async function findAll() {
  return prisma.verificationEPI_Equipement.findMany();
}

/**
 * Recupere un verification-e-p-i_-equipement par son ID.
 * @param {number} id - Identifiant du verification-e-p-i_-equipement
 * @returns {Promise<Object>} Le verification-e-p-i_-equipement trouve
 * @throws {ApiError} 404 si introuvable
 */
export async function findById(id) {
  const item = await prisma.verificationEPI_Equipement.findUnique({ where: { verificationEpiId: id } });

  if (!item) {
    throw new ApiError(404, "VerificationEPI_Equipement introuvable");
  }

  return item;
}

/**
 * Cree un nouveau verification-e-p-i_-equipement.
 * @param {number} verificationEpiId
 * @param {number} equipementsId
 * @returns {Promise<Object>} Le verification-e-p-i_-equipement cree
 */
export async function create(data) {
  // Ajoutez ici les validations metier avant la creation
  return prisma.verificationEPI_Equipement.create({ data });
}

/**
 * Met a jour un verification-e-p-i_-equipement existant.
 * @param {number} id - Identifiant du verification-e-p-i_-equipement
 * @param {Object} data - Donnees a mettre a jour
 * @returns {Promise<Object>} Le verification-e-p-i_-equipement mis a jour
 * @throws {ApiError} 404 si introuvable
 */
export async function update(id, data) {
  await findById(id);
  return prisma.verificationEPI_Equipement.update({ where: { verificationEpiId: id }, data });
}

/**
 * Supprime un verification-e-p-i_-equipement.
 * @param {number} id - Identifiant du verification-e-p-i_-equipement
 * @returns {Promise<Object>} Le verification-e-p-i_-equipement supprime
 * @throws {ApiError} 404 si introuvable
 */
export async function remove(id) {
  await findById(id);
  return prisma.verificationEPI_Equipement.delete({ where: { verificationEpiId: id } });
}
