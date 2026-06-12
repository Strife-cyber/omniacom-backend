#!/usr/bin/env node

/**
 * OmniaCom Code Generator v2.0
 * ==============================
 * Genere automatiquement les fichiers Service, Controleur, Routes
 * pour les modeles Prisma, avec annotations OpenAPI completes.
 *
 * UTILISATION :
 *   npm run generate                                   Mode interactif
 *   npm run generate -- --model Utilisateur             Modele specifique
 *   npm run generate -- --all                            Tous les modeles
 *   npm run generate -- --model Site --dry-run           Apercu sans ecrire
 *   npm run generate -- --model Site --skip-controller   Service + routes
 *
 * OPTIONS :
 *   --model <Nom>   Generer pour un modele specifique
 *   --all            Generer pour tous les modeles
 *   --dry-run        Affiche ce qui serait cree sans rien ecrire
 *   --skip-service   Ne pas generer le service
 *   --skip-cont roller Ne pas generer le controleur
 *   --skip-routes    Ne pas generer les routes
 *   --update-swagger Mettre a jour les schemas dans swagger.js
 *   --help           Affiche cette aide
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import readline from "readline";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "../..");

// ===========================================================================
// 0. AIDE
// ===========================================================================

if (process.argv.includes("--help") || process.argv.includes("-h")) {
  console.log(`
OmniaCom Code Generator v2.0

npm run generate                           Mode interactif
npm run generate -- --model Utilisateur    Modele specifique
npm run generate -- --all                   Tous les modeles
npm run generate -- --model Site --dry-run  Apercu sans ecrire
npm run generate -- --skip-controller       Service + routes seulement
`);
  process.exit(0);
}

// ===========================================================================
// 1. PARSEUR PRISMA AMELIORE
// ===========================================================================

function parsePrismaSchema(filePath) {
  const content = readFileSync(filePath, "utf-8");

  // Supprime les commentaires
  const sansCommentaires = content
    .replace(/\/\/.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "");

  const modeles = [];
  const enums = [];

  // Parse les blocs "model"
  const modelRegex = /model\s+(\w+)\s*\{([^}]*)\}/g;
  let match;

  while ((match = modelRegex.exec(sansCommentaires)) !== null) {
    const nomModele = match[1];
    const bloc = match[2];
    const champs = [];
    let tableName = null;

    const lignes = bloc.split("\n");
    for (const ligne of lignes) {
      const trimmed = ligne.trim();
      if (!trimmed || trimmed.startsWith("@@")) {
        const mapMatch = trimmed.match(/@@map\("([^"]+)"\)/);
        if (mapMatch) tableName = mapMatch[1];
        continue;
      }

      const fieldMatch = trimmed.match(/^(\w+)\s+(\w+)\s*(@[^\n]*)?/);
      if (fieldMatch) {
        const nom = fieldMatch[1];
        const type = fieldMatch[2];
        const attrs = fieldMatch[3] || "";

        const typesPrimitifs = [
          "String",
          "Int",
          "Float",
          "Boolean",
          "DateTime",
          "BigInt",
          "Decimal",
          "Bytes",
          "Json",
        ];
        const estRelation =
          /^[A-Z]/.test(type) && !typesPrimitifs.includes(type);

        if (estRelation) continue;

        // Detecter si le type est un enum (reference a un bloc enum)
        const estEnum =
          /^[A-Z]/.test(type) && enums.some((e) => e.nom === type);

        champs.push({
          nom,
          type: estEnum ? "String" : type, // Traite les enums comme String
          typeOriginal: type,
          estId: attrs.includes("@id"),
          estUnique: attrs.includes("@unique"),
          estRequis: !attrs.includes("?"),
          estListe: type.endsWith("[]"),
          estEnum,
          enumName: estEnum ? type : null,
        });
      }
    }

    if (champs.length === 0) continue;

    const champId = champs.find((c) => c.estId) || champs[0];

    modeles.push({
      pascalCase: nomModele,
      camelCase: nomModele[0].toLowerCase() + nomModele.slice(1),
      kebabCase: nomModele
        .replace(/([A-Z])/g, "-$1")
        .toLowerCase()
        .replace(/^-/, ""),
      snakeCase: nomModele
        .replace(/([A-Z])/g, "_$1")
        .toLowerCase()
        .replace(/^_/, ""),
      tableName:
        tableName ||
        nomModele
          .replace(/([A-Z])/g, "_$1")
          .toLowerCase()
          .replace(/^_/, "") + "s",
      champs,
      champId: champId,
    });
  }

  // Parse les blocs "enum"
  const enumRegex = /enum\s+(\w+)\s*\{([^}]*)\}/g;
  while ((match = enumRegex.exec(sansCommentaires)) !== null) {
    enums.push({
      nom: match[1],
      valeurs: match[2]
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean),
    });
  }

  return { modeles, enums };
}

// ===========================================================================
// 2. TEMPLATES AMELIORES
// ===========================================================================

function idToJsDoc(m) {
  return m.champId.type === "String" ? "string" : "number";
}

function idParseExpr(m) {
  return m.champId.type === "String"
    ? "req.params.id"
    : "parseInt(req.params.id, 10)";
}

function templateService(m) {
  const champsCreation = m.champs
    .filter((c) => !c.estId && c.nom !== "createdAt" && c.nom !== "updatedAt")
    .map(
      (c) =>
        ` * @param {${typeToJsDoc(c.type)}} ${c.nom}${c.estRequis ? "" : " - Optionnel"}`,
    )
    .join("\n");

  const idType = idToJsDoc(m);

  return `import { prisma } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";

// =============================================================================
// Service ${m.pascalCase}
// =============================================================================

/**
 * Recupere tous les ${m.kebabCase}s.
 * @returns {Promise<Array>} Liste des ${m.kebabCase}s
 */
