import * as service from "../services/chantier.service.js";
import { filterOutput } from "../middlewares/authorize.js";

// =============================================================================
// Controleur Chantier
// =============================================================================

/**
 * @openapi
 * /api/chantiers:
 *   get:
 *     tags:
 *       - Chantier
 *     summary: Liste tous les chantiers
 *     responses:
 *       200:
 *         description: Liste des chantiers
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
    res.json({ success: true, data: filterOutput(req.user, items, "Chantier") });
  } catch (err) {
    next(err);
  }
}

/**
 * @openapi
 * /api/chantiers/{id}:
 *   get:
 *     tags:
 *       - Chantier
 *     summary: Recupere un chantier par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant du chantier
 *     responses:
 *       200:
 *         description: Chantier trouve
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
    res.json({ success: true, data: filterOutput(req.user, item, "Chantier") });
  } catch (err) {
    next(err);
  }
}

/**
 * @openapi
 * /api/chantiers:
 *   post:
 *     tags:
 *       - Chantier
 *     summary: Cree un nouveau chantier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               entreprise:
 *                 type: string
 *               codeSite:
 *                 type: string
 *               nomSite:
 *                 type: string
 *               typeSite:
 *                 type: string
 *               avancementPlanifie:
 *                 type: number
 *               avancementReel:
 *                 type: number
 *               dateGo:
 *                 type: string
 *     responses:
 *       201:
 *         description: Chantier cree avec succes
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
 * /api/chantiers/{id}:
 *   put:
 *     tags:
 *       - Chantier
 *     summary: Met a jour un chantier existant
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant du chantier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               entreprise:
 *                 type: string
 *               codeSite:
 *                 type: string
 *               nomSite:
 *                 type: string
 *               typeSite:
 *                 type: string
 *               avancementPlanifie:
 *                 type: number
 *               avancementReel:
 *                 type: number
 *               dateGo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Chantier mis a jour
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
    res.json({ success: true, data: filterOutput(req.user, item, "Chantier") });
  } catch (err) {
    next(err);
  }
}

/**
 * @openapi
 * /api/chantiers/{id}:
 *   delete:
 *     tags:
 *       - Chantier
 *     summary: Supprime un chantier
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant du chantier
 *     responses:
 *       204:
 *         description: Chantier supprime avec succes (pas de contenu)
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
