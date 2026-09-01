import type { Game } from "@/lib/types";
import { createExternalStore } from "@/lib/external-store";

const GAMES_KEY = "flip7:games";
const LEGACY_ACTIVE_KEY = "flip7:active-game";
const LEGACY_HISTORY_KEY = "flip7:history";

function isBrowser() {
  return typeof window !== "undefined";
}

function persist(games: Game[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(GAMES_KEY, JSON.stringify(games));
}

export function defaultGameName(createdAt: string) {
  return `Partie du ${new Date(createdAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  })}`;
}

/** Charge toutes les parties, en migrant l'ancien format (partie active + historique séparés). */
function loadGames(): Game[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(GAMES_KEY);
    const games: Game[] = raw ? (JSON.parse(raw) as Game[]) : [];

    const legacyActive = window.localStorage.getItem(LEGACY_ACTIVE_KEY);
    const legacyHistory = window.localStorage.getItem(LEGACY_HISTORY_KEY);
    if (legacyActive) {
      const game = JSON.parse(legacyActive) as Game;
      if (!games.some((g) => g.id === game.id)) games.unshift(game);
      window.localStorage.removeItem(LEGACY_ACTIVE_KEY);
    }
    if (legacyHistory) {
      for (const game of JSON.parse(legacyHistory) as Game[]) {
        if (!games.some((g) => g.id === game.id)) games.push(game);
      }
      window.localStorage.removeItem(LEGACY_HISTORY_KEY);
    }

    for (const game of games) {
      if (!game.name) game.name = defaultGameName(game.createdAt);
    }
    if (legacyActive || legacyHistory) persist(games);
    return games;
  } catch {
    return [];
  }
}

export const gamesStore = createExternalStore<Game[]>(loadGames, []);

export function upsertGame(game: Game) {
  const games = gamesStore.getSnapshot();
  const next = games.some((g) => g.id === game.id)
    ? games.map((g) => (g.id === game.id ? game : g))
    : [game, ...games];
  gamesStore.set(next);
  persist(next);
}

export function setGameArchived(id: string, archived: boolean) {
  const game = gamesStore.getSnapshot().find((g) => g.id === id);
  if (game) upsertGame({ ...game, archived: archived || undefined });
}

export function removeGame(id: string) {
  const next = gamesStore.getSnapshot().filter((g) => g.id !== id);
  gamesStore.set(next);
  persist(next);
}
