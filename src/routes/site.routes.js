import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import * as controller from "../controllers/site.controller.js";

const router = Router();

// GET    /api/sites      -> Liste tous les sites
// GET    /api/sites/{id} -> Detail d un site
// POST   /api/sites      -> Creer un site
// PUT    /api/sites/{id} -> Mettre a jour un site
// DELETE /api/sites/{id} -> Supprimer un site

router.get("/", authenticate, authorize("read", "Site"), controller.getAll);
router.get("/:id", authenticate, authorize("read", "Site"), controller.getById);
router.post("/", authenticate, authorize("create", "Site"), controller.create);
router.put("/:id", authenticate, authorize("update", "Site"), controller.update);
router.delete("/:id", authenticate, authorize("delete", "Site"), controller.remove);

export default router;
