# OmniaCom Backend

API RESTful pour l'application OmniaCom — construite avec Node.js, Express, Prisma ORM et PostgreSQL.

---

## Table des matieres

1. [Structure du projet](#structure-du-projet)
2. [Demarrage rapide](#demarrage-rapide)
3. [Modeles de donnees](#modeles-de-donnees)
4. [Authentification](#authentification)
5. [Politiques d'acces (RBAC)](#politiques-dacces-rbac)
6. [API disponibles](#api-disponibles)
7. [Generateur de code automatique](#generateur-de-code-automatique)
8. [Remplissage de la base (Seed)](#remplissage-de-la-base-seed)
9. [Documentation Swagger](#documentation-swagger)
10. [Scripts disponibles](#scripts-disponibles)
11. [Technologies](#technologies)
12. [Documentation complementaire](#documentation-complementaire)

---

## Structure du projet

```
omniacom-backend/
  prisma/
    schema.prisma              Modeles de la base de donnees (13 modeles)
    seed.js                    Remplissage avec donnees de test
    migrations/                Historique des migrations Prisma
  scripts/
    generate/
      index.js                 Generateur de code CRUD automatique
    generate-openapi.js        Export du fichier openapi.json
  src/
    auth/
      auth.service.js          Inscription, connexion, JWT
      auth.controller.js       Endpoints /api/auth/*
      auth.routes.js           Definition des routes d'auth
    config/
      env.js                   Variables d'environnement (.env)
      swagger.js               Configuration Swagger / OpenAPI
    models/
      index.js                 Client Prisma (acces a la base)
    middlewares/
      authenticate.js          Verification du token JWT
      authorize.js             Politiques d'acces (RBAC)
      errorHandler.js          Gestion centralisee des erreurs
    services/
      {modele}.service.js      Logique metier (CRUD)
    controllers/
      {modele}.controller.js   Gestion des requetes HTTP
    routes/
      index.js                 Point d'entree des routes
      {modele}.routes.js       Definition des URLs
    utils/
      ApiError.js              Classe d'erreur personnalisee
    app.js                     Configuration Express
    server.js                  Point d'entree (demarrage)
    generated/                 Client Prisma genere (ignore par Git)
  .env                         Variables d'environnement (ignore par Git)
  .env.example                 Exemple de .env
  .gitignore                   Fichiers ignores par Git
  package.json                 Dependances et scripts
  README.md                    Ce fichier
  CONTRIBUTING.md              Standards de code et conventions Git
```

---

## Demarrage rapide

### 1. Prerequis

- Node.js v22+ (requis pour le support des fichiers `.ts` avec `--experimental-strip-types`)
- PostgreSQL 13+
- npm ou yarn

### 2. Installation

```bash
git clone <url-du-depot>
cd omniacom-backend
npm install
```

### 3. Configuration

```bash
cp .env.example .env
```

Ajustez l'URL de connexion PostgreSQL dans `.env` :

```env
DATABASE_URL="postgresql://postgres:admin@localhost:5432/omniacom?schema=public"
JWT_SECRET="une-cle-secrete-tres-longue"
```

### 4. Creer la base de donnees et appliquer les migrations

```bash
npx prisma migrate dev --name init
```

Cette commande cree la base de donnees, applique les migrations et genere le client Prisma.

### 5. Remplir avec des donnees de test

```bash
npm run prisma:seed
```

### 6. Demarrer le serveur

```bash
npm run dev        # Mode developpement (rechargement automatique)
# ou
npm start          # Mode production
```

Le serveur est disponible sur **http://localhost:3000** et l'API sur **http://localhost:3000/api**.

### Connexion de test

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@omniacom.fr","motDePasse":"admin123"}'
```

---

## Modeles de donnees

Le schema Prisma definit 13 modeles et 7 enums :

```mermaid
erDiagram
    Utilisateur ||--o{ Intervention : ""
    Utilisateur ||--o{ BonDeCommande : ""
    Technicien ||--o{ Intervention : ""
    Technicien ||--o{ VerificationEPI : ""
    Technicien ||--o{ Presence : ""
    Site ||--o{ Intervention : ""
    Intervention ||--o{ Presence : ""
    Intervention ||--o{ VerificationEPI_Equipement : ""
    Equipements ||--o{ VerificationEPI_Equipement : ""
    Chantier ||--o{ BonDeCommande : ""
    Chantier ||--o{ EtapeChantier : ""
    BonDeCommande ||--o{ LigneFacturation : ""
    VerificationEPI ||--o{ VerificationEPI_Equipement : ""
```

| Modele | Table | Description |
|---|---|---|
| Utilisateur | utilisateurs | Comptes avec roles (ADMIN, PMO, GESTIONNAIRE_*, UTILISATEUR) |
| Technicien | techniciens | Techniciens de terrain (actifs/inactifs) |
| Site | sites | Sites d'intervention (agences regionales) |
| Intervention | interventions | Interventions planifiees/realisees |
| Equipements | equipements | Equipements de protection (EPI) |
| VerificationEPI | verification_epi | Suivi des verifications EPI par technicien |
| Presence | presences | Pointage des techniciens sur les interventions |
| Chantier | chantier | Chantiers de construction/renovation |
| BonDeCommande | bon_de_commande | Bons de commande lies aux chantiers |
| EtapeChantier | etape_chantier | Etapes de suivi d'avancement |
| LigneFacturation | ligne_facturation | Lignes de facturation detaillees |
| VerificationEPI_Equipement | verification_epi_equipement | Liaison many-to-many EPI-equipements |

---

## Authentification

L'authentification repose sur des **tokens JWT** (JSON Web Tokens).

### Inscription

```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "nom": "Jean Dupont",
  "motDePasse": "monMotDePasse",
  "role": "UTILISATEUR"
}
```

Roles disponibles : `ADMIN`, `PMO`, `UTILISATEUR`, `GESTIONNAIRE_EPI`, `GESTIONNAIRE_PLANNING`

### Connexion

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@omniacom.fr",
  "motDePasse": "admin123"
}
```

Reponse :

```json
{
  "success": true,
  "data": {
    "utilisateur": { "id": 1, "email": "...", "nom": "...", "role": "ADMIN" },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Utilisation du token

Toutes les routes protegees necessitent un header `Authorization` :

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Profil

```bash
GET /api/auth/me
Authorization: Bearer <token>
```

### Comptes de test (donnees seedees)

| Email | Mot de passe | Role |
|---|---|---|
| admin@omniacom.fr | admin123 | ADMIN |
| pmo@omniacom.fr | pmo123 | PMO |
| planning@omniacom.fr | planning123 | GESTIONNAIRE_PLANNING |
| epi@omniacom.fr | epi123 | GESTIONNAIRE_EPI |
| tech@omniacom.fr | tech123 | UTILISATEUR |

---

## Politiques d'acces (RBAC)

Le controle d'acces est centralise dans `src/middlewares/authorize.js`.

### Principe

Chaque route est protegee par deux middlewares enchaines :

```
authenticate  ->  verifie le token JWT et attache req.user
authorize     ->  verifie que le role a le droit d'effectuer l'action sur la ressource
```

### Matrice des droits

| Role | Lire | Creer | Modifier | Supprimer |
|---|---|---|---|---|
| ADMIN | Toutes ressources | Toutes ressources | Toutes ressources | Toutes ressources |
| PMO | Toutes ressources | Toutes ressources | Toutes ressources | - |
| GESTIONNAIRE_PLANNING | Interventions, Techniciens, Sites | Interventions | Interventions | - |
| GESTIONNAIRE_EPI | A definir | A definir | A definir | - |
| UTILISATEUR | Son propre profil | - | - | - |

### Filtrage des donnees

En plus du controle d'acces au niveau des routes, un filtre est applique au niveau des donnees renvoyees (`filterOutput`) :

- Un **UTILISATEUR** ne recoit que ses propres donnees (filtre par `id`)
- Les autres roles recoivent l'integralite des donnees autorisees

### Ajouter une nouvelle politique

Les droits sont definis dans `src/middlewares/authorize.js` :

```javascript
const policies = {
  ADMIN: {
    can(action, resource) { return true; },
  },
  NOUVEAU_ROLE: {
    can(action, resource) {
      const autorise = ["ModeleA", "ModeleB"];
      if (action === "read") return autorise.includes(resource);
      return false;
    },
  },
};
```

---

## API disponibles

### Authentification

| Methode | URL | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Non | Inscription |
| `POST` | `/api/auth/login` | Non | Connexion |
| `GET` | `/api/auth/me` | Bearer | Profil connecte |

### Ressources (toutes protegees par Bearer + RBAC)

| Methode | URL | Description |
|---|---|---|
| `GET` | `/api/utilisateurs` | Liste des utilisateurs |
| `GET` | `/api/utilisateurs/{id}` | Detail d'un utilisateur |
| `POST` | `/api/utilisateurs` | Creer un utilisateur |
| `PUT` | `/api/utilisateurs/{id}` | Mettre a jour |
| `DELETE` | `/api/utilisateurs/{id}` | Supprimer |
| `GET` | `/api/techniciens` | Liste des techniciens |
| `GET` | `/api/techniciens/{id}` | Detail d'un technicien |
| `POST` | `/api/techniciens` | Creer un technicien |
| `PUT` | `/api/techniciens/{id}` | Mettre a jour |
| `DELETE` | `/api/techniciens/{id}` | Supprimer |
| `GET` | `/api/sites` | Liste des sites |
| `GET` | `/api/sites/{id}` | Detail d'un site |
| `POST` | `/api/sites` | Creer un site |
| `PUT` | `/api/sites/{id}` | Mettre a jour |
| `DELETE` | `/api/sites/{id}` | Supprimer |
| `GET` | `/api/interventions` | Liste des interventions |
| `GET` | `/api/interventions/{id}` | Detail d'une intervention |
| `POST` | `/api/interventions` | Creer une intervention |
| `PUT` | `/api/interventions/{id}` | Mettre a jour |
| `DELETE` | `/api/interventions/{id}` | Supprimer |
| `GET` | `/api/equipements` | Liste des equipements |
| `GET` | `/api/equipements/{id}` | Detail d'un equipement |
| `POST` | `/api/equipements` | Creer un equipement |
| `PUT` | `/api/equipements/{id}` | Mettre a jour |
| `DELETE` | `/api/equipements/{id}` | Supprimer |
| `GET` | `/api/verifications-epi` | Liste des verifications EPI |
| `GET` | `/api/verifications-epi/{id}` | Detail |
| `POST` | `/api/verifications-epi` | Creer |
| `PUT` | `/api/verifications-epi/{id}` | Mettre a jour |
| `DELETE` | `/api/verifications-epi/{id}` | Supprimer |
| `GET` | `/api/presences` | Liste des presences |
| `GET` | `/api/presences/{id}` | Detail |
| `POST` | `/api/presences` | Creer |
| `PUT` | `/api/presences/{id}` | Mettre a jour |
| `DELETE` | `/api/presences/{id}` | Supprimer |
| `GET` | `/api/chantiers` | Liste des chantiers |
| `GET` | `/api/chantiers/{id}` | Detail |
| `POST` | `/api/chantiers` | Creer |
| `PUT` | `/api/chantiers/{id}` | Mettre a jour |
| `DELETE` | `/api/chantiers/{id}` | Supprimer |
| `GET` | `/api/bons-de-commande` | Liste des bons de commande |
| `GET` | `/api/bons-de-commande/{id}` | Detail |
| `POST` | `/api/bons-de-commande` | Creer |
| `PUT` | `/api/bons-de-commande/{id}` | Mettre a jour |
| `DELETE` | `/api/bons-de-commande/{id}` | Supprimer |
| `GET` | `/api/etapes-chantier` | Liste des etapes chantier |
| `GET` | `/api/etapes-chantier/{id}` | Detail |
| `POST` | `/api/etapes-chantier` | Creer |
| `PUT` | `/api/etapes-chantier/{id}` | Mettre a jour |
| `DELETE` | `/api/etapes-chantier/{id}` | Supprimer |
| `GET` | `/api/lignes-facturation` | Liste des lignes de facturation |
| `GET` | `/api/lignes-facturation/{id}` | Detail |
| `POST` | `/api/lignes-facturation` | Creer |
| `PUT` | `/api/lignes-facturation/{id}` | Mettre a jour |
| `DELETE` | `/api/lignes-facturation/{id}` | Supprimer |
| `GET` | `/api/epi-equipements` | Liste des liaisons EPI-Equipements |

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
  "message": "Ressource introuvable"
}
```

---

## Generateur de code automatique

Le generateur (`scripts/generate/index.js`) produit automatiquement le service, le controleur, les routes et les annotations OpenAPI a partir d'un modele Prisma.

### Utilisation

```bash
# Mode interactif (choisir le modele dans la liste)
npm run generate

# Mode direct (generer pour un modele specifique)
npm run generate -- --model Categorie

# Generer tous les modeles d'un coup
npm run generate -- --all

# Apercu sans ecrire
npm run generate -- --all --dry-run

# Generer seulement certaines couches
npm run generate -- --model Modele --skip-controller
```

### Options

| Option | Description |
|---|---|
| `--model <Nom>` | Modele specifique |
| `--all` | Tous les modeles |
| `--dry-run` | Apercu sans ecriture |
| `--skip-service` | Sans le service |
| `--skip-controller` | Sans le controleur |
| `--skip-routes` | Sans les routes |
| `--help` | Affiche l'aide |

### Ce qui est genere

Pour un modele `Categorie` :

```
src/services/categorie.service.js      CRUD complet (findAll, findById, create, update, remove)
src/controllers/categorie.controller.js 5 handlers HTTP + @openapi JSDoc
src/routes/categorie.routes.js          5 routes REST + middleware auth + RBAC
src/routes/index.js                      Enregistrement automatique de la route
```

### Fonctionnalites du generateur

- Analyse le schema Prisma pour detecter les modeles, champs, types et relations
- Detecte automatiquement le type de l'ID (`Int` ou `String`/UUID) et adapte le code
- Genere les annotations OpenAPI avec les types corrects
- Protege les routes avec `authenticate` + `authorize`
- Ajoute le filtre `filterOutput` dans les controleurs
- Integre les nouvelles routes dans `routes/index.js` au bon endroit

---

## Remplissage de la base (Seed)

Le fichier `prisma/seed.js` remplit la base avec des donnees de test realistes.

### Execution

```bash
npm run prisma:seed
```

Le seeder s'execute automatiquement apres `npx prisma migrate dev` si la configuration `prisma.seed` est definie dans `package.json`.

### Donnees inserees

| Table | Nb | Details |
|---|---|---|
| Utilisateurs | 5 | admin, pmo, planning, epi, tech |
| Techniciens | 5 | Martin, Bernard, Dubois, Petit, Moreau |
| Sites | 6 | Paris, Lyon, Marseille, Bordeaux, Lille, Toulouse |
| Equipements | 8 | Casques, gants, harnais, detecteurs, etc. |
| Chantiers | 5 | En cours, termines, bloques par le proprietaire |
| Interventions | 8 | Liees aux sites et techniciens |
| Verifications EPI | 4 | Dont 2 en retard |
| Presences | 6 | PRESENT, ABSENT, MALADIE |
| Etapes chantier | 14 | Reparties sur 3 chantiers |
| Bons de commande | 6 | Avec montants et soldes |
| Lignes facturation | 6 | PAYEES et NON_PAYEES |
| Liaisons EPI-Equipements | 9 | Liens many-to-many |

### Nettoyage automatique

Le seeder supprime toutes les donnees existantes avant de re-inserer, dans l'ordre inverse des dependances. Il peut donc etre execute plusieurs fois sans risque.

---

## Documentation Swagger

### Interface Swagger UI

Lancez le serveur et ouvrez :

```
http://localhost:3000/api-docs
```

L'interface permet de visualiser tous les endpoints, lire les schemas, et tester chaque route directement.

### Export Postman

```bash
# Fichier statique
npm run openapi:generate

# Ou depuis le serveur en cours
http://localhost:3000/api/openapi.json
```

Puis importez dans Postman via `Import -> Files` ou `Import -> Link`.

---

## Scripts disponibles

| Commande | Description |
|---|---|
| `npm run dev` | Demarre le serveur en developpement (nodemon) |
| `npm start` | Demarre le serveur en production |
| `npm run prisma:generate` | Genere le client Prisma |
| `npm run prisma:migrate` | Applique les migrations |
| `npm run prisma:reset` | Reinitialise la base de donnees |
| `npm run prisma:studio` | Interface graphique Prisma Studio |
| `npm run prisma:seed` | Remplit la base avec des donnees de test |
| `npm run generate` | Lance le generateur de code CRUD |
| `npm run openapi:generate` | Genere le fichier `openapi.json` |
| `npm run setup` | Installation complete |

---

## Technologies

- [Express](https://expressjs.com/fr/) — Framework web Node.js
- [Prisma](https://www.prisma.io/) — ORM pour Node.js (v7)
- [PostgreSQL](https://www.postgresql.org/) — Base de donnees relationnelle
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) — Tokens JWT
- [bcryptjs](https://github.com/dcodeIO/bcryptjs) — Hashing de mots de passe
- [Morgan](https://github.com/expressjs/morgan) — Logger HTTP
- [Dotenv](https://github.com/motdotla/dotenv) — Variables d'environnement
- [Swagger UI Express](https://github.com/scottie1984/swagger-ui-express) — Documentation interactive
- [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc) — Generation OpenAPI
- [Nodemon](https://nodemon.io/) — Rechargement automatique
- [CORS](https://github.com/expressjs/cors) — Requetes cross-origin
- [Cross-env](https://github.com/kentcdodds/cross-env) — Variables d'environnement multi-plateforme

---

## Documentation complementaire

- [CONTRIBUTING.md](./CONTRIBUTING.md) — Standards de code, Git, PR
- [OpenAPI Specification](https://swagger.io/specification/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Express Guide](https://expressjs.com/en/guide/routing.html)
