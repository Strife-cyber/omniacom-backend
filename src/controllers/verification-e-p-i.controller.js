import * as service from "../services/verification-e-p-i.service.js";
import { filterOutput } from "../middlewares/authorize.js";

// =============================================================================
// Controleur VerificationEPI
// =============================================================================

/**
 * @openapi
 * /api/verification-e-p-is:
 *   get:
 *     tags:
 *       - VerificationEPI
 *     summary: Liste tous les verification-e-p-is
 *     responses:
 *       200:
 *         description: Liste des verification-e-p-is
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
      data: filterOutput(req.user, result.data, "VerificationEPI"),
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
 * /api/verification-e-p-is/{id}:
 *   get:
 *     tags:
 *       - VerificationEPI
 *     summary: Recupere un verification-e-p-i par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant du verification-e-p-i
 *     responses:
 *       200:
 *         description: VerificationEPI trouve
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
    res.json({ success: true, data: filterOutput(req.user, item, "VerificationEPI") });
  } catch (err) {
    next(err);
  }
}

/**
 * @openapi
 * /api/verification-e-p-is:
 *   post:
 *     tags:
 *       - VerificationEPI
 *     summary: Cree un nouveau verification-e-p-i
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               technicienId:
 *                 type: integer
 *               dateDerniereVerif:
 *                 type: string
 *               dateDemande:
 *                 type: string
 *               dateEnvoie:
 *                 type: string
 *               joursRetard:
 *                 type: integer
 *               prochaineDate:
 *                 type: string
 *     responses:
 *       201:
 *         description: VerificationEPI cree avec succes
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
 * /api/verification-e-p-is/{id}:
 *   put:
 *     tags:
 *       - VerificationEPI
 *     summary: Met a jour un verification-e-p-i existant
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant du verification-e-p-i
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               technicienId:
 *                 type: integer
 *               dateDerniereVerif:
 *                 type: string
 *               dateDemande:
 *                 type: string
 *               dateEnvoie:
 *                 type: string
 *               joursRetard:
 *                 type: integer
 *               prochaineDate:
 *                 type: string
 *     responses:
 *       200:
 *         description: VerificationEPI mis a jour
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
    res.json({ success: true, data: filterOutput(req.user, item, "VerificationEPI") });
  } catch (err) {
    next(err);
  }
}

/**
 * @openapi
 * /api/verification-e-p-is/{id}:
 *   delete:
 *     tags:
 *       - VerificationEPI
 *     summary: Supprime un verification-e-p-i
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant du verification-e-p-i
 *     responses:
 *       204:
 *         description: VerificationEPI supprime avec succes (pas de contenu)
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
