import { prisma } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";

// =============================================================================
// Service LigneFacturation
// =============================================================================

/**
 * Recupere tous les ligne-facturations.
 * @returns {Promise<Array>} Liste des ligne-facturations
 */
export async function findAll() {
  return prisma.ligneFacturation.findMany();
}

/**
 * Recupere un ligne-facturation par son ID.
 * @param {number} id - Identifiant du ligne-facturation
 * @returns {Promise<Object>} Le ligne-facturation trouve
 * @throws {ApiError} 404 si introuvable
 */
export async function findById(id) {
  const item = await prisma.ligneFacturation.findUnique({ where: { id: id } });

  if (!item) {
    throw new ApiError(404, "LigneFacturation introuvable");
  }

  return item;
}

/**
 * Cree un nouveau ligne-facturation.
 * @param {number} bonDeCommandeId
 * @param {number} montantHt
 * @param {string} statutPaiement
 * @param {Date} dateFacture
 * @param {string} description
 * @returns {Promise<Object>} Le ligne-facturation cree
 */
export async function create(data) {
  // Ajoutez ici les validations metier avant la creation
  return prisma.ligneFacturation.create({ data });
}

/**
 * Met a jour un ligne-facturation existant.
 * @param {number} id - Identifiant du ligne-facturation
 * @param {Object} data - Donnees a mettre a jour
 * @returns {Promise<Object>} Le ligne-facturation mis a jour
 * @throws {ApiError} 404 si introuvable
 */
export async function update(id, data) {
  await findById(id);
  return prisma.ligneFacturation.update({ where: { id: id }, data });
}

/**
 * Supprime un ligne-facturation.
 * @param {number} id - Identifiant du ligne-facturation
 * @returns {Promise<Object>} Le ligne-facturation supprime
 * @throws {ApiError} 404 si introuvable
 */
export async function remove(id) {
  await findById(id);
  return prisma.ligneFacturation.delete({ where: { id: id } });
}
