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

export const isDevelopment = NODE_ENV === "development";
export const isProduction = NODE_ENV === "production";
