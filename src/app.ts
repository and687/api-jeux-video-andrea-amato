import express from "express";
import swaggerUi from "swagger-ui-express";
import { readFileSync } from "node:fs";
import YAML from "yaml";
import "./database/database.js";
import { openApiPath } from "./config/paths.js";

const app = express();
const openApiDocument = YAML.parse(readFileSync(openApiPath, "utf8"));

app.use(express.json());
app.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

export default app;
