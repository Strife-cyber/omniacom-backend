import swaggerJsdoc from "swagger-jsdoc";
import { PORT } from "./env.js";

const swaggerDefinition = {
  openapi: "3.1.0",
  info: {
    title: "OmniaCom API",
    version: "1.0.0",
    description:
      "API RESTful de l'application OmniaCom. Toutes les routes sont prefaxees par /api.",
    contact: {
      name: "Equipe OmniaCom",
    },
  },
  servers: [
    {
      url: `http://localhost:${PORT}`,
      description: "Serveur de developpement local",
    },
  ],
  components: {
    responses: {
      SuccessResponse: {
        description: "Reponse standard de succes",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                success: { type: "boolean", example: true },
                data: { type: "object" },
              },
            },
          },
        },
      },
      ErrorResponse: {
        description: "Reponse d'erreur",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                success: { type: "boolean", example: false },
                statusCode: { type: "integer", example: 404 },
                message: { type: "string", example: "Ressource introuvable" },
              },
            },
          },
        },
      },
      ValidationError: {
        description: "Erreur de validation",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                success: { type: "boolean", example: false },
                statusCode: { type: "integer", example: 400 },
                message: { type: "string" },
                details: {
                  type: "array",
                  items: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
    schemas: {
      Utilisateur: {
      "type": "object",
      "properties": {
            "id": {
                  "type": "integer",
                  "example": 1
            },
            "email": {
                  "type": "string"
            },
            "nom": {
                  "type": "string"
            },
            "motDePasse": {
                  "type": "string"
            },
            "createdAt": {
                  "type": "string",
                  "format": "date-time"
            },
            "updatedAt": {
                  "type": "string",
                  "format": "date-time"
            }
      }
},
          email: { type: "string", format: "email" },
          nom: { type: "string" },
          role: {
            type: "string",
            enum: ["ADMIN", "UTILISATEUR"],
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "Date de creation",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            description: "Date de mise a jour",
          },
        },
      },
      Error: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          statusCode: { type: "integer" },
          message: { type: "string" },
        },
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Token JWT d'authentification",
      },
    },
  },
      Technicien: {
      "type": "object",
      "properties": {
            "id": {
                  "type": "integer",
                  "example": 1
            },
            "nom": {
                  "type": "string"
            },
            "prenom": {
                  "type": "string"
            },
            "telephone": {
                  "type": "string"
            }
      }
},
      Site: {
      "type": "object",
      "properties": {
            "id": {
                  "type": "integer",
                  "example": 1
            },
            "nom": {
                  "type": "string"
            },
            "localisation": {
                  "type": "string"
            },
            "region": {
                  "type": "string"
            }
      }
},
      Intervention: {
      "type": "object",
      "properties": {
            "id": {
                  "type": "integer",
                  "example": 1
            },
            "siteId": {
                  "type": "integer"
            },
            "technicienId": {
                  "type": "integer"
            },
            "timestampDebut": {
                  "type": "string"
            },
            "timestampFin": {
                  "type": "string"
            }
      }
},
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.js", "./src/controllers/*.js", "./src/models/*.js"],
};

export const swaggerSpec = swaggerJsdoc(options);
