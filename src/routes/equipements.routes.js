import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import * as controller from "../controllers/equipements.controller.js";

const router = Router();

// GET    /api/equipementss      -> Liste tous les equipementss
// GET    /api/equipementss/{id} -> Detail d un equipements
// POST   /api/equipementss      -> Creer un equipements
// PUT    /api/equipementss/{id} -> Mettre a jour un equipements
// DELETE /api/equipementss/{id} -> Supprimer un equipements

router.get("/", authenticate, authorize("read", "Equipements"), controller.getAll);
router.get("/:id", authenticate, authorize("read", "Equipements"), controller.getById);
router.post("/", authenticate, authorize("create", "Equipements"), controller.create);
router.put("/:id", authenticate, authorize("update", "Equipements"), controller.update);
router.delete("/:id", authenticate, authorize("delete", "Equipements"), controller.remove);

export default router;