export async function findAll() {
  return prisma.${m.camelCase}.findMany();
}

/**
 * Recupere un ${m.kebabCase} par son ID.
 * @param {${idType}} id - Identifiant du ${m.kebabCase}
 * @returns {Promise<Object>} Le ${m.kebabCase} trouve
 * @throws {ApiError} 404 si introuvable
 */
export async function findById(id) {
  const item = await prisma.${m.camelCase}.findUnique({ where: { ${m.champId.nom}: id } });

  if (!item) {
    throw new ApiError(404, "${m.pascalCase} introuvable");
  }

  return item;
}

/**
 * Cree un nouveau ${m.kebabCase}.
${champsCreation}
 * @returns {Promise<Object>} Le ${m.kebabCase} cree
 */
export async function create(data) {
  // Ajoutez ici les validations metier avant la creation
  return prisma.${m.camelCase}.create({ data });
}

/**
 * Met a jour un ${m.kebabCase} existant.
 * @param {${idType}} id - Identifiant du ${m.kebabCase}
 * @param {Object} data - Donnees a mettre a jour
 * @returns {Promise<Object>} Le ${m.kebabCase} mis a jour
 * @throws {ApiError} 404 si introuvable
 */
export async function update(id, data) {
  await findById(id);
  return prisma.${m.camelCase}.update({ where: { ${m.champId.nom}: id }, data });
}

/**
 * Supprime un ${m.kebabCase}.
 * @param {${idType}} id - Identifiant du ${m.kebabCase}
 * @returns {Promise<Object>} Le ${m.kebabCase} supprime
 * @throws {ApiError} 404 si introuvable
 */
export async function remove(id) {
  await findById(id);
  return prisma.${m.camelCase}.delete({ where: { ${m.champId.nom}: id } });
}
`;
}

function templateController(m) {
  const idExpr = idParseExpr(m);
  const idOpenApi = typeToOpenApi(m.champId.type);

  const champsListe = m.champs
    .filter((c) => !c.estId && c.nom !== "createdAt" && c.nom !== "updatedAt")
    .map(
      (c) =>
        ` *               ${c.nom}:\n *                 type: ${typeToOpenApi(c.type)}${c.estRequis ? "" : "\n *                 nullable: true"}`,
    )
    .join("\n");

  return `import * as service from "../services/${m.kebabCase}.service.js";
import { filterOutput } from "../middlewares/authorize.js";

// =============================================================================
// Controleur ${m.pascalCase}
// =============================================================================

/**
 * @openapi
 * /api/${m.kebabCase}s:
 *   get:
 *     tags:
 *       - ${m.pascalCase}
 *     summary: Liste tous les ${m.kebabCase}s
 *     responses:
 *       200:
 *         description: Liste des ${m.kebabCase}s
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
export async function getAll(req, res, next) {
  try {
    const items = await service.findAll();
    res.json({ success: true, data: filterOutput(req.user, items, "${m.pascalCase}") });
  } catch (err) {
    next(err);
  }
}

/**
 * @openapi
 * /api/${m.kebabCase}s/{id}:
 *   get:
 *     tags:
 *       - ${m.pascalCase}
 *     summary: Recupere un ${m.kebabCase} par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: ${idOpenApi}
 *         description: Identifiant du ${m.kebabCase}
 *     responses:
 *       200:
 *         description: ${m.pascalCase} trouve
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *       404:
 *         $ref: '#/components/responses/ErrorResponse'
 */
