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
    public readonly details?: string[],
  ) {
    super(message);
    this.name = "HttpError";
  }
}

function parseGameId(value: string): number {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw new HttpError(400, "Identifiant invalide", [
      "L'identifiant doit être un entier strictement positif.",
    ]);
  }
  return id;
}

function validateGameInput(value: unknown): CreateGameInput {
  if (typeof value !== "object" || value === null) {
    throw new HttpError(400, "Données invalides", [
      "Le corps de la requête doit être un objet JSON.",
    ]);
  }

  const input = value as Record<string, unknown>;
  const details: string[] = [];

  const title = typeof input.title === "string" ? input.title.trim() : "";
  if (typeof input.title !== "string") {
    details.push("Le titre est obligatoire et doit être un texte.");
  } else if (title.length === 0) {
    details.push("Le titre est obligatoire");
  }
  const editor = typeof input.editor === "string" ? input.editor.trim() : "";
  if (typeof input.editor !== "string") {
    details.push("L'éditeur est obligatoire et doit être un texte.");
  } else if (editor.length === 0) {
    details.push("L'éditeur est obligatoire");
  }
  const releaseYear =
    typeof input.releaseYear === "number" ? input.releaseYear : Number.NaN;
  if (
    !Number.isInteger(releaseYear) ||
    releaseYear < 1950 ||
    releaseYear > 2100
  ) {
    details.push("L'année de sortie doit être un entier compris entre 1950 et 2100.");
  }
  const genre = typeof input.genre === "string" ? input.genre.trim() : "";
  if (typeof input.genre !== "string") {
    details.push("Le genre est obligatoire et doit être un texte.");
  } else if (genre.length === 0) {
    details.push("Le genre est obligatoire");
  }
  const rating = typeof input.rating === "number" ? input.rating : Number.NaN;
  if (
    !Number.isFinite(rating) ||
    rating < 0 ||
    rating > 10
  ) {
    details.push("La note doit être comprise entre 0 et 10");
  }

  if (details.length > 0) {
    throw new HttpError(400, "Données invalides", details);
  }

  return {
    title,
    editor,
    releaseYear,
    genre,
    rating,
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
  if (!selectGameById(id)) {
    throw new HttpError(404, "Jeu introuvable.");
  }

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
