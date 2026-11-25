import type { RequestHandler } from "express";
import {
  createGame,
  deleteGame,
  getAllGames,
  getGameById,
  updateGame,
} from "../services/game.service.js";

export const listGames: RequestHandler = (_request, response) => {
  response.json(getAllGames());
};

export const readGame: RequestHandler<{ id: string }> = (request, response) => {
  response.json(getGameById(request.params.id));
};

export const addGame: RequestHandler = (request, response) => {
  response.status(201).json(createGame(request.body));
};

export const editGame: RequestHandler<{ id: string }> = (request, response) => {
  response.json(updateGame(request.params.id, request.body));
};

export const removeGame: RequestHandler<{ id: string }> = (request, response) => {
  deleteGame(request.params.id);
  response.status(204).end();
};
