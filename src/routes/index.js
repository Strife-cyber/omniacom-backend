import { Router } from "express";
import exempleRoutes from "./exemple.routes.js";
import authRoutes from "../auth/auth.routes.js";
import utilisateurRoutes from "./utilisateur.routes.js";
import technicienRoutes from "./technicien.routes.js";
import siteRoutes from "./site.routes.js";
import interventionRoutes from "./intervention.routes.js";
import equipementsRoutes from "./equipements.routes.js";
import verificationEPIRoutes from "./verification-e-p-i.routes.js";
import presenceRoutes from "./presence.routes.js";
import chantierRoutes from "./chantier.routes.js";
import bonDeCommandeRoutes from "./bon-de-commande.routes.js";
import etapeChantierRoutes from "./etape-chantier.routes.js";
import ligneFacturationRoutes from "./ligne-facturation.routes.js";
import verificationEPI_EquipementRoutes from "./verification-e-p-i_-equipement.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/exemple", exempleRoutes);
router.use("/utilisateurs", utilisateurRoutes);
router.use("/techniciens", technicienRoutes);
router.use("/sites", siteRoutes);
router.use("/interventions", interventionRoutes);
router.use("/equipements", equipementsRoutes);
router.use("/verifications-epi", verificationEPIRoutes);
router.use("/presences", presenceRoutes);
router.use("/chantiers", chantierRoutes);
router.use("/bons-de-commande", bonDeCommandeRoutes);
router.use("/etapes-chantier", etapeChantierRoutes);
router.use("/lignes-facturation", ligneFacturationRoutes);
router.use("/epi-equipements", verificationEPI_EquipementRoutes);

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
