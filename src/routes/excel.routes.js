import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import { uploadExcel } from "../middlewares/upload.js";
import * as controller from "../controllers/excel.controller.js";

const router = Router();

router.get(
  "/export/daily-tracker",
  authenticate,
  authorize("read", "Chantier"),
  controller.exportDailyTracker,
);
router.get(
  "/export/bc-suivi",
  authenticate,
  authorize("read", "BonDeCommande"),
  controller.exportBcSuivi,
);
router.get(
  "/export/chantiers",
  authenticate,
  authorize("read", "Chantier"),
  controller.exportChantiers,
);
router.get(
  "/export/utilisateurs",
  authenticate,
  authorize("read", "Utilisateur"),
  controller.exportUtilisateurs,
);
router.post(
  "/import/daily-tracker",
  authenticate,
  authorize("create", "Chantier"),
  uploadExcel,
  controller.importDailyTracker,
);
router.post(
  "/import/bc-suivi",
  authenticate,
  authorize("create", "BonDeCommande"),
  uploadExcel,
  controller.importBcSuivi,
);

export default router;
