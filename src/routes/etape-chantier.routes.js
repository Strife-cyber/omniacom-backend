import { Router } from "express";
import * as controller from "../controllers/etape-chantier.controller.js";

const router = Router();

// GET    /api/etape-chantiers      -> Liste tous les etape-chantiers
// GET    /api/etape-chantiers/{id} -> Detail d un etape-chantier
// POST   /api/etape-chantiers      -> Creer un etape-chantier
// PUT    /api/etape-chantiers/{id} -> Mettre a jour un etape-chantier
// DELETE /api/etape-chantiers/{id} -> Supprimer un etape-chantier

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

export default router;
