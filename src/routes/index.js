import { Router } from "express";
import exempleRoutes from "./exemple.routes.js";
import utilisateurRoutes from "./utilisateur.routes.js";
import technicienRoutes from "./technicien.routes.js";
import siteRoutes from "./site.routes.js";
import interventionRoutes from "./intervention.routes.js";

const router = Router();

// Ajoutez vos routes ici :
// router.use("/utilisateurs", utilisateurRoutes);
// router.use("/produits", produitRoutes);
// router.use("/commandes", commandeRoutes);

router.use("/exemple", exempleRoutes);

router.use("/utilisateurs", utilisateurRoutes);
router.use("/techniciens", technicienRoutes);
router.use("/sites", siteRoutes);
router.use("/interventions", interventionRoutes);
/**
 * @openapi
 * /api:
 *   get:
 *     tags:
 *       - Sante
 *     summary: Verifie le fonctionnement de l'API
 *     responses:
 *       200:
 *         description: API fonctionnelle
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "API OmniaCom en fonctionnement"
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 */
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API OmniaCom en fonctionnement",
    version: "1.0.0",
  });
});

export default router;
