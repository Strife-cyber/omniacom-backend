import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Middleware d'authentification JWT.
 * Extrait le token Bearer du header Authorization, le verifie,
 * et attache l'utilisateur decrypte a req.user.
 *
 * A utiliser sur les routes protegees :
 *   router.get("/protege", authenticate, controller.action);
 */
export function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header) {
      throw new ApiError(401, "Token d'authentification manquant");
    }

    // Format attendu : "Bearer <token>"
    const parts = header.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      throw new ApiError(401, "Format de token invalide. Utilisez: Bearer <token>");
    }

    const token = parts[1];

    // Verifier et decoder le token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attacher l'utilisateur a la requete pour les middlewares suivants
    req.user = {
      id: decoded.id,
      email: decoded.email,
      nom: decoded.nom,
      role: decoded.role,
    };

    next();
  } catch (err) {
    // jwt.verify lance ses propres erreurs selon le cas
    if (err.name === "TokenExpiredError") {
      return next(new ApiError(401, "Token expire. Reconnectez-vous."));
    }
    if (err.name === "JsonWebTokenError") {
      return next(new ApiError(401, "Token invalide ou corrompu"));
    }
    if (err instanceof ApiError) {
      return next(err);
    }
    next(new ApiError(401, "Authentification echouee"));
  }
}
