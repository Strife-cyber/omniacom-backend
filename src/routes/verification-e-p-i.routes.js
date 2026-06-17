import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import * as controller from "../controllers/verification-e-p-i.controller.js";

const router = Router();

// GET    /api/verification-e-p-is      -> Liste tous les verification-e-p-is
// GET    /api/verification-e-p-is/{id} -> Detail d un verification-e-p-i
// POST   /api/verification-e-p-is      -> Creer un verification-e-p-i
// PUT    /api/verification-e-p-is/{id} -> Mettre a jour un verification-e-p-i
// DELETE /api/verification-e-p-is/{id} -> Supprimer un verification-e-p-i

router.get("/", authenticate, authorize("read", "VerificationEPI"), controller.getAll);
router.get("/:id", authenticate, authorize("read", "VerificationEPI"), controller.getById);
router.post("/", authenticate, authorize("create", "VerificationEPI"), controller.create);
router.put("/:id", authenticate, authorize("update", "VerificationEPI"), controller.update);
router.delete("/:id", authenticate, authorize("delete", "VerificationEPI"), controller.remove);

export default router;
