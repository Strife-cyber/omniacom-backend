import { Router } from "express";
import * as controller from "../controllers/intervention.controller.js";

const router = Router();

// GET    /api/interventions      -> Liste tous les interventions
// GET    /api/interventions/{id} -> Detail d un intervention
// POST   /api/interventions      -> Creer un intervention
// PUT    /api/interventions/{id} -> Mettre a jour un intervention
// DELETE /api/interventions/{id} -> Supprimer un intervention

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

export default router;
