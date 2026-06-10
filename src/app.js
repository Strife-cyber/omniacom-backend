import express from "express";
import cors from "cors";
import morgan from "morgan";
import { CORS_ORIGINS, isProduction } from "./config/env.js";
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

app.use("/api", routes);
app.use(errorHandler);

export default app;
