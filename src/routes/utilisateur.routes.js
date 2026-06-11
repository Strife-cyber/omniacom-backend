import { Router } from "express";
import * as controller from "../controllers/utilisateur.controller.js";

const router = Router();

// GET    /api/utilisateurs      -> Liste tous les utilisateurs
// GET    /api/utilisateurs/{id} -> Detail d un utilisateur
// POST   /api/utilisateurs      -> Creer un utilisateur
// PUT    /api/utilisateurs/{id} -> Mettre a jour un utilisateur
// DELETE /api/utilisateurs/{id} -> Supprimer un utilisateur

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

export default router;
