import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import { uploadUserPhoto } from "../middlewares/upload.js";
import * as controller from "../controllers/utilisateur.controller.js";

const router = Router();

router.get("/", authenticate, authorize("read", "Utilisateur"), controller.getAll);
router.get("/:id", authenticate, authorize("read", "Utilisateur"), controller.getById);
router.post("/", authenticate, authorize("create", "Utilisateur"), controller.create);
router.put("/:id", authenticate, authorize("update", "Utilisateur"), controller.update);
router.post(
  "/:id/photo",
  authenticate,
  authorize("update", "Utilisateur"),
  uploadUserPhoto,
  controller.uploadPhoto,
);
router.delete("/:id", authenticate, authorize("delete", "Utilisateur"), controller.remove);

export default router;
