import { prisma } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";

// =============================================================================
// Service Utilisateur
// =============================================================================

/**
 * Recupere tous les utilisateurs.
 * @returns {Promise<Array>} Liste des utilisateurs
 */
export async function findAll() {
  return prisma.utilisateur.findMany();
}

/**
 * Recupere un utilisateur par son ID.
 * @param {number} id - Identifiant du utilisateur
 * @returns {Promise<Object>} Le utilisateur trouve
 * @throws {ApiError} 404 si introuvable
 */
export async function findById(id) {
  const item = await prisma.utilisateur.findUnique({ where: { id: id } });

  if (!item) {
    throw new ApiError(404, "Utilisateur introuvable");
  }

  return item;
}

/**
 * Cree un nouveau utilisateur.
 * @param {string} email
 * @param {string} nom
 * @param {string} motDePasse
 * @returns {Promise<Object>} Le utilisateur cree
 */
export async function create(data) {
  // Ajoutez ici les validations metier avant la creation
  return prisma.utilisateur.create({ data });
}

/**
 * Met a jour un utilisateur existant.
 * @param {number} id - Identifiant du utilisateur
 * @param {Object} data - Donnees a mettre a jour
 * @returns {Promise<Object>} Le utilisateur mis a jour
 * @throws {ApiError} 404 si introuvable
 */
export async function update(id, data) {
  await findById(id);
  return prisma.utilisateur.update({ where: { id: id }, data });
}

/**
 * Supprime un utilisateur.
 * @param {number} id - Identifiant du utilisateur
 * @returns {Promise<Object>} Le utilisateur supprime
 * @throws {ApiError} 404 si introuvable
 */
export async function remove(id) {
  await findById(id);
  return prisma.utilisateur.delete({ where: { id: id } });
}
