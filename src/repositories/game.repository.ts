import db from "../database/database.js";
import { Game, type CreateGameInput } from "../models/game.model.js";

interface GameRow {
  id: number;
  title: string;
  editor: string;
  release_year: number;
  genre: string;
  rating: number;
}

function toGame(row: GameRow): Game {
  return new Game(
    row.id,
    row.title,
    row.editor,
    row.release_year,
    row.genre,
    row.rating,
  );
}

export function getAllGames(): Game[] {
  const rows = db
    .prepare<[], GameRow>(
      "SELECT id, title, editor, release_year, genre, rating FROM games",
    )
    .all();

  return rows.map(toGame);
}

export function getGameById(id: number): Game | undefined {
  const row = db
    .prepare<[number], GameRow>(
      "SELECT id, title, editor, release_year, genre, rating FROM games WHERE id = ?",
    )
    .get(id);

  return row ? toGame(row) : undefined;
}

export function createGame(input: CreateGameInput): Game {
  const result = db
    .prepare<[string, string, number, string, number]>(
      "INSERT INTO games (title, editor, release_year, genre, rating) VALUES (?, ?, ?, ?, ?)",
    )
    .run(input.title, input.editor, input.releaseYear, input.genre, input.rating);

  return new Game(
    Number(result.lastInsertRowid),
    input.title,
    input.editor,
    input.releaseYear,
    input.genre,
    input.rating,
  );
}

export function updateGame(id: number, input: CreateGameInput): boolean {
  const result = db
    .prepare<[string, string, number, string, number, number]>(
      "UPDATE games SET title = ?, editor = ?, release_year = ?, genre = ?, rating = ? WHERE id = ?",
    )
    .run(
      input.title,
      input.editor,
      input.releaseYear,
      input.genre,
      input.rating,
      id,
    );

  return result.changes > 0;
}

export function deleteGame(id: number): boolean {
  const result = db.prepare<[number]>("DELETE FROM games WHERE id = ?").run(id);
  return result.changes > 0;
}
