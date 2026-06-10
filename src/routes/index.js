import { Router } from "express";
import exempleRoutes from "./exemple.routes.js";

const router = Router();

// Ajoutez vos routes ici :
// router.use("/utilisateurs", utilisateurRoutes);
// router.use("/produits", produitRoutes);
// router.use("/commandes", commandeRoutes);

router.use("/exemple", exempleRoutes);

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API OmniaCom en fonctionnement",
    version: "1.0.0",
  });
});

export default router;
