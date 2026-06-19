import { prisma } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";

// =============================================================================
// Service BonDeCommande
// =============================================================================

/**
 * Recupere tous les bon-de-commandes.
 * @returns {Promise<Array>} Liste des bon-de-commandes
 */
export async function findAll(page = 1, pageSize = 20) {
  const skip = (page - 1) * pageSize;

  const [data, total] = await Promise.all([
    prisma.bonDeCommande.findMany({
      skip,
      take: pageSize,
    }),
    prisma.bonDeCommande.count(),
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
 * Recupere un bon-de-commande par son ID.
 * @param {number} id - Identifiant du bon-de-commande
 * @returns {Promise<Object>} Le bon-de-commande trouve
 * @throws {ApiError} 404 si introuvable
 */
export async function findById(id) {
  const item = await prisma.bonDeCommande.findUnique({ where: { id: id } });

  if (!item) {
    throw new ApiError(404, "BonDeCommande introuvable");
  }

  return item;
}

/**
 * Cree un nouveau bon-de-commande.
 * @param {number} chantierId
 * @param {string} numeroBc
 * @param {number} montantPo
 * @param {number} montantFacture
 * @param {number} montantRestant
 * @param {string} projetAssocie
 * @returns {Promise<Object>} Le bon-de-commande cree
 */
export async function create(data) {
  // Ajoutez ici les validations metier avant la creation
  return prisma.bonDeCommande.create({ data });
}

/**
 * Met a jour un bon-de-commande existant.
 * @param {number} id - Identifiant du bon-de-commande
 * @param {Object} data - Donnees a mettre a jour
 * @returns {Promise<Object>} Le bon-de-commande mis a jour
 * @throws {ApiError} 404 si introuvable
 */
export async function update(id, data) {
  await findById(id);
  return prisma.bonDeCommande.update({ where: { id: id }, data });
}

/**
 * Supprime un bon-de-commande.
 * @param {number} id - Identifiant du bon-de-commande
 * @returns {Promise<Object>} Le bon-de-commande supprime
 * @throws {ApiError} 404 si introuvable
 */
export async function remove(id) {
  await findById(id);
  return prisma.bonDeCommande.delete({ where: { id: id } });
}
