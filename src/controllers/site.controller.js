import * as service from "../services/site.service.js";
import { filterOutput } from "../middlewares/authorize.js";

// =============================================================================
// Controleur Site
// =============================================================================

/**
 * @openapi
 * /api/sites:
 *   get:
 *     tags:
 *       - Site
 *     summary: Liste tous les sites
 *     responses:
 *       200:
 *         description: Liste des sites
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
      data: filterOutput(req.user, result.data, "Site"),
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
 * /api/sites/{id}:
 *   get:
 *     tags:
 *       - Site
 *     summary: Recupere un site par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant du site
 *     responses:
 *       200:
 *         description: Site trouve
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
    res.json({ success: true, data: filterOutput(req.user, item, "Site") });
  } catch (err) {
    next(err);
  }
}

/**
 * @openapi
 * /api/sites:
 *   post:
 *     tags:
 *       - Site
 *     summary: Cree un nouveau site
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               localisation:
 *                 type: string
 *               region:
 *                 type: string
 *     responses:
 *       201:
 *         description: Site cree avec succes
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
 * /api/sites/{id}:
 *   put:
 *     tags:
 *       - Site
 *     summary: Met a jour un site existant
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant du site
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               localisation:
 *                 type: string
 *               region:
 *                 type: string
 *     responses:
 *       200:
 *         description: Site mis a jour
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
    res.json({ success: true, data: filterOutput(req.user, item, "Site") });
  } catch (err) {
    next(err);
  }
}

/**
 * @openapi
 * /api/sites/{id}:
 *   delete:
 *     tags:
 *       - Site
 *     summary: Supprime un site
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant du site
 *     responses:
 *       204:
 *         description: Site supprime avec succes (pas de contenu)
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
