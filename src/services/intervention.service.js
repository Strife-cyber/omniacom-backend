import { prisma } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";

// =============================================================================
// Service Intervention
// =============================================================================

/**
 * Recupere tous les interventions.
 * @returns {Promise<Array>} Liste des interventions
 */
export async function findAll(page = 1, pageSize = 20) {
  const skip = (page - 1) * pageSize;

  const [data, total] = await Promise.all([
    prisma.intervention.findMany({
      skip,
      take: pageSize,
    }),
    prisma.intervention.count(),
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
 * Recupere un intervention par son ID.
 * @param {number} id - Identifiant du intervention
 * @returns {Promise<Object>} Le intervention trouve
 * @throws {ApiError} 404 si introuvable
 */
export async function findById(id) {
  const item = await prisma.intervention.findUnique({ where: { id: id } });

  if (!item) {
    throw new ApiError(404, "Intervention introuvable");
  }

  return item;
}

/**
 * Cree un nouveau intervention.
 * @param {number} siteId
 * @param {number} technicienId
 * @param {Date} timestampDebut
 * @param {Date} timestampFin
 * @returns {Promise<Object>} Le intervention cree
 */
export async function create(data) {
  // Ajoutez ici les validations metier avant la creation
  return prisma.intervention.create({ data });
}

/**
 * Met a jour un intervention existant.
 * @param {number} id - Identifiant du intervention
 * @param {Object} data - Donnees a mettre a jour
 * @returns {Promise<Object>} Le intervention mis a jour
 * @throws {ApiError} 404 si introuvable
 */
export async function update(id, data) {
  await findById(id);
  return prisma.intervention.update({ where: { id: id }, data });
}

/**
 * Supprime un intervention.
 * @param {number} id - Identifiant du intervention
 * @returns {Promise<Object>} Le intervention supprime
 * @throws {ApiError} 404 si introuvable
 */
export async function remove(id) {
  await findById(id);
  return prisma.intervention.delete({ where: { id: id } });
}
