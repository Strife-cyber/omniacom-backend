import * as service from "../services/presence.service.js";
import { filterOutput } from "../middlewares/authorize.js";

// =============================================================================
// Controleur Presence
// =============================================================================

/**
 * @openapi
 * /api/presences:
 *   get:
 *     tags:
 *       - Presence
 *     summary: Liste tous les presences
 *     responses:
 *       200:
 *         description: Liste des presences
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
      data: filterOutput(req.user, result.data, "Presence"),
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
 * /api/presences/{id}:
 *   get:
 *     tags:
 *       - Presence
 *     summary: Recupere un presence par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant du presence
 *     responses:
 *       200:
 *         description: Presence trouve
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
    res.json({ success: true, data: filterOutput(req.user, item, "Presence") });
  } catch (err) {
    next(err);
  }
}

/**
 * @openapi
 * /api/presences:
 *   post:
 *     tags:
 *       - Presence
 *     summary: Cree un nouveau presence
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               technicienId:
 *                 type: integer
 *               interventionsId:
 *                 type: integer
 *               date:
 *                 type: string
 *     responses:
 *       201:
 *         description: Presence cree avec succes
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
 * /api/presences/{id}:
 *   put:
 *     tags:
 *       - Presence
 *     summary: Met a jour un presence existant
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant du presence
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               technicienId:
 *                 type: integer
 *               interventionsId:
 *                 type: integer
 *               date:
 *                 type: string
 *     responses:
 *       200:
 *         description: Presence mis a jour
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
    res.json({ success: true, data: filterOutput(req.user, item, "Presence") });
  } catch (err) {
    next(err);
  }
}

/**
 * @openapi
 * /api/presences/{id}:
 *   delete:
 *     tags:
 *       - Presence
 *     summary: Supprime un presence
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant du presence
 *     responses:
 *       204:
 *         description: Presence supprime avec succes (pas de contenu)
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
