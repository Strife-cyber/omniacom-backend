import { Router } from "express";
import * as controller from "../controllers/chantier.controller.js";

const router = Router();

// GET    /api/chantiers      -> Liste tous les chantiers
// GET    /api/chantiers/{id} -> Detail d un chantier
// POST   /api/chantiers      -> Creer un chantier
// PUT    /api/chantiers/{id} -> Mettre a jour un chantier
// DELETE /api/chantiers/{id} -> Supprimer un chantier

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

export default router;
