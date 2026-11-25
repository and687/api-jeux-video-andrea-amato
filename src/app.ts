import express from "express";
import type { NextFunction, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import "./database/database.js";
import { projectRoot } from "./config/paths.js";
import { gameRoutes } from "./routes/game.routes.js";
import { HttpError } from "./services/game.service.js";

export const app = express();
const swaggerPath = path.join(projectRoot, "docs/openapi.yaml");
const swaggerText = fs.readFileSync(swaggerPath, "utf8");
const document = YAML.parse(swaggerText);

app.use(express.json());
app.get("/", (_request, response) => {
  response.json({ message: "API Jeux Vidéo opérationnelle" });
});
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(document));
app.use("/api/games", gameRoutes);

app.use((_request, response) => {
  response.status(404).json({ error: "Route introuvable" });
});

interface RequestError extends Error {
  type?: string;
  status?: number;
}

function handleError(
  error: RequestError,
  _request: Request,
  response: Response,
  _next: NextFunction,
): void {
  if (error instanceof HttpError) {
    response.status(error.status).json({
      error: error.message,
      ...(error.details === undefined ? {} : { details: error.details }),
    });
    return;
  }

  if (error.type === "entity.parse.failed") {
    response.status(400).json({ error: "JSON invalide" });
    return;
  }

  if (error.status && error.status >= 400 && error.status < 500) {
    const message =
      error.status === 413
        ? "Corps de requête trop volumineux"
        : "Requête invalide";
    response.status(error.status).json({ error: message });
    return;
  }

  console.error(error);
  response.status(500).json({ error: "Erreur interne du serveur" });
}

app.use(handleError);
