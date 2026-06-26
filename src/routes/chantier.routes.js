import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import { uploadChantierPhoto } from "../middlewares/upload.js";
import * as controller from "../controllers/chantier.controller.js";

const router = Router();

router.get("/daily-progress", authenticate, authorize("read", "Chantier"), controller.getDailyProgress);
router.get("/", authenticate, authorize("read", "Chantier"), controller.getAll);
router.get("/:id", authenticate, authorize("read", "Chantier"), controller.getById);
router.post("/", authenticate, authorize("create", "Chantier"), controller.create);
router.put("/:id", authenticate, authorize("update", "Chantier"), controller.update);
router.delete("/:id", authenticate, authorize("delete", "Chantier"), controller.remove);
router.post(
  "/:id/photos",
  authenticate,
  authorize("update", "Chantier"),
  uploadChantierPhoto,
  controller.uploadPhoto,
);
router.delete(
  "/:id/photos/:photoId",
  authenticate,
  authorize("delete", "Chantier"),
  controller.deletePhoto,
);

export default router;
