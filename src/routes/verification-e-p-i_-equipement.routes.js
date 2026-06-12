import { Router } from "express";
import * as controller from "../controllers/verification-e-p-i_-equipement.controller.js";

const router = Router();

// GET    /api/verification-e-p-i_-equipements      -> Liste tous les verification-e-p-i_-equipements
// GET    /api/verification-e-p-i_-equipements/{id} -> Detail d un verification-e-p-i_-equipement
// POST   /api/verification-e-p-i_-equipements      -> Creer un verification-e-p-i_-equipement
// PUT    /api/verification-e-p-i_-equipements/{id} -> Mettre a jour un verification-e-p-i_-equipement
// DELETE /api/verification-e-p-i_-equipements/{id} -> Supprimer un verification-e-p-i_-equipement

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

export default router;
