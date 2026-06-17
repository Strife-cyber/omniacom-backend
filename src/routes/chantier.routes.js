import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import * as controller from "../controllers/chantier.controller.js";

const router = Router();

// GET    /api/chantiers      -> Liste tous les chantiers
// GET    /api/chantiers/{id} -> Detail d un chantier
// POST   /api/chantiers      -> Creer un chantier
// PUT    /api/chantiers/{id} -> Mettre a jour un chantier
// DELETE /api/chantiers/{id} -> Supprimer un chantier

router.get("/", authenticate, authorize("read", "Chantier"), controller.getAll);
router.get("/:id", authenticate, authorize("read", "Chantier"), controller.getById);
router.post("/", authenticate, authorize("create", "Chantier"), controller.create);
router.put("/:id", authenticate, authorize("update", "Chantier"), controller.update);
router.delete("/:id", authenticate, authorize("delete", "Chantier"), controller.remove);

export default router;
