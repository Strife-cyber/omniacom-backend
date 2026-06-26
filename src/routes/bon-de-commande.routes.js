import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import * as controller from "../controllers/bon-de-commande.controller.js";

const router = Router();

router.get("/summary", authenticate, authorize("read", "BonDeCommande"), controller.getSummary);
router.get("/", authenticate, authorize("read", "BonDeCommande"), controller.getAll);
router.get("/:id", authenticate, authorize("read", "BonDeCommande"), controller.getById);
router.post("/", authenticate, authorize("create", "BonDeCommande"), controller.create);
router.put("/:id", authenticate, authorize("update", "BonDeCommande"), controller.update);
router.delete("/:id", authenticate, authorize("delete", "BonDeCommande"), controller.remove);

export default router;
