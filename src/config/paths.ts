import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const projectRoot = fileURLToPath(new URL("../../", import.meta.url));
export const databasePath = resolve(projectRoot, "database.sqlite");
export const schemaPath = resolve(projectRoot, "src/database/schema.sql");
export const openApiPath = resolve(projectRoot, "docs/openapi.yaml");
