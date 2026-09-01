import type { Game, PlayerStanding, Round } from "@/lib/types";

export const DEFAULT_TARGET_SCORE = 200;

function totalsAfter(players: Game["players"], rounds: Round[]): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const p of players) totals[p.id] = 0;
  for (const round of rounds) {
    for (const p of players) {
      totals[p.id] += round.scores[p.id] ?? 0;
    }
  }
  return totals;
}

/** Classement standard "1,1,3" : les ex-aequo partagent le même rang. */
export function computeStandings(game: Pick<Game, "players" | "rounds">): PlayerStanding[] {
  const totals = totalsAfter(game.players, game.rounds);
  const previousRounds = game.rounds.slice(0, -1);
  const previousTotals = totalsAfter(game.players, previousRounds);

  const sorted = [...game.players].sort((a, b) => totals[b.id] - totals[a.id]);

  const standings: PlayerStanding[] = [];
  for (let index = 0; index < sorted.length; index++) {
    const player = sorted[index];
    const total = totals[player.id];
    const rank = index === 0 || total !== standings[index - 1].total ? index + 1 : standings[index - 1].rank;
    standings.push({ player, total, rank, previousTotal: previousTotals[player.id] });
  }

  return standings;
}

export function getWinnerIds(standings: PlayerStanding[], targetScore: number): string[] {
  const leader = standings[0];
  if (!leader || leader.total < targetScore) return [];
  return standings.filter((s) => s.total === leader.total).map((s) => s.player.id);
}
