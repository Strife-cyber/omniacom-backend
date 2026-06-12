import { Router } from "express";
import * as controller from "../controllers/verification-e-p-i.controller.js";

const router = Router();

// GET    /api/verification-e-p-is      -> Liste tous les verification-e-p-is
// GET    /api/verification-e-p-is/{id} -> Detail d un verification-e-p-i
// POST   /api/verification-e-p-is      -> Creer un verification-e-p-i
// PUT    /api/verification-e-p-is/{id} -> Mettre a jour un verification-e-p-i
// DELETE /api/verification-e-p-is/{id} -> Supprimer un verification-e-p-i

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

export default router;
