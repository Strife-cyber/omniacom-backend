import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import * as controller from "../controllers/verification-e-p-i.controller.js";

const router = Router();

// GET  /api/verifications-epi?search=nom          -> Liste (recherche par nom)
// GET  /api/verifications-epi/export              -> Export Excel
// GET  /api/verifications-epi/:id                 -> Détail
// GET  /api/verifications-epi/technicien/:id/historique?mois=&annee= -> Historique
// POST /api/verifications-epi                     -> Créer
// PUT  /api/verifications-epi/:id                 -> Modifier
// DEL  /api/verifications-epi/:id                 -> Supprimer

router.get("/export", authenticate, authorize("read", "VerificationEPI"), controller.exportExcel);
router.get("/technicien/:technicienId/historique", authenticate, authorize("read", "VerificationEPI"), controller.getHistorique);
router.get("/", authenticate, authorize("read", "VerificationEPI"), controller.getAll);
router.get("/:id", authenticate, authorize("read", "VerificationEPI"), controller.getById);
router.post("/", authenticate, authorize("create", "VerificationEPI"), controller.create);
router.put("/:id", authenticate, authorize("update", "VerificationEPI"), controller.update);
router.delete("/:id", authenticate, authorize("delete", "VerificationEPI"), controller.remove);

export default router;
