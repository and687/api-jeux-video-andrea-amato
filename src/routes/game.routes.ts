import { Router } from "express";
import {
  addGame,
  editGame,
  listGames,
  readGame,
  removeGame,
} from "../controllers/game.controller.js";

export const gameRoutes = Router();

gameRoutes.get("/", listGames);
gameRoutes.get("/:id", readGame);
gameRoutes.post("/", addGame);
gameRoutes.put("/:id", editGame);
gameRoutes.delete("/:id", removeGame);
