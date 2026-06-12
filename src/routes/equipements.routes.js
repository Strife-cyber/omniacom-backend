import { Router } from "express";
import * as controller from "../controllers/equipements.controller.js";

const router = Router();

// GET    /api/equipementss      -> Liste tous les equipementss
// GET    /api/equipementss/{id} -> Detail d un equipements
// POST   /api/equipementss      -> Creer un equipements
// PUT    /api/equipementss/{id} -> Mettre a jour un equipements
// DELETE /api/equipementss/{id} -> Supprimer un equipements

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

export default router;
