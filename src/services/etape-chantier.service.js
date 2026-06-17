import { prisma } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";

// =============================================================================
// Service EtapeChantier
// =============================================================================

/**
 * Recupere tous les etape-chantiers.
 * @returns {Promise<Array>} Liste des etape-chantiers
 */
export async function findAll() {
  return prisma.etapeChantier.findMany();
}

/**
 * Recupere un etape-chantier par son ID.
 * @param {number} id - Identifiant du etape-chantier
 * @returns {Promise<Object>} Le etape-chantier trouve
 * @throws {ApiError} 404 si introuvable
 */
export async function findById(id) {
  const item = await prisma.etapeChantier.findUnique({ where: { id: id } });

  if (!item) {
    throw new ApiError(404, "EtapeChantier introuvable");
  }

  return item;
}

/**
 * Cree un nouveau etape-chantier.
 * @param {number} chantierId
 * @param {string} nomEtape
 * @param {Date} datePlanifiee
 * @param {Date} dateReelle
 * @param {number} retardMinutes
 * @returns {Promise<Object>} Le etape-chantier cree
 */
export async function create(data) {
  // Ajoutez ici les validations metier avant la creation
  return prisma.etapeChantier.create({ data });
}

/**
 * Met a jour un etape-chantier existant.
 * @param {number} id - Identifiant du etape-chantier
 * @param {Object} data - Donnees a mettre a jour
 * @returns {Promise<Object>} Le etape-chantier mis a jour
 * @throws {ApiError} 404 si introuvable
 */
export async function update(id, data) {
  await findById(id);
  return prisma.etapeChantier.update({ where: { id: id }, data });
}

/**
 * Supprime un etape-chantier.
 * @param {number} id - Identifiant du etape-chantier
 * @returns {Promise<Object>} Le etape-chantier supprime
 * @throws {ApiError} 404 si introuvable
 */
export async function remove(id) {
  await findById(id);
  return prisma.etapeChantier.delete({ where: { id: id } });
}
