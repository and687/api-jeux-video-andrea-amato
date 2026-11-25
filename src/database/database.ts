import Database from "better-sqlite3";
import { readFileSync } from "node:fs";
import { databasePath, schemaPath } from "../config/paths.js";

const database = new Database(databasePath);
database.exec(readFileSync(schemaPath, "utf8"));

export default database;
