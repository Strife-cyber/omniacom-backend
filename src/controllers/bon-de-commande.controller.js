import * as service from "../services/bon-de-commande.service.js";
import { filterOutput } from "../middlewares/authorize.js";

// =============================================================================
// Controleur BonDeCommande
// =============================================================================

/**
 * @openapi
 * /api/bon-de-commandes:
 *   get:
 *     tags:
 *       - BonDeCommande
 *     summary: Liste tous les bon-de-commandes
 *     responses:
 *       200:
 *         description: Liste des bon-de-commandes
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
      data: filterOutput(req.user, result.data, "BonDeCommande"),
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
 * /api/bon-de-commandes/{id}:
 *   get:
 *     tags:
 *       - BonDeCommande
 *     summary: Recupere un bon-de-commande par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant du bon-de-commande
 *     responses:
 *       200:
 *         description: BonDeCommande trouve
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
    res.json({ success: true, data: filterOutput(req.user, item, "BonDeCommande") });
  } catch (err) {
    next(err);
  }
}

/**
 * @openapi
 * /api/bon-de-commandes:
 *   post:
 *     tags:
 *       - BonDeCommande
 *     summary: Cree un nouveau bon-de-commande
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chantierId:
 *                 type: integer
 *               numeroBc:
 *                 type: string
 *               montantPo:
 *                 type: number
 *               montantFacture:
 *                 type: number
 *               montantRestant:
 *                 type: number
 *               projetAssocie:
 *                 type: string
 *     responses:
 *       201:
 *         description: BonDeCommande cree avec succes
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
 * /api/bon-de-commandes/{id}:
 *   put:
 *     tags:
 *       - BonDeCommande
 *     summary: Met a jour un bon-de-commande existant
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant du bon-de-commande
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chantierId:
 *                 type: integer
 *               numeroBc:
 *                 type: string
 *               montantPo:
 *                 type: number
 *               montantFacture:
 *                 type: number
 *               montantRestant:
 *                 type: number
 *               projetAssocie:
 *                 type: string
 *     responses:
 *       200:
 *         description: BonDeCommande mis a jour
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
    res.json({ success: true, data: filterOutput(req.user, item, "BonDeCommande") });
  } catch (err) {
    next(err);
  }
}

/**
 * @openapi
 * /api/bon-de-commandes/{id}:
 *   delete:
 *     tags:
 *       - BonDeCommande
 *     summary: Supprime un bon-de-commande
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant du bon-de-commande
 *     responses:
 *       204:
 *         description: BonDeCommande supprime avec succes (pas de contenu)
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
