# OmniaCom Backend

API RESTful pour l'application OmniaCom — construite avec Node.js, Express, Prisma ORM et PostgreSQL.

---

## Structure du projet

```
omniacom-backend/
  prisma/
    schema.prisma          Modeles de votre base de donnees
    seed.js                Donnees de test (remplissage initial)
  src/
    config/
      env.js               Variables d'environnement (.env)
    models/
      index.js             Client Prisma (acces a la base de donnees)
    services/
      exemple.service.js   Logique metier (regles metier)
    controllers/
      exemple.controller.js Gestion des requetes HTTP
    routes/
      index.js             Point d'entree des routes
      exemple.routes.js    Definition des URLs
    middlewares/
      errorHandler.js      Gestion centralisee des erreurs
    utils/
      ApiError.js          Classe d'erreur personnalisee
    app.js                 Configuration Express
    server.js              Point d'entree (demarrage)
  .env                     Variables d'environnement (ignore par Git)
  .env.example             Exemple de .env
  .gitignore               Fichiers ignores par Git
  package.json             Dependances et scripts
  README.md                Ce fichier
```

---

## Demarrage rapide

### 1. Prerequis

- Node.js (v18 ou superieur)
- PostgreSQL (v13 ou superieur)
- npm ou yarn

### 2. Installation

```bash
git clone <url-du-depot>
cd omniacom-backend
npm install
```

### 3. Configuration

Creez un fichier `.env` a la racine en vous basant sur `.env.example` :

```bash
cp .env.example .env
```

Le fichier `.env` par defaut contient :

```env
DATABASE_URL="postgresql://postgres:admin@localhost:5432/omniacom?schema=public"
PORT=3000
NODE_ENV=development
CORS_ORIGINS=http://localhost:3000
```

Adaptez l'URL de connexion a votre configuration PostgreSQL locale.

> Le fichier `.env` contient des secrets — il est deja dans `.gitignore`.

### 4. Creer la base de donnees

Assurez-vous que PostgreSQL est en cours d'execution, puis creez la base :

```bash
psql -U postgres -c "CREATE DATABASE omniacom;"
```

### 5. Creer votre premier modele

1. Ouvrez `prisma/schema.prisma`
2. Decommentez le modele `Utilisateur`
3. Executez les commandes :

```bash
npm run prisma:migrate      # Cree la table en base de donnees
npm run prisma:generate     # Genere le client Prisma
```

### 6. Demarrer le serveur

```bash
npm run dev     # Mode developpement (rechargement automatique)
# ou
npm start       # Mode production
```

Le serveur demarre sur **http://localhost:3000** et l'API sur **http://localhost:3000/api**.

---

## Comment utiliser l'architecture

Ce projet suit le pattern **Modele -> Service -> Controleur -> Route**.

Le flux d'une requete typique :

```
Requete HTTP -> Routes -> Controleur -> Service -> Modele (Prisma) -> Base de donnees
```

### Creer une nouvelle fonctionnalite (exemple : Produits)

#### Etape 1 — Creer le modele

Dans `prisma/schema.prisma`, ajoutez :

```prisma
model Produit {
  id        Int      @id @default(autoincrement())
  nom       String
  prix      Float
  stock     Int      @default(0)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("produits")
}
```

Puis executez :

```bash
npm run prisma:migrate
npm run prisma:generate
```

#### Etape 2 — Creer le service

Creez `src/services/produit.service.js` :

```javascript
import { prisma } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";

export async function findAll() {
  return prisma.produit.findMany();
}

export async function findById(id) {
  const produit = await prisma.produit.findUnique({ where: { id } });
  if (!produit) throw new ApiError(404, "Produit introuvable");
  return produit;
}

export async function create(data) {
  return prisma.produit.create({ data });
}
```

#### Etape 3 — Creer le controleur

Creez `src/controllers/produit.controller.js` :

```javascript
import * as service from "../services/produit.service.js";

export async function getAll(req, res, next) {
  try {
    const produits = await service.findAll();
    res.json({ success: true, data: produits });
  } catch (err) {
    next(err);
  }
}

export async function getById(req, res, next) {
  try {
    const produit = await service.findById(parseInt(req.params.id, 10));
    res.json({ success: true, data: produit });
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const produit = await service.create(req.body);
    res.status(201).json({ success: true, data: produit });
  } catch (err) {
    next(err);
  }
}
```

#### Etape 4 — Creer les routes

Creez `src/routes/produit.routes.js` :

```javascript
import { Router } from "express";
import * as controller from "../controllers/produit.controller.js";

const router = Router();

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);

export default router;
```

