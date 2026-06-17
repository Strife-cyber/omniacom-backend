import { prisma } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";

// =============================================================================
// Service Chantier
// =============================================================================

/**
 * Recupere tous les chantiers.
 * @returns {Promise<Array>} Liste des chantiers
 */
export async function findAll() {
  return prisma.chantier.findMany();
}

/**
 * Recupere un chantier par son ID.
 * @param {number} id - Identifiant du chantier
 * @returns {Promise<Object>} Le chantier trouve
 * @throws {ApiError} 404 si introuvable
 */
export async function findById(id) {
  const item = await prisma.chantier.findUnique({ where: { id: id } });

  if (!item) {
    throw new ApiError(404, "Chantier introuvable");
  }

  return item;
}

/**
 * Cree un nouveau chantier.
 * @param {string} entreprise
 * @param {string} codeSite
 * @param {string} nomSite
 * @param {string} typeSite
 * @param {number} avancementPlanifie
 * @param {number} avancementReel
 * @param {Date} dateGo
 * @returns {Promise<Object>} Le chantier cree
 */
export async function create(data) {
  // Ajoutez ici les validations metier avant la creation
  return prisma.chantier.create({ data });
}

/**
 * Met a jour un chantier existant.
 * @param {number} id - Identifiant du chantier
 * @param {Object} data - Donnees a mettre a jour
 * @returns {Promise<Object>} Le chantier mis a jour
 * @throws {ApiError} 404 si introuvable
 */
export async function update(id, data) {
  await findById(id);
  return prisma.chantier.update({ where: { id: id }, data });
}

/**
 * Supprime un chantier.
 * @param {number} id - Identifiant du chantier
 * @returns {Promise<Object>} Le chantier supprime
 * @throws {ApiError} 404 si introuvable
 */
export async function remove(id) {
  await findById(id);
  return prisma.chantier.delete({ where: { id: id } });
}
