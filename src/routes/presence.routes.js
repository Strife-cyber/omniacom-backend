import { Router } from "express";
import * as controller from "../controllers/presence.controller.js";

const router = Router();

// GET    /api/presences      -> Liste tous les presences
// GET    /api/presences/{id} -> Detail d un presence
// POST   /api/presences      -> Creer un presence
// PUT    /api/presences/{id} -> Mettre a jour un presence
// DELETE /api/presences/{id} -> Supprimer un presence

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

export default router;
