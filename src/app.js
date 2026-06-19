import express from "express";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { CORS_ORIGINS, isProduction } from "./config/env.js";
import { swaggerSpec } from "./config/swagger.js";
import routes from "./routes/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(
  cors({
    origin: CORS_ORIGINS,
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(isProduction ? "combined" : "dev"));

// Documentation Swagger
app.use(
  "/api-docs",

  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "OmniaCom API - Documentation",
    customCss: ".swagger-ui .topbar { display: none }",
  }),
);

// Fichier de specification OpenAPI (exportable vers Postman)
app.get("/api/openapi.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.use("/api", routes);
app.use(errorHandler);

export default app;
