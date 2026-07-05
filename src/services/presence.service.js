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
const STATUT_MAP = {
  "présent": "PRESENT", "present": "PRESENT", "PRESENT": "PRESENT",
  "absent": "ABSENT", "ABSENT": "ABSENT",
  "congé": "EN_CONGE", "conge": "EN_CONGE", "en congé": "EN_CONGE", "en conge": "EN_CONGE", "EN_CONGE": "EN_CONGE",
  "maladie": "MALADIE", "MALADIE": "MALADIE",
  "déplacement": "DEPLACEMENT", "deplacement": "DEPLACEMENT", "DEPLACEMENT": "DEPLACEMENT",
};

function normaliserStatut(valeur) {
  if (!valeur) return null;
  return STATUT_MAP[String(valeur).trim()] ?? null;
}

export async function create(data) {
  const technicienId = parseInt(data.technicienId, 10);
  const interventionsId = parseInt(data.interventionsId, 10);
  const statut = normaliserStatut(data.statut);

  if (!technicienId || isNaN(technicienId)) throw new ApiError(400, "technicienId invalide ou manquant");
  if (!interventionsId || isNaN(interventionsId)) throw new ApiError(400, "interventionsId invalide ou manquant");
  if (!statut) {
    throw new ApiError(400, "statut invalide ou manquant. Valeurs acceptées : Présent, Absent, Congé, Maladie, Déplacement");
  }

  return prisma.presence.create({
    data: {
      technicienId,
      interventionsId,
      statut,
      date: data.date ? new Date(data.date) : undefined,
    },
  });
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