#### Etape 5 — Enregistrer les routes

Dans `src/routes/index.js`, ajoutez :

```javascript
import produitRoutes from "./produit.routes.js";
router.use("/produits", produitRoutes);
```

L'API est maintenant accessible sur `GET /api/produits`, `GET /api/produits/1`, `POST /api/produits`.

---

## Scripts disponibles

| Commande | Description |
|---|---|
| `npm run dev` | Demarre le serveur en developpement (nodemon, rechargement auto) |
| `npm start` | Demarre le serveur en production |
| `npm run prisma:generate` | Genere le client Prisma apres modification du schema |
| `npm run prisma:migrate` | Applique les migrations a la base de donnees |
| `npm run prisma:reset` | Reinitialise la base de donnees |
| `npm run prisma:studio` | Ouvre Prisma Studio (interface graphique pour la DB) |
| `npm run prisma:seed` | Remplit la base avec des donnees de test |
| `npm run setup` | Installation complete |
| `npm run openapi:generate` | Genere le fichier `openapi.json` statique |

---

## Documentation de l'API (Swagger / OpenAPI)

Ce projet utilise **Swagger** pour documenter automatiquement l'API.

### Interface Swagger UI

Lancez le serveur puis ouvrez dans votre navigateur :

```
http://localhost:3000/api-docs
```

L'interface Swagger UI permet de :
- visualiser tous les endpoints disponibles
- lire les schemas des requetes et reponses
- tester chaque endpoint directement depuis le navigateur

### Export vers Postman

**Option 1** — Depuis Swagger UI :
1. Ouvrez `http://localhost:3000/api-docs`
2. Cliquez sur le bouton `/api/openapi.json` en haut
3. Dans Postman, utilisez `Import -> Link` et collez l'URL

**Option 2** — Fichier JSON statique :
1. Demarrez le serveur ou executez `npm run openapi:generate`
2. Importez le fichier dans Postman via `Import -> Files`

**Option 3** — Directement depuis le serveur en cours :
```
http://localhost:3000/api/openapi.json
```

### Ajouter de la documentation a vos propres routes

Placez un bloc `@openapi` au-dessus de chaque fonction de controleur :

```javascript
/**
 * @openapi
 * /api/produits:
 *   get:
 *     tags:
 *       - Produits
 *     summary: Liste tous les produits
 *     responses:
 *       200:
 *         description: Liste des produits
 */
export async function getAll(req, res, next) {
  // ...
}
```

Les annotations utilisent le standard **OpenAPI 3.1.0**. Consultez la [documentation officielle OpenAPI](https://swagger.io/specification/) pour la syntaxe complete et [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc) pour la configuration des annotations.

---

## API disponibles

| Methode | URL | Description |
|---|---|---|
| `GET` | `/api` | Verifier que l'API fonctionne |
| `GET` | `/api/exemple` | Liste d'exemple (apres activation du modele) |
| `GET` | `/api/exemple/:id` | Detail d'un element d'exemple |
| `POST` | `/api/exemple` | Creer un element d'exemple |
| `PUT` | `/api/exemple/:id` | Mettre a jour un element d'exemple |
| `DELETE` | `/api/exemple/:id` | Supprimer un element d'exemple |

### Format des reponses

**Succes :**
```json
{
  "success": true,
  "data": { }
}
```

**Erreur :**
```json
{
  "success": false,
  "statusCode": 404,
  "message": "Utilisateur introuvable"
}
```

---

## Technologies

- [Express](https://expressjs.com/fr/) — Framework web pour Node.js
- [Prisma](https://www.prisma.io/) — ORM moderne pour Node.js
- [PostgreSQL](https://www.postgresql.org/) — Base de donnees relationnelle
- [Morgan](https://github.com/expressjs/morgan) — Logger HTTP pour Express
- [Dotenv](https://github.com/motdotla/dotenv) — Chargement des variables d'environnement
- [Nodemon](https://nodemon.io/) — Rechargement automatique en developpement
- [CORS](https://github.com/expressjs/cors) — Gestion des requetes cross-origin

---

## Documentation complementaire

- [OpenAPI Specification](https://swagger.io/specification/) — Standard de documentation d'API
- [Swagger UI Express](https://github.com/scottie1984/swagger-ui-express) — Interface Swagger pour Express
- [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc) — Generation de la spec via les annotations JSDoc
- [Prisma Documentation](https://www.prisma.io/docs)
- [Express Guide](https://expressjs.com/en/guide/routing.html)
- [Prisma Client CRUD](https://www.prisma.io/docs/orm/prisma-client/queries/crud)
