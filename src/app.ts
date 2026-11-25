import express from "express";
import swaggerUi from "swagger-ui-express";
import { readFileSync } from "node:fs";
import YAML from "yaml";
import "./database/database.js";
import { openApiPath } from "./config/paths.js";
import gameRouter from "./routes/game.routes.js";

export const app = express();
const openApiDocument = YAML.parse(readFileSync(openApiPath, "utf8"));

app.use(express.json());
app.use("/api/games", gameRouter);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
app.get("/", (_request, response) => {
  response.send("API Jeux Vidéo opérationnelle.");
});

app.use(
  (
    error: unknown,
    _request: express.Request,
    response: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error("Erreur lors du traitement de la requête :", error);
    const status =
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      error.status === 400
        ? 400
        : 500;
    response.status(status).json({
      error:
        status === 400
          ? "Corps JSON invalide."
          : "Erreur interne du serveur.",
    });
  },
);
