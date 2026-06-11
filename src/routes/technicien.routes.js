import { Router } from "express";
import * as controller from "../controllers/technicien.controller.js";

const router = Router();

// GET    /api/techniciens      -> Liste tous les techniciens
// GET    /api/techniciens/{id} -> Detail d un technicien
// POST   /api/techniciens      -> Creer un technicien
// PUT    /api/techniciens/{id} -> Mettre a jour un technicien
// DELETE /api/techniciens/{id} -> Supprimer un technicien

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

export default router;