export async function getById(req, res, next) {
  try {
    const id = ${idExpr};
    const item = await service.findById(id);
    res.json({ success: true, data: filterOutput(req.user, item, "${m.pascalCase}") });
  } catch (err) {
    next(err);
  }
}

/**
 * @openapi
 * /api/${m.kebabCase}s:
 *   post:
 *     tags:
 *       - ${m.pascalCase}
 *     summary: Cree un nouveau ${m.kebabCase}
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
${champsListe}
 *     responses:
 *       201:
 *         description: ${m.pascalCase} cree avec succes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
export async function create(req, res, next) {
  try {
    const item = await service.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

/**
 * @openapi
 * /api/${m.kebabCase}s/{id}:
 *   put:
 *     tags:
 *       - ${m.pascalCase}
 *     summary: Met a jour un ${m.kebabCase} existant
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: ${idOpenApi}
 *         description: Identifiant du ${m.kebabCase}
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
${champsListe}
 *     responses:
 *       200:
 *         description: ${m.pascalCase} mis a jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *       404:
 *         $ref: '#/components/responses/ErrorResponse'
 */
export async function update(req, res, next) {
  try {
    const id = ${idExpr};
    const item = await service.update(id, req.body);
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

/**
 * @openapi
 * /api/${m.kebabCase}s/{id}:
 *   delete:
 *     tags:
 *       - ${m.pascalCase}
 *     summary: Supprime un ${m.kebabCase}
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: ${idOpenApi}
 *         description: Identifiant du ${m.kebabCase}
 *     responses:
 *       204:
 *         description: ${m.pascalCase} supprime avec succes (pas de contenu)
 *       404:
 *         $ref: '#/components/responses/ErrorResponse'
 */
export async function remove(req, res, next) {
  try {
    const id = ${idExpr};
    await service.remove(id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
`;
}

function templateRoutes(m) {
  return `import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import * as controller from "../controllers/${m.kebabCase}.controller.js";

const router = Router();

// Toutes les routes sont protegees par authentification + autorisation
// Les politiques sont definies dans src/middlewares/authorize.js

router.get("/", authenticate, authorize("read", "${m.pascalCase}"), controller.getAll);
router.get("/:id", authenticate, authorize("read", "${m.pascalCase}"), controller.getById);
router.post("/", authenticate, authorize("create", "${m.pascalCase}"), controller.create);
router.put("/:id", authenticate, authorize("update", "${m.pascalCase}"), controller.update);
router.delete("/:id", authenticate, authorize("delete", "${m.pascalCase}"), controller.remove);

export default router;
`;
}

// ===========================================================================
// 3. UTILITAIRES
// ===========================================================================

function typeToJsDoc(type) {
  const map = {
    String: "string",
    Int: "number",
    Float: "number",
    Boolean: "boolean",
    DateTime: "Date",
    BigInt: "number",
    Decimal: "number",
    Bytes: "Buffer",
    Json: "Object",
  };
  return map[type] || "string";
}

function typeToOpenApi(type) {
  const map = {
    String: "string",
    Int: "integer",
    Float: "number",
    Boolean: "boolean",
    DateTime: "string",
    BigInt: "integer",
    Decimal: "number",
    Bytes: "string",
    Json: "object",
  };
  return map[type] || "string";
}

function ecrireFichier(chemin, contenu, dryRun) {
  if (dryRun) {
    const nbLignes = contenu.split("\n").length;
    console.log(
      `  [DRY] ${chemin.replace(ROOT + "/", "")} (${nbLignes} lignes)`,
    );
    return;
  }
  const dir = dirname(chemin);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(chemin, contenu, "utf-8");
  console.log(`  [CREE] ${chemin.replace(ROOT + "/", "")}`);
}

function ajouterRouteDansIndex(m, dryRun) {
  const chemin = resolve(ROOT, "src/routes/index.js");
  let content = readFileSync(chemin, "utf-8");
  const lignes = content.split("\n");

  const importLigne = `import ${m.camelCase}Routes from "./${m.kebabCase}.routes.js";`;
  const routeLigne = `router.use("/${m.kebabCase}s", ${m.camelCase}Routes);`;

  if (content.includes(importLigne)) {
    console.log(
      `  [SKIP] Route /api/${m.kebabCase}s deja dans routes/index.js`,
    );
    return;
  }

  if (dryRun) {
    console.log(
      `  [DRY] Ajout de la route /api/${m.kebabCase}s dans routes/index.js`,
    );
    return;
  }

  let dernierImportIndex = -1;
  for (let i = 0; i < lignes.length; i++) {
    if (lignes[i].trimStart().startsWith("import ")) dernierImportIndex = i;
  }

  let insertionRouteIndex = -1;
  for (let i = 0; i < lignes.length; i++) {
    if (
      lignes[i].trim() === "/**" &&
      !lignes.slice(0, i).some((l) => l.includes("function"))
    ) {
      insertionRouteIndex = i;
      break;
    }
  }
  if (insertionRouteIndex === -1) insertionRouteIndex = lignes.length - 1;

  const nouvellesLignes = [];
  for (let i = 0; i < lignes.length; i++) {
    nouvellesLignes.push(lignes[i]);
    if (i === dernierImportIndex) nouvellesLignes.push(importLigne);
    if (i === insertionRouteIndex - 1) nouvellesLignes.push(routeLigne);
  }

  writeFileSync(chemin, nouvellesLignes.join("\n"), "utf-8");
  console.log(
    `  [MAJ] Route /api/${m.kebabCase}s enregistree dans routes/index.js`,
  );
}

function genererSchemaOpenApi(m, enumsDisponibles) {
  if (!m || m.champs.length === 0) return null;

  const props = {};
  m.champs.forEach((c) => {
    const prop = { type: typeToOpenApi(c.type) };
    if (c.estId) prop.example = c.type === "Int" ? 1 : "uuid";
    props[c.nom] = prop;
  });

  if (m.champs.some((c) => c.nom === "createdAt")) {
    props.createdAt = { type: "string", format: "date-time" };
  }
  if (m.champs.some((c) => c.nom === "updatedAt")) {
    props.updatedAt = { type: "string", format: "date-time" };
  }

  return {
    type: "object",
    properties: props,
  };
}

function mettreAJourSwaggerSchemas(tousModeles, enumsDisponibles) {
  console.log(
    "  [WARN] La mise a jour automatique des schemas Swagger est desactivee.",
  );
  console.log(
    "  Ajoutez manuellement les schemas dans src/config/swagger.js -> components.schemas",
  );
}

function afficherResume(resultats) {
  const ligne = "=".repeat(58);
  console.log(`\n${ligne}`);
  console.log(`  GENERATION TERMINEE : ${resultats.length} modele(s)`);
  console.log(ligne);

  resultats.forEach((r) => {
    console.log(`  [${r.pascalCase}]`);
    console.log(`    Service    : ${r.fichiers.service}`);
    console.log(`    Controleur : ${r.fichiers.controller}`);
    console.log(`    Routes     : ${r.fichiers.routes}`);
    console.log(`    API        : /api/${r.kebabCase}s`);
  });

  console.log(`${ligne}\n`);
}

function poserQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(query, (r) => {
      rl.close();
      resolve(r.trim());
    }),
  );
}

// ===========================================================================
// 4. POINT D ENTREE
// ===========================================================================

async function main() {
  const DRY_RUN = process.argv.includes("--dry-run");
  const ALL = process.argv.includes("--all");
  const SKIP_SERVICE = process.argv.includes("--skip-service");
  const SKIP_CONTROLLER = process.argv.includes("--skip-controller");
  const SKIP_ROUTES = process.argv.includes("--skip-routes");
  const UPDATE_SWAGGER = process.argv.includes("--update-swagger");

  console.log(`
  OmniaCom Code Generator v2.0
  ${DRY_RUN ? "  MODE DRY-RUN (apercu, rien n est ecrit)" : ""}
  `);

  // --- Parse le schema Prisma ---
  let modeles, enums;
  try {
    const result = parsePrismaSchema(resolve(ROOT, "prisma/schema.prisma"));
    modeles = result.modeles;
    enums = result.enums;

    if (modeles.length === 0) {
      console.error(
        "Aucun modele Prisma actif trouve dans prisma/schema.prisma.\n" +
          "Creez ou decommentez un modele, puis lancez 'npx prisma generate'.",
      );
      process.exit(1);
    }
  } catch (err) {
    console.error("Erreur de lecture du schema Prisma :", err.message);
    process.exit(1);
  }

  // --- Selection des modeles ---
  let modelesChoisis = [];

  if (ALL) {
    modelesChoisis = [...modeles];
    console.log(`Generation pour TOUS les modeles (${modeles.length}) :`);
    modelesChoisis.forEach((m) =>
      console.log(`  - ${m.pascalCase} (${m.champs.length} champs)`),
    );
    if (!DRY_RUN) {
      const reponse = await poserQuestion("\nConfirmer ? (o/N) : ");
      if (reponse.toLowerCase() !== "o" && reponse.toLowerCase() !== "oui") {
        console.log("Annule.");
        process.exit(0);
      }
    }
  } else {
    const modelArgIndex = process.argv.indexOf("--model");
    if (modelArgIndex !== -1 && process.argv[modelArgIndex + 1]) {
      const nomCherche = process.argv[modelArgIndex + 1];
      const trouve = modeles.find(
        (m) =>
          m.pascalCase.toLowerCase() === nomCherche.toLowerCase() ||
          m.camelCase.toLowerCase() === nomCherche.toLowerCase(),
      );
      if (!trouve) {
        console.error(
          `Modele "${nomCherche}" introuvable. Modeles : ${modeles.map((m) => m.pascalCase).join(", ")}`,
        );
        process.exit(1);
      }
      modelesChoisis = [trouve];
    } else {
      // Mode interactif
      console.log("Modeles disponibles :\n");
      modeles.forEach((m, i) => {
        console.log(
          `  ${i + 1}. ${m.pascalCase} (${m.champs.length} champs, table: ${m.tableName})`,
        );
      });
      console.log("  A. Tous les modeles");

      const reponse = await poserQuestion(
        `\nChoisissez (1-${modeles.length}, A) : `,
      );

      if (reponse.toUpperCase() === "A") {
        modelesChoisis = [...modeles];
      } else {
        const index = parseInt(reponse, 10) - 1;
        if (isNaN(index) || index < 0 || index >= modeles.length) {
          console.error("Choix invalide.");
          process.exit(1);
        }
        modelesChoisis = [modeles[index]];
      }
    }
  }

  // --- Generation ---
  const resultats = [];

  for (const m of modelesChoisis) {
    console.log(`\n  Generation de ${m.pascalCase}...`);

    const resultat = {
      pascalCase: m.pascalCase,
      kebabCase: m.kebabCase,
      fichiers: {},
    };

    // Verifier si les fichiers existent
    const existants = [];
    if (
      !SKIP_SERVICE &&
      existsSync(resolve(ROOT, `src/services/${m.kebabCase}.service.js`))
    )
      existants.push("service");
    if (
      !SKIP_CONTROLLER &&
      existsSync(resolve(ROOT, `src/controllers/${m.kebabCase}.controller.js`))
    )
      existants.push("controleur");
    if (
      !SKIP_ROUTES &&
      existsSync(resolve(ROOT, `src/routes/${m.kebabCase}.routes.js`))
    )
      existants.push("routes");

    if (existants.length > 0 && !DRY_RUN) {
      const reponse = await poserQuestion(
        `    ${existants.join(", ")} existent deja. Ecraser ? (o/N) : `,
      );
      if (reponse.toLowerCase() !== "o" && reponse.toLowerCase() !== "oui") {
        console.log(`    ${m.pascalCase} saute.`);
        continue;
      }
    }

    // Generer le service
    if (!SKIP_SERVICE) {
      const chemin = resolve(ROOT, `src/services/${m.kebabCase}.service.js`);
      ecrireFichier(chemin, templateService(m), DRY_RUN);
      resultat.fichiers.service = `src/services/${m.kebabCase}.service.js`;
    }

    // Generer le controleur
    if (!SKIP_CONTROLLER) {
      const chemin = resolve(
        ROOT,
        `src/controllers/${m.kebabCase}.controller.js`,
      );
      ecrireFichier(chemin, templateController(m), DRY_RUN);
      resultat.fichiers.controller = `src/controllers/${m.kebabCase}.controller.js`;
    }

    // Generer les routes
    if (!SKIP_ROUTES) {
      const chemin = resolve(ROOT, `src/routes/${m.kebabCase}.routes.js`);
      ecrireFichier(chemin, templateRoutes(m), DRY_RUN);
      resultat.fichiers.routes = `src/routes/${m.kebabCase}.routes.js`;
      ajouterRouteDansIndex(m, DRY_RUN);
    }

    resultats.push(resultat);
  }

  // Mettre a jour swagger.js avec les schemas
  if (UPDATE_SWAGGER && !DRY_RUN) {
    try {
      mettreAJourSwaggerSchemas(modelesChoisis, enums);
      console.log(
        "\n  [MAJ] Schemas OpenAPI mis a jour dans src/config/swagger.js",
      );
    } catch (err) {
      console.warn(
        "  [WARN] Impossible de mettre a jour swagger.js :",
        err.message,
      );
    }
  }

  if (resultats.length > 0) {
    afficherResume(resultats);
  } else {
    console.log("\nAucun modele genere.");
  }
}

main().catch((err) => {
  console.error("Erreur :", err);
  process.exit(1);
});
