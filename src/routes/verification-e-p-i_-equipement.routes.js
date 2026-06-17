import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import * as controller from "../controllers/verification-e-p-i_-equipement.controller.js";

const router = Router();

// GET    /api/verification-e-p-i_-equipements      -> Liste tous les verification-e-p-i_-equipements
// GET    /api/verification-e-p-i_-equipements/{id} -> Detail d un verification-e-p-i_-equipement
// POST   /api/verification-e-p-i_-equipements      -> Creer un verification-e-p-i_-equipement
// PUT    /api/verification-e-p-i_-equipements/{id} -> Mettre a jour un verification-e-p-i_-equipement
// DELETE /api/verification-e-p-i_-equipements/{id} -> Supprimer un verification-e-p-i_-equipement

router.get("/", authenticate, authorize("read", "VerificationEPI_Equipement"), controller.getAll);
router.get("/:id", authenticate, authorize("read", "VerificationEPI_Equipement"), controller.getById);
router.post("/", authenticate, authorize("create", "VerificationEPI_Equipement"), controller.create);
router.put("/:id", authenticate, authorize("update", "VerificationEPI_Equipement"), controller.update);
router.delete("/:id", authenticate, authorize("delete", "VerificationEPI_Equipement"), controller.remove);

export default router;
