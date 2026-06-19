import { prisma } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";

// =============================================================================
// Service Technicien
// =============================================================================

/**
 * Recupere tous les techniciens.
 * @returns {Promise<Array>} Liste des techniciens
 */
export async function findAll(page = 1, pageSize = 20) {
  const skip = (page - 1) * pageSize;

  const [data, total] = await Promise.all([
    prisma.technicien.findMany({
      skip,
      take: pageSize,
    }),
    prisma.technicien.count(),
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
 * Recupere un technicien par son ID.
 * @param {number} id - Identifiant du technicien
 * @returns {Promise<Object>} Le technicien trouve
 * @throws {ApiError} 404 si introuvable
 */
export async function findById(id) {
  const item = await prisma.technicien.findUnique({ where: { id: id } });

  if (!item) {
    throw new ApiError(404, "Technicien introuvable");
  }

  return item;
}

/**
 * Cree un nouveau technicien.
 * @param {string} nom
 * @param {string} prenom
 * @param {string} telephone
 * @returns {Promise<Object>} Le technicien cree
 */
export async function create(data) {
  // Ajoutez ici les validations metier avant la creation
  return prisma.technicien.create({ data });
}

/**
 * Met a jour un technicien existant.
 * @param {number} id - Identifiant du technicien
 * @param {Object} data - Donnees a mettre a jour
 * @returns {Promise<Object>} Le technicien mis a jour
 * @throws {ApiError} 404 si introuvable
 */
export async function update(id, data) {
  await findById(id);
  return prisma.technicien.update({ where: { id: id }, data });
}

/**
 * Supprime un technicien.
 * @param {number} id - Identifiant du technicien
 * @returns {Promise<Object>} Le technicien supprime
 * @throws {ApiError} 404 si introuvable
 */
export async function remove(id) {
  await findById(id);
  return prisma.technicien.delete({ where: { id: id } });
}
