import * as service from "../services/utilisateur.service.js";
import { filterOutput } from "../middlewares/authorize.js";
import { buildUploadUrl } from "../middlewares/upload.js";
import { API_PUBLIC_URL } from "../config/env.js";

// =============================================================================
// Controleur Utilisateur
// =============================================================================

/**
 * @openapi
 * /api/utilisateurs:
 *   get:
 *     tags:
 *       - Utilisateur
 *     summary: Liste tous les utilisateurs
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
export async function getAll(req, res, next) {
  try {
    const items = await service.findAll();
    res.json({ success: true, data: filterOutput(req.user, items, "Utilisateur") });
  } catch (err) {
    next(err);
  }
}

/**
 * @openapi
 * /api/utilisateurs/{id}:
 *   get:
 *     tags:
 *       - Utilisateur
 *     summary: Recupere un utilisateur par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant du utilisateur
 *     responses:
 *       200:
 *         description: Utilisateur trouve
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *       404:
 *         $ref: '#/components/responses/ErrorResponse'
 */
export async function getById(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const item = await service.findById(id);
    res.json({ success: true, data: filterOutput(req.user, item, "Utilisateur") });
  } catch (err) {
    next(err);
  }
}

/**
 * @openapi
 * /api/utilisateurs:
 *   post:
 *     tags:
 *       - Utilisateur
 *     summary: Cree un nouveau utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               nom:
 *                 type: string
 *               motDePasse:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utilisateur cree avec succes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
export async function create(req, res, next) {
  try {
    const item = await service.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

/**
 * @openapi
 * /api/utilisateurs/{id}:
 *   put:
 *     tags:
 *       - Utilisateur
 *     summary: Met a jour un utilisateur existant
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant du utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               nom:
 *                 type: string
 *               motDePasse:
 *                 type: string
 *     responses:
 *       200:
 *         description: Utilisateur mis a jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *       404:
 *         $ref: '#/components/responses/ErrorResponse'
 */
export async function update(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const item = await service.update(id, req.body);
    res.json({ success: true, data: filterOutput(req.user, item, "Utilisateur") });
  } catch (err) {
    next(err);
  }
}

/**
 * @openapi
 * /api/utilisateurs/{id}:
 *   delete:
 *     tags:
 *       - Utilisateur
 *     summary: Supprime un utilisateur
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant du utilisateur
 *     responses:
 *       204:
 *         description: Utilisateur supprime avec succes (pas de contenu)
 *       404:
 *         $ref: '#/components/responses/ErrorResponse'
 */
export async function remove(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    await service.remove(id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function uploadPhoto(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (!req.file) {
      res.status(400).json({ success: false, message: "Photo requise" });
      return;
    }
    const photoUrl = `${API_PUBLIC_URL}${buildUploadUrl("users", req.file.filename)}`;
    const item = await service.setPhotoUrl(id, photoUrl);
    res.json({ success: true, data: filterOutput(req.user, item, "Utilisateur") });
  } catch (err) {
    next(err);
  }
}
