import * as service from "../services/intervention.service.js";
import { filterOutput } from "../middlewares/authorize.js";

// =============================================================================
// Controleur Intervention
// =============================================================================

/**
 * @openapi
 * /api/interventions:
 *   get:
 *     tags:
 *       - Intervention
 *     summary: Liste tous les interventions
 *     responses:
 *       200:
 *         description: Liste des interventions
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
      data: filterOutput(req.user, result.data, "Intervention"),
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
 * /api/interventions/{id}:
 *   get:
 *     tags:
 *       - Intervention
 *     summary: Recupere un intervention par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant du intervention
 *     responses:
 *       200:
 *         description: Intervention trouve
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
    res.json({ success: true, data: filterOutput(req.user, item, "Intervention") });
  } catch (err) {
    next(err);
  }
}

/**
 * @openapi
 * /api/interventions:
 *   post:
 *     tags:
 *       - Intervention
 *     summary: Cree un nouveau intervention
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               siteId:
 *                 type: integer
 *               technicienId:
 *                 type: integer
 *               timestampDebut:
 *                 type: string
 *               timestampFin:
 *                 type: string
 *     responses:
 *       201:
 *         description: Intervention cree avec succes
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
 * /api/interventions/{id}:
 *   put:
 *     tags:
 *       - Intervention
 *     summary: Met a jour un intervention existant
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant du intervention
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               siteId:
 *                 type: integer
 *               technicienId:
 *                 type: integer
 *               timestampDebut:
 *                 type: string
 *               timestampFin:
 *                 type: string
 *     responses:
 *       200:
 *         description: Intervention mis a jour
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
    res.json({ success: true, data: filterOutput(req.user, item, "Intervention") });
  } catch (err) {
    next(err);
  }
}

/**
 * @openapi
 * /api/interventions/{id}:
 *   delete:
 *     tags:
 *       - Intervention
 *     summary: Supprime un intervention
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant du intervention
 *     responses:
 *       204:
 *         description: Intervention supprime avec succes (pas de contenu)
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
