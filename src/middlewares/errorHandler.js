import { ApiError } from "../utils/ApiError.js";
import { isDevelopment } from "../config/env.js";

export function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Erreur interne du serveur";

  if (statusCode >= 500) {
    console.error(`[ERREUR] ${req.method} ${req.originalUrl} :`, err);
  } else {
    console.warn(`[ATTENTION] ${req.method} ${req.originalUrl} :`, message);
  }

  const response = {
    success: false,
    statusCode,
    message,
  };

  if (err.details) {
    response.details = err.details;
  }

  if (isDevelopment && err.stack) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}
