import * as service from "../services/verification-e-p-i_-equipement.service.js";
import { filterOutput } from "../middlewares/authorize.js";

// =============================================================================
// Controleur VerificationEPI_Equipement
// =============================================================================

/**
 * @openapi
 * /api/verification-e-p-i_-equipements:
 *   get:
 *     tags:
 *       - VerificationEPI_Equipement
 *     summary: Liste tous les verification-e-p-i_-equipements
 *     responses:
 *       200:
 *         description: Liste des verification-e-p-i_-equipements
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
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 20;

    const result = await service.findAll(page, pageSize);

    res.json({
      success: true,
      data: filterOutput(req.user, result.data, "VerificationEPI_Equipement"),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
      totalPages: result.totalPages,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * @openapi
 * /api/verification-e-p-i_-equipements/{id}:
 *   get:
 *     tags:
 *       - VerificationEPI_Equipement
 *     summary: Recupere un verification-e-p-i_-equipement par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant du verification-e-p-i_-equipement
 *     responses:
 *       200:
 *         description: VerificationEPI_Equipement trouve
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
    res.json({ success: true, data: filterOutput(req.user, item, "VerificationEPI_Equipement") });
  } catch (err) {
    next(err);
  }
}

/**
 * @openapi
 * /api/verification-e-p-i_-equipements:
 *   post:
 *     tags:
 *       - VerificationEPI_Equipement
 *     summary: Cree un nouveau verification-e-p-i_-equipement
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               verificationEpiId:
 *                 type: integer
 *               equipementsId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: VerificationEPI_Equipement cree avec succes
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
 * /api/verification-e-p-i_-equipements/{id}:
 *   put:
 *     tags:
 *       - VerificationEPI_Equipement
 *     summary: Met a jour un verification-e-p-i_-equipement existant
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant du verification-e-p-i_-equipement
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               verificationEpiId:
 *                 type: integer
 *               equipementsId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: VerificationEPI_Equipement mis a jour
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
    res.json({ success: true, data: filterOutput(req.user, item, "VerificationEPI_Equipement") });
  } catch (err) {
    next(err);
  }
}

/**
 * @openapi
 * /api/verification-e-p-i_-equipements/{id}:
 *   delete:
 *     tags:
 *       - VerificationEPI_Equipement
 *     summary: Supprime un verification-e-p-i_-equipement
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant du verification-e-p-i_-equipement
 *     responses:
 *       204:
 *         description: VerificationEPI_Equipement supprime avec succes (pas de contenu)
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
