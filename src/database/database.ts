import Database from "better-sqlite3";
import path from "node:path";
import { projectRoot } from "../config/paths.js";

const db = new Database(path.join(projectRoot, "src/database/game.db"), {
  fileMustExist: true,
});

export default db;