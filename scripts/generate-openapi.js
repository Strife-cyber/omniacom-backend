#!/usr/bin/env node

/**
 * openapi.json Generator
 * ======================
 * Genere un fichier de specification OpenAPI 3.1 statique
 * a partir de la configuration Swagger du projet.
 *
 * UTILISATION :
 *   npm run openapi:generate                    Fichier par defaut (racine/openapi.json)
 *   npm run openapi:generate -- --output docs/  Dossier personnalise
 *   npm run openapi:generate -- --minify          JSON sans indentation
 *   npm run openapi:generate -- --help             Aide
 */

import { writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve, dirname, basename } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// Aide
if (process.argv.includes("--help") || process.argv.includes("-h")) {
  console.log(`
openapi.json Generator

npm run openapi:generate                  openapi.json a la racine
npm run openapi:generate -- --output docs  Sous-dossier docs/
npm run openapi:generate -- --minify        Sans indentation
`);
  process.exit(0);
}

// --- Chargement de la spec ---
let swaggerSpec;
try {
  const swaggerModule = await import("../src/config/swagger.js");
  swaggerSpec = swaggerModule.swaggerSpec;
} catch (err) {
  console.error("Erreur : impossible de charger la spec Swagger.");
  console.error(
    "  Assurez-vous que le serveur peut demarrer : node src/server.js",
  );
  console.error("  Details :", err.message);
  process.exit(1);
}

if (!swaggerSpec || Object.keys(swaggerSpec).length === 0) {
  console.error("Erreur : la spec Swagger est vide.");
  console.error(
    "  Verifiez que des annotations @openapi sont presentes dans les controleurs.",
  );
  process.exit(1);
}

// --- Determination du chemin de sortie ---
const outputArgIndex = process.argv.indexOf("--output");
let outputDir = ROOT;
let outputFile = "openapi.json";

if (outputArgIndex !== -1 && process.argv[outputArgIndex + 1]) {
  const customPath = process.argv[outputArgIndex + 1];
  if (customPath.endsWith(".json")) {
    outputFile = basename(customPath);
    outputDir = resolve(ROOT, dirname(customPath));
  } else {
    outputDir = resolve(ROOT, customPath);
  }
}

if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

const outputPath = resolve(outputDir, outputFile);

// --- Ecriture ---
const MINIFY = process.argv.includes("--minify");
const json = JSON.stringify(swaggerSpec, null, MINIFY ? 0 : 2);

writeFileSync(outputPath, json, "utf-8");

const stats = `${(Buffer.byteLength(json) / 1024).toFixed(1)} Ko`;
const endpoints = Object.keys(swaggerSpec.paths || {}).length || "?";
const schemas = Object.keys(swaggerSpec.components?.schemas || {}).length || 0;

console.log(`
  openapi.json genere avec succes.
  Fichier  : ${outputPath}
  Taille   : ${stats}
  Endpoints: ${endpoints}
  Schemas  : ${schemas}
`);
