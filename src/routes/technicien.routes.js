import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import * as controller from "../controllers/technicien.controller.js";

const router = Router();

// GET    /api/techniciens      -> Liste tous les techniciens
// GET    /api/techniciens/{id} -> Detail d un technicien
// POST   /api/techniciens      -> Creer un technicien
// PUT    /api/techniciens/{id} -> Mettre a jour un technicien
// DELETE /api/techniciens/{id} -> Supprimer un technicien

router.get("/", authenticate, authorize("read", "Technicien"), controller.getAll);
router.get("/:id", authenticate, authorize("read", "Technicien"), controller.getById);
router.post("/", authenticate, authorize("create", "Technicien"), controller.create);
router.put("/:id", authenticate, authorize("update", "Technicien"), controller.update);
router.delete("/:id", authenticate, authorize("delete", "Technicien"), controller.remove);

export default router;
