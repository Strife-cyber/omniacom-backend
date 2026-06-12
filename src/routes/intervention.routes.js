import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import * as controller from "../controllers/intervention.controller.js";

const router = Router();

// GET    /api/interventions      -> Liste tous les interventions
// GET    /api/interventions/{id} -> Detail d un intervention
// POST   /api/interventions      -> Creer un intervention
// PUT    /api/interventions/{id} -> Mettre a jour un intervention
// DELETE /api/interventions/{id} -> Supprimer un intervention

router.get("/", authenticate, authorize("read", "Intervention"), controller.getAll);
router.get("/:id", authenticate, authorize("read", "Intervention"), controller.getById);
router.post("/", authenticate, authorize("create", "Intervention"), controller.create);
router.put("/:id", authenticate, authorize("update", "Intervention"), controller.update);
router.delete("/:id", authenticate, authorize("delete", "Intervention"), controller.remove);

export default router;
