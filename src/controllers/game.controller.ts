import type { RequestHandler } from "express";
import {
  createGame,
  deleteGame,
  getAllGames,
  getGameById,
  updateGame,
} from "../repositories/game.repository.js";
import type { CreateGameInput } from "../models/game.model.js";

function isCreateGameInput(value: unknown): value is CreateGameInput {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const input = value as Record<string, unknown>;
  return (
    typeof input.title === "string" &&
    typeof input.editor === "string" &&
    typeof input.releaseYear === "number" &&
    Number.isFinite(input.releaseYear) &&
    typeof input.genre === "string" &&
    typeof input.rating === "number" &&
    Number.isFinite(input.rating)
  );
}

function parseGameId(value: string): number | undefined {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : undefined;
}

export const listGames: RequestHandler = (_request, response) => {
  response.json(getAllGames());
};

export const readGame: RequestHandler<{ id: string }> = (request, response) => {
  const id = parseGameId(request.params.id);
  if (id === undefined) {
    response.status(400).json({ error: "Identifiant invalide." });
    return;
  }

  const game = getGameById(id);
  if (!game) {
    response.status(404).json({ error: "Jeu introuvable." });
    return;
  }

  response.json(game);
};

export const addGame: RequestHandler = (request, response) => {
  if (!isCreateGameInput(request.body)) {
    response.status(400).json({ error: "Données du jeu invalides." });
    return;
  }

  response.status(201).json(createGame(request.body));
};

export const editGame: RequestHandler<{ id: string }> = (request, response) => {
  const id = parseGameId(request.params.id);
  if (id === undefined) {
    response.status(400).json({ error: "Identifiant invalide." });
    return;
  }
  if (!isCreateGameInput(request.body)) {
    response.status(400).json({ error: "Données du jeu invalides." });
    return;
  }
  if (!updateGame(id, request.body)) {
    response.status(404).json({ error: "Jeu introuvable." });
    return;
  }

  response.json(getGameById(id));
};

export const removeGame: RequestHandler<{ id: string }> = (request, response) => {
  const id = parseGameId(request.params.id);
  if (id === undefined) {
    response.status(400).json({ error: "Identifiant invalide." });
    return;
  }
  if (!deleteGame(id)) {
    response.status(404).json({ error: "Jeu introuvable." });
    return;
  }

  response.status(204).end();
};
