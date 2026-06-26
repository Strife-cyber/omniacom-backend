import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../../.env") });

const requiredVars = ["DATABASE_URL"];
const missing = requiredVars.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`Variables d'environnement manquantes : ${missing.join(", ")}`);
  process.exit(1);
}

export const DATABASE_URL = process.env.DATABASE_URL;
export const PORT = parseInt(process.env.PORT, 10) || 3000;
export const NODE_ENV = process.env.NODE_ENV || "development";
export const CORS_ORIGINS = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((o) => o.trim())
  : ["http://localhost:3000"];
export const JWT_SECRET = process.env.JWT_SECRET || "fallback-dev-secret";
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";
export const JWT_REFRESH_EXPIRES_IN =
  process.env.JWT_REFRESH_EXPIRES_IN || "7d";
export const UPLOADS_DIR = process.env.UPLOADS_DIR || resolve(__dirname, "../../uploads");
export const API_PUBLIC_URL = process.env.API_PUBLIC_URL || `http://localhost:${PORT}`;

export const isDevelopment = NODE_ENV === "development";
export const isProduction = NODE_ENV === "production";
