import { prisma } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";

// =============================================================================
// Service Equipements
// =============================================================================

/**
 * Recupere tous les equipementss.
 * @returns {Promise<Array>} Liste des equipementss
 */
export async function findAll(page = 1, pageSize = 20) {
  const skip = (page - 1) * pageSize;

  const [data, total] = await Promise.all([
    prisma.equipements.findMany({
      skip,
      take: pageSize,
    }),
    prisma.equipements.count(),
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
 * Recupere un equipements par son ID.
 * @param {number} id - Identifiant du equipements
 * @returns {Promise<Object>} Le equipements trouve
 * @throws {ApiError} 404 si introuvable
 */
export async function findById(id) {
  const item = await prisma.equipements.findUnique({ where: { id: id } });

  if (!item) {
    throw new ApiError(404, "Equipements introuvable");
  }

  return item;
}

/**
 * Cree un nouveau equipements.
 * @param {string} nom
 * @returns {Promise<Object>} Le equipements cree
 */
export async function create(data) {
  // Ajoutez ici les validations metier avant la creation
  return prisma.equipements.create({ data });
}

/**
 * Met a jour un equipements existant.
 * @param {number} id - Identifiant du equipements
 * @param {Object} data - Donnees a mettre a jour
 * @returns {Promise<Object>} Le equipements mis a jour
 * @throws {ApiError} 404 si introuvable
 */
export async function update(id, data) {
  await findById(id);
  return prisma.equipements.update({ where: { id: id }, data });
}

/**
 * Supprime un equipements.
 * @param {number} id - Identifiant du equipements
 * @returns {Promise<Object>} Le equipements supprime
 * @throws {ApiError} 404 si introuvable
 */
export async function remove(id) {
  await findById(id);
  return prisma.equipements.delete({ where: { id: id } });
}
