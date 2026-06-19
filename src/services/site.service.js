import { prisma } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";

// =============================================================================
// Service Site
// =============================================================================

/**
 * Recupere tous les sites.
 * @returns {Promise<Array>} Liste des sites
 */
export async function findAll(page = 1, pageSize = 20) {
  const skip = (page - 1) * pageSize;

  const [data, total] = await Promise.all([
    prisma.site.findMany({
      skip,
      take: pageSize,
    }),
    prisma.site.count(),
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
 * Recupere un site par son ID.
 * @param {number} id - Identifiant du site
 * @returns {Promise<Object>} Le site trouve
 * @throws {ApiError} 404 si introuvable
 */
export async function findById(id) {
  const item = await prisma.site.findUnique({ where: { id: id } });

  if (!item) {
    throw new ApiError(404, "Site introuvable");
  }

  return item;
}

/**
 * Cree un nouveau site.
 * @param {string} nom
 * @param {string} localisation
 * @param {string} region
 * @returns {Promise<Object>} Le site cree
 */
export async function create(data) {
  // Ajoutez ici les validations metier avant la creation
  return prisma.site.create({ data });
}

/**
 * Met a jour un site existant.
 * @param {number} id - Identifiant du site
 * @param {Object} data - Donnees a mettre a jour
 * @returns {Promise<Object>} Le site mis a jour
 * @throws {ApiError} 404 si introuvable
 */
export async function update(id, data) {
  await findById(id);
  return prisma.site.update({ where: { id: id }, data });
}

/**
 * Supprime un site.
 * @param {number} id - Identifiant du site
 * @returns {Promise<Object>} Le site supprime
 * @throws {ApiError} 404 si introuvable
 */
export async function remove(id) {
  await findById(id);
  return prisma.site.delete({ where: { id: id } });
}
