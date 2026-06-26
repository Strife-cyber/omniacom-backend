import * as service from "../services/ligne-facturation.service.js";
import { filterOutput } from "../middlewares/authorize.js";

// =============================================================================
// Controleur LigneFacturation
// =============================================================================

/**
 * @openapi
 * /api/ligne-facturations:
 *   get:
 *     tags:
 *       - LigneFacturation
 *     summary: Liste tous les ligne-facturations
 *     responses:
 *       200:
 *         description: Liste des ligne-facturations
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
    res.json({ success: true, data: filterOutput(req.user, items, "LigneFacturation") });
  } catch (err) {
    next(err);
  }
}

/**
 * @openapi
 * /api/ligne-facturations/{id}:
 *   get:
 *     tags:
 *       - LigneFacturation
 *     summary: Recupere un ligne-facturation par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant du ligne-facturation
 *     responses:
 *       200:
 *         description: LigneFacturation trouve
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
    res.json({ success: true, data: filterOutput(req.user, item, "LigneFacturation") });
  } catch (err) {
    next(err);
  }
}

/**
 * @openapi
 * /api/ligne-facturations:
 *   post:
 *     tags:
 *       - LigneFacturation
 *     summary: Cree un nouveau ligne-facturation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bonDeCommandeId:
 *                 type: integer
 *               montantHt:
 *                 type: number
 *               statutPaiement:
 *                 type: string
 *               dateFacture:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: LigneFacturation cree avec succes
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
 * /api/ligne-facturations/{id}:
 *   put:
 *     tags:
 *       - LigneFacturation
 *     summary: Met a jour un ligne-facturation existant
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant du ligne-facturation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bonDeCommandeId:
 *                 type: integer
 *               montantHt:
 *                 type: number
 *               statutPaiement:
 *                 type: string
 *               dateFacture:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: LigneFacturation mis a jour
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
    res.json({ success: true, data: filterOutput(req.user, item, "LigneFacturation") });
  } catch (err) {
    next(err);
  }
}

/**
 * @openapi
 * /api/ligne-facturations/{id}:
 *   delete:
 *     tags:
 *       - LigneFacturation
 *     summary: Supprime un ligne-facturation
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant du ligne-facturation
 *     responses:
 *       204:
 *         description: LigneFacturation supprime avec succes (pas de contenu)
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
