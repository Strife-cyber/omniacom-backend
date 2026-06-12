import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";

const SALT_ROUNDS = 12;

/**
 * Inscrit un nouvel utilisateur.
 * @param {Object} donnees - { email, nom, motDePasse, role? }
 * @returns {Promise<Object>} Utilisateur cree et token
 */
export async function register(donnees) {
  const { email, nom, motDePasse, role } = donnees;

  // Verifier si l email est deja pris
  const existant = await prisma.utilisateur.findUnique({ where: { email } });
  if (existant) {
    throw new ApiError(409, "Cet email est deja utilise");
  }

  // Hasher le mot de passe
  const motDePasseHash = await bcrypt.hash(motDePasse, SALT_ROUNDS);

  // Creer l utilisateur
  const utilisateur = await prisma.utilisateur.create({
    data: {
      email,
      nom,
      motDePasse: motDePasseHash,
      role: role || "UTILISATEUR",
    },
    select: {
      id: true,
      email: true,
      nom: true,
      role: true,
      createdAt: true,
    },
  });

  // Generer le token
  const token = genererToken(utilisateur);

  return { utilisateur, token };
}

/**
 * Connecte un utilisateur existant.
 * @param {string} email
 * @param {string} motDePasse
 * @returns {Promise<Object>} Utilisateur et token
 */
export async function login(email, motDePasse) {
  // Chercher l utilisateur par email (on a besoin du mot de passe hash)
  const utilisateur = await prisma.utilisateur.findUnique({ where: { email } });
  if (!utilisateur) {
    throw new ApiError(401, "Email ou mot de passe incorrect");
  }

  // Verifier le mot de passe
  const valide = await bcrypt.compare(motDePasse, utilisateur.motDePasse);
  if (!valide) {
    throw new ApiError(401, "Email ou mot de passe incorrect");
  }

  // Ne pas renvoyer le mot de passe
  const { motDePasse: _, ...sansMdp } = utilisateur;
  const token = genererToken(sansMdp);

  return { utilisateur: sansMdp, token };
}

/**
 * Renvoie le profil de l utilisateur connecte.
 * @param {number} id
 * @returns {Promise<Object>}
 */
export async function getProfil(id) {
  const utilisateur = await prisma.utilisateur.findUnique({
    where: { id },
    select: { id: true, email: true, nom: true, role: true, createdAt: true },
  });

  if (!utilisateur) {
    throw new ApiError(404, "Utilisateur introuvable");
  }

  return utilisateur;
}

/**
 * Rafraichit un token JWT.
 * @param {number} id - ID utilisateur
 * @returns {string} Nouveau token
 */
export function genererToken(utilisateur) {
  const payload = {
    id: utilisateur.id,
    email: utilisateur.email,
    nom: utilisateur.nom,
    role: utilisateur.role,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}
