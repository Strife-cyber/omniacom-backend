import { Router } from "express";
import * as controller from "../controllers/site.controller.js";

const router = Router();

// GET    /api/sites      -> Liste tous les sites
// GET    /api/sites/{id} -> Detail d un site
// POST   /api/sites      -> Creer un site
// PUT    /api/sites/{id} -> Mettre a jour un site
// DELETE /api/sites/{id} -> Supprimer un site

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

export default router;
