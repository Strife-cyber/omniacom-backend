import { Router } from "express";
import * as controller from "../controllers/ligne-facturation.controller.js";

const router = Router();

// GET    /api/ligne-facturations      -> Liste tous les ligne-facturations
// GET    /api/ligne-facturations/{id} -> Detail d un ligne-facturation
// POST   /api/ligne-facturations      -> Creer un ligne-facturation
// PUT    /api/ligne-facturations/{id} -> Mettre a jour un ligne-facturation
// DELETE /api/ligne-facturations/{id} -> Supprimer un ligne-facturation

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

export default router;
