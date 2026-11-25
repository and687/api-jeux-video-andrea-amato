import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const currentDirectory = dirname(fileURLToPath(import.meta.url));

export const projectRoot = resolve(currentDirectory, "../..");
export const databasePath = resolve(projectRoot, "database.sqlite");
export const schemaPath = resolve(projectRoot, "src/database/schema.sql");
export const openApiPath = resolve(projectRoot, "docs/openapi.yaml");
