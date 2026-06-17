import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import * as controller from "../controllers/bon-de-commande.controller.js";

const router = Router();

// GET    /api/bon-de-commandes      -> Liste tous les bon-de-commandes
// GET    /api/bon-de-commandes/{id} -> Detail d un bon-de-commande
// POST   /api/bon-de-commandes      -> Creer un bon-de-commande
// PUT    /api/bon-de-commandes/{id} -> Mettre a jour un bon-de-commande
// DELETE /api/bon-de-commandes/{id} -> Supprimer un bon-de-commande

router.get("/", authenticate, authorize("read", "BonDeCommande"), controller.getAll);
router.get("/:id", authenticate, authorize("read", "BonDeCommande"), controller.getById);
router.post("/", authenticate, authorize("create", "BonDeCommande"), controller.create);
router.put("/:id", authenticate, authorize("update", "BonDeCommande"), controller.update);
router.delete("/:id", authenticate, authorize("delete", "BonDeCommande"), controller.remove);

export default router;
