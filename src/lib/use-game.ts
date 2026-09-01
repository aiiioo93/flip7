"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { Game, Player, Round } from "@/lib/types";
import { computeStandings, getWinnerIds, DEFAULT_TARGET_SCORE } from "@/lib/scoring";
import { gamesStore, upsertGame, removeGame, defaultGameName } from "@/lib/games-store";

function makeId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function applyRounds(game: Game, rounds: Round[]): Game {
  const standings = computeStandings({ players: game.players, rounds });
  const winnerIds = getWinnerIds(standings, game.targetScore);
  return {
    ...game,
    rounds,
    status: winnerIds.length > 0 ? "finished" : "playing",
    winnerIds: winnerIds.length > 0 ? winnerIds : undefined,
    finishedAt: winnerIds.length > 0 ? new Date().toISOString() : undefined,
  };
}

function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function useGames() {
  const games = useSyncExternalStore(
    gamesStore.subscribe,
    gamesStore.getSnapshot,
    gamesStore.getServerSnapshot,
  );
  const hydrated = useHydrated();
  return { games, hydrated };
}

export function createGame(
  name: string,
  playerNames: string[],
  targetScore: number = DEFAULT_TARGET_SCORE,
): Game {
  const createdAt = new Date().toISOString();
  const players: Player[] = playerNames.map((n) => ({ id: makeId(), name: n }));
  const game: Game = {
    id: makeId(),
    name: name.trim() || defaultGameName(createdAt),
    createdAt,
    status: "playing",
    players,
    rounds: [],
    targetScore,
  };
  upsertGame(game);
  return game;
}

export function useGame(id: string) {
  const { games, hydrated } = useGames();
  const game = games.find((g) => g.id === id) ?? null;

  const addRound = useCallback(
    (scores: Record<string, number>) => {
      if (!game) return;
      const next = applyRounds(game, [...game.rounds, { id: makeId(), scores }]);
      // jouer une manche réactive une partie archivée
      upsertGame({ ...next, archived: undefined });
    },
    [game],
  );

  const editRound = useCallback(
    (roundId: string, scores: Record<string, number>) => {
      if (!game) return;
      const rounds = game.rounds.map((r) => (r.id === roundId ? { ...r, scores } : r));
      upsertGame(applyRounds(game, rounds));
    },
    [game],
  );

  const undoLastRound = useCallback(() => {
    if (!game || game.rounds.length === 0) return;
    upsertGame({
      ...game,
      rounds: game.rounds.slice(0, -1),
      status: "playing",
      winnerIds: undefined,
      finishedAt: undefined,
    });
  }, [game]);

  const updateSettings = useCallback(
    (input: { name: string; targetScore: number; playerNames: Record<string, string> }) => {
      if (!game) return;
      const players = game.players.map((p) => ({
        ...p,
        name: (input.playerNames[p.id] ?? p.name).trim() || p.name,
      }));
      const targetScore =
        Number.isFinite(input.targetScore) && input.targetScore > 0
          ? input.targetScore
          : game.targetScore;
      const base = { ...game, name: input.name.trim() || game.name, targetScore, players };
      upsertGame(applyRounds(base, base.rounds));
    },
    [game],
  );

  const deleteGame = useCallback(() => {
    if (game) removeGame(game.id);
  }, [game]);

  return { game, hydrated, addRound, editRound, undoLastRound, updateSettings, deleteGame };
}
