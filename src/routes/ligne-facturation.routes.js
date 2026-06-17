import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import * as controller from "../controllers/ligne-facturation.controller.js";

const router = Router();

// GET    /api/ligne-facturations      -> Liste tous les ligne-facturations
// GET    /api/ligne-facturations/{id} -> Detail d un ligne-facturation
// POST   /api/ligne-facturations      -> Creer un ligne-facturation
// PUT    /api/ligne-facturations/{id} -> Mettre a jour un ligne-facturation
// DELETE /api/ligne-facturations/{id} -> Supprimer un ligne-facturation

router.get("/", authenticate, authorize("read", "LigneFacturation"), controller.getAll);
router.get("/:id", authenticate, authorize("read", "LigneFacturation"), controller.getById);
router.post("/", authenticate, authorize("create", "LigneFacturation"), controller.create);
router.put("/:id", authenticate, authorize("update", "LigneFacturation"), controller.update);
router.delete("/:id", authenticate, authorize("delete", "LigneFacturation"), controller.remove);

export default router;
