import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import * as controller from "../controllers/presence.controller.js";

const router = Router();

// GET    /api/presences      -> Liste tous les presences
// GET    /api/presences/{id} -> Detail d un presence
// POST   /api/presences      -> Creer un presence
// PUT    /api/presences/{id} -> Mettre a jour un presence
// DELETE /api/presences/{id} -> Supprimer un presence

router.get("/", authenticate, authorize("read", "Presence"), controller.getAll);
router.get("/:id", authenticate, authorize("read", "Presence"), controller.getById);
router.post("/", authenticate, authorize("create", "Presence"), controller.create);
router.put("/:id", authenticate, authorize("update", "Presence"), controller.update);
router.delete("/:id", authenticate, authorize("delete", "Presence"), controller.remove);

export default router;
