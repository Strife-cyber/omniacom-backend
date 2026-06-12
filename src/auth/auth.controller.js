import * as authService from "./auth.service.js";

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Authentification
 *     summary: Inscrit un nouvel utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - nom
 *               - motDePasse
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               nom:
 *                 type: string
 *               motDePasse:
 *                 type: string
 *                 format: password
 *               role:
 *                 type: string
 *                 enum: [ADMIN, UTILISATEUR, GESTIONNAIRE_EPI, GESTIONNAIRE_PLANNING]
 *     responses:
 *       201:
 *         description: Utilisateur cree avec succes
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
 *                   properties:
 *                     utilisateur:
 *                       $ref: '#/components/schemas/Utilisateur'
 *                     token:
 *                       type: string
 *       409:
 *         $ref: '#/components/responses/ErrorResponse'
 */
export async function register(req, res, next) {
  try {
    const resultat = await authService.register(req.body);
    res.status(201).json({ success: true, data: resultat });
  } catch (err) {
    next(err);
  }
}

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Authentification
 *     summary: Connecte un utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - motDePasse
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               motDePasse:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Connexion reussie
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
 *                   properties:
 *                     utilisateur:
 *                       $ref: '#/components/schemas/Utilisateur'
 *                     token:
 *                       type: string
 *       401:
 *         $ref: '#/components/responses/ErrorResponse'
 */
export async function login(req, res, next) {
  try {
    const { email, motDePasse } = req.body;
    const resultat = await authService.login(email, motDePasse);
    res.json({ success: true, data: resultat });
  } catch (err) {
    next(err);
  }
}

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     tags:
 *       - Authentification
 *     summary: Renvoie le profil de l'utilisateur connecte
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Utilisateur'
 *       401:
 *         $ref: '#/components/responses/ErrorResponse'
 */
export async function me(req, res, next) {
  try {
    const utilisateur = await authService.getProfil(req.user.id);
    res.json({ success: true, data: utilisateur });
  } catch (err) {
    next(err);
  }
}
