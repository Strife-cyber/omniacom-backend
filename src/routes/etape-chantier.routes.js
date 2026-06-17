import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import * as controller from "../controllers/etape-chantier.controller.js";

const router = Router();

// GET    /api/etape-chantiers      -> Liste tous les etape-chantiers
// GET    /api/etape-chantiers/{id} -> Detail d un etape-chantier
// POST   /api/etape-chantiers      -> Creer un etape-chantier
// PUT    /api/etape-chantiers/{id} -> Mettre a jour un etape-chantier
// DELETE /api/etape-chantiers/{id} -> Supprimer un etape-chantier

router.get("/", authenticate, authorize("read", "EtapeChantier"), controller.getAll);
router.get("/:id", authenticate, authorize("read", "EtapeChantier"), controller.getById);
router.post("/", authenticate, authorize("create", "EtapeChantier"), controller.create);
router.put("/:id", authenticate, authorize("update", "EtapeChantier"), controller.update);
router.delete("/:id", authenticate, authorize("delete", "EtapeChantier"), controller.remove);

export default router;
