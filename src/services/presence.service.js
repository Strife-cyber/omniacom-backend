import { prisma } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";

// =============================================================================
// Service Presence
// =============================================================================

/**
 * Recupere tous les presences.
 * @returns {Promise<Array>} Liste des presences
 */
export async function findAll() {
  return prisma.presence.findMany();
}

/**
 * Recupere un presence par son ID.
 * @param {number} id - Identifiant du presence
 * @returns {Promise<Object>} Le presence trouve
 * @throws {ApiError} 404 si introuvable
 */
export async function findById(id) {
  const item = await prisma.presence.findUnique({ where: { id: id } });

  if (!item) {
    throw new ApiError(404, "Presence introuvable");
  }

  return item;
}

/**
 * Cree un nouveau presence.
 * @param {number} technicienId
 * @param {number} interventionsId
 * @param {Date} date
 * @returns {Promise<Object>} Le presence cree
 */
export async function create(data) {
  // Ajoutez ici les validations metier avant la creation
  return prisma.presence.create({ data });
}

/**
 * Met a jour un presence existant.
 * @param {number} id - Identifiant du presence
 * @param {Object} data - Donnees a mettre a jour
 * @returns {Promise<Object>} Le presence mis a jour
 * @throws {ApiError} 404 si introuvable
 */
export async function update(id, data) {
  await findById(id);
  return prisma.presence.update({ where: { id: id }, data });
}

/**
 * Supprime un presence.
 * @param {number} id - Identifiant du presence
 * @returns {Promise<Object>} Le presence supprime
 * @throws {ApiError} 404 si introuvable
 */
export async function remove(id) {
  await findById(id);
  return prisma.presence.delete({ where: { id: id } });
}
