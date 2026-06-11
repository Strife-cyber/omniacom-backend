import * as service from "../services/technicien.service.js";

// =============================================================================
// Controleur Technicien
// =============================================================================

/**
 * @openapi
 * /api/techniciens:
 *   get:
 *     tags:
 *       - Technicien
 *     summary: Liste tous les techniciens
 *     responses:
 *       200:
 *         description: Liste des techniciens
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
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
}

/**
 * @openapi
 * /api/techniciens/{id}:
 *   get:
 *     tags:
 *       - Technicien
 *     summary: Recupere un technicien par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant du technicien
 *     responses:
 *       200:
 *         description: Technicien trouve
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
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

/**
 * @openapi
 * /api/techniciens:
 *   post:
 *     tags:
 *       - Technicien
 *     summary: Cree un nouveau technicien
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               telephone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Technicien cree avec succes
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
 * /api/techniciens/{id}:
 *   put:
 *     tags:
 *       - Technicien
 *     summary: Met a jour un technicien existant
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant du technicien
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               telephone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Technicien mis a jour
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
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

/**
 * @openapi
 * /api/techniciens/{id}:
 *   delete:
 *     tags:
 *       - Technicien
 *     summary: Supprime un technicien
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant du technicien
 *     responses:
 *       204:
 *         description: Technicien supprime avec succes (pas de contenu)
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
