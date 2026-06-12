import swaggerJsdoc from "swagger-jsdoc";
import { PORT } from "./env.js";

const swaggerDefinition = {
  openapi: "3.1.0",
  info: {
    title: "OmniaCom API",
    version: "1.0.0",
    description:
      "API RESTful de l'application OmniaCom. Toutes les routes sont prefixees par /api.",
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
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Token JWT d'authentification",
      },
    },
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
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          email: { type: "string", format: "email" },
          nom: { type: "string" },
          role: {
            type: "string",
            enum: [
              "ADMIN",
              "UTILISATEUR",
              "GESTIONNAIRE_EPI",
              "GESTIONNAIRE_PLANNING",
            ],
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
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
  },
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.js", "./src/controllers/*.js", "./src/models/*.js"],
};

export const swaggerSpec = swaggerJsdoc(options);
