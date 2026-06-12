import { Router } from "express";
import * as controller from "../controllers/bon-de-commande.controller.js";

const router = Router();

// GET    /api/bon-de-commandes      -> Liste tous les bon-de-commandes
// GET    /api/bon-de-commandes/{id} -> Detail d un bon-de-commande
// POST   /api/bon-de-commandes      -> Creer un bon-de-commande
// PUT    /api/bon-de-commandes/{id} -> Mettre a jour un bon-de-commande
// DELETE /api/bon-de-commandes/{id} -> Supprimer un bon-de-commande

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

export default router;
