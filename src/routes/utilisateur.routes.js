import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import * as controller from "../controllers/utilisateur.controller.js";

const router = Router();

// GET    /api/utilisateurs      -> Liste tous les utilisateurs
// GET    /api/utilisateurs/{id} -> Detail d un utilisateur
// POST   /api/utilisateurs      -> Creer un utilisateur
// PUT    /api/utilisateurs/{id} -> Mettre a jour un utilisateur
// DELETE /api/utilisateurs/{id} -> Supprimer un utilisateur

router.get("/", authenticate, authorize("read", "Utilisateur"), controller.getAll);
router.get("/:id", authenticate, authorize("read", "Utilisateur"), controller.getById);
router.post("/", authenticate, authorize("create", "Utilisateur"), controller.create);
router.put("/:id", authenticate, authorize("update", "Utilisateur"), controller.update);
router.delete("/:id", authenticate, authorize("delete", "Utilisateur"), controller.remove);

export default router;
