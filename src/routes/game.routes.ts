import { Router } from "express";
import {
  addGame,
  editGame,
  listGames,
  readGame,
  removeGame,
} from "../controllers/game.controller.js";

const gameRouter = Router();

gameRouter.get("/", listGames);
gameRouter.get("/:id", readGame);
gameRouter.post("/", addGame);
gameRouter.put("/:id", editGame);
gameRouter.delete("/:id", removeGame);

export default gameRouter;
