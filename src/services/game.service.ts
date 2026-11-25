import {
  createGame as insertGame,
  deleteGame as removeGame,
  getAllGames as selectAllGames,
  getGameById as selectGameById,
  updateGame as saveGame,
} from "../repositories/game.repository.js";
import type { Game, CreateGameInput } from "../models/game.model.js";

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

function parseGameId(value: string): number {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw new HttpError(400, "Identifiant invalide.");
  }
  return id;
}

function validateGameInput(value: unknown): CreateGameInput {
  if (typeof value !== "object" || value === null) {
    throw new HttpError(400, "Données du jeu invalides.");
  }

  const input = value as Record<string, unknown>;
  if (typeof input.title !== "string") {
    throw new HttpError(400, "title doit être une chaîne.");
  }
  const title = input.title.trim();
  if (title.length === 0) {
    throw new HttpError(400, "title ne peut pas être vide.");
  }
  if (typeof input.editor !== "string") {
    throw new HttpError(400, "editor doit être une chaîne.");
  }
  const editor = input.editor.trim();
  if (editor.length === 0) {
    throw new HttpError(400, "editor ne peut pas être vide.");
  }
  if (
    typeof input.releaseYear !== "number" ||
    !Number.isInteger(input.releaseYear) ||
    input.releaseYear < 1950 ||
    input.releaseYear > 2100
  ) {
    throw new HttpError(
      400,
      "releaseYear doit être un entier compris entre 1950 et 2100.",
    );
  }
  if (typeof input.genre !== "string") {
    throw new HttpError(400, "genre doit être une chaîne.");
  }
  const genre = input.genre.trim();
  if (genre.length === 0) {
    throw new HttpError(400, "genre ne peut pas être vide.");
  }
  if (
    typeof input.rating !== "number" ||
    !Number.isFinite(input.rating) ||
    input.rating < 0 ||
    input.rating > 10
  ) {
    throw new HttpError(400, "rating doit être un nombre compris entre 0 et 10.");
  }

  return {
    title,
    editor,
    releaseYear: input.releaseYear,
    genre,
    rating: input.rating,
  };
}

export function getAllGames(): Game[] {
  return selectAllGames();
}

export function getGameById(value: string): Game {
  const game = selectGameById(parseGameId(value));
  if (!game) {
    throw new HttpError(404, "Jeu introuvable.");
  }
  return game;
}

export function createGame(value: unknown): Game {
  return insertGame(validateGameInput(value));
}

export function updateGame(value: string, gameInput: unknown): Game {
  const id = parseGameId(value);
  const input = validateGameInput(gameInput);

  if (!saveGame(id, input)) {
    throw new HttpError(404, "Jeu introuvable.");
  }

  const game = selectGameById(id);
  if (!game) {
    throw new HttpError(404, "Jeu introuvable.");
  }
  return game;
}

export function deleteGame(value: string): void {
  if (!removeGame(parseGameId(value))) {
    throw new HttpError(404, "Jeu introuvable.");
  }
}
