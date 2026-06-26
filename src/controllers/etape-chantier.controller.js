import * as service from "../services/etape-chantier.service.js";
import { filterOutput } from "../middlewares/authorize.js";

// =============================================================================
// Controleur EtapeChantier
// =============================================================================

/**
 * @openapi
 * /api/etape-chantiers:
 *   get:
 *     tags:
 *       - EtapeChantier
 *     summary: Liste tous les etape-chantiers
 *     responses:
 *       200:
 *         description: Liste des etape-chantiers
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
    const items = await service.findAll(req.query);
    res.json({ success: true, data: filterOutput(req.user, items, "EtapeChantier") });
  } catch (err) {
    next(err);
  }
}

/**
 * @openapi
 * /api/etape-chantiers/{id}:
 *   get:
 *     tags:
 *       - EtapeChantier
 *     summary: Recupere un etape-chantier par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant du etape-chantier
 *     responses:
 *       200:
 *         description: EtapeChantier trouve
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
    res.json({ success: true, data: filterOutput(req.user, item, "EtapeChantier") });
  } catch (err) {
    next(err);
  }
}

/**
 * @openapi
 * /api/etape-chantiers:
 *   post:
 *     tags:
 *       - EtapeChantier
 *     summary: Cree un nouveau etape-chantier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chantierId:
 *                 type: integer
 *               nomEtape:
 *                 type: string
 *               datePlanifiee:
 *                 type: string
 *               dateReelle:
 *                 type: string
 *               retardMinutes:
 *                 type: integer
 *     responses:
 *       201:
 *         description: EtapeChantier cree avec succes
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
 * /api/etape-chantiers/{id}:
 *   put:
 *     tags:
 *       - EtapeChantier
 *     summary: Met a jour un etape-chantier existant
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant du etape-chantier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chantierId:
 *                 type: integer
 *               nomEtape:
 *                 type: string
 *               datePlanifiee:
 *                 type: string
 *               dateReelle:
 *                 type: string
 *               retardMinutes:
 *                 type: integer
 *     responses:
 *       200:
 *         description: EtapeChantier mis a jour
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
    res.json({ success: true, data: filterOutput(req.user, item, "EtapeChantier") });
  } catch (err) {
    next(err);
  }
}

/**
 * @openapi
 * /api/etape-chantiers/{id}:
 *   delete:
 *     tags:
 *       - EtapeChantier
 *     summary: Supprime un etape-chantier
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant du etape-chantier
 *     responses:
 *       204:
 *         description: EtapeChantier supprime avec succes (pas de contenu)
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
