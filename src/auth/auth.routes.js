import { Router } from "express";
import * as controller from "./auth.controller.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = Router();

// Routes publiques (pas de middleware)
router.post("/register", controller.register);
router.post("/login", controller.login);

// Route protegee (necessite un token valide)
router.get("/me", authenticate, controller.me);

export default router;
