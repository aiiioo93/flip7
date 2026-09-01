"use client";

import Link from "next/link";
import { ArrowLeft, Trophy } from "lucide-react";
import { useGames } from "@/lib/use-game";
import { computeStandings } from "@/lib/scoring";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function HistoriquePage() {
  const { games } = useGames();
  const finished = games
    .filter((g) => g.status === "finished")
    .sort((a, b) => (b.finishedAt ?? b.createdAt).localeCompare(a.finishedAt ?? a.createdAt));

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-5 px-5 py-6">
      <header className="flex items-center gap-3">
        <Link
          href="/"
          className="flex size-9 items-center justify-center rounded-full border-2 border-border/50 bg-card text-muted-foreground shadow-sm"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <h1 className="font-heading text-xl">Historique des parties</h1>
      </header>

      {finished.length === 0 && (
        <p className="mt-10 text-center text-sm text-muted-foreground">
          Aucune partie terminée pour l&apos;instant.
        </p>
      )}

      <ul className="flex flex-col gap-2.5">
        {finished.map((game) => {
          const standings = computeStandings({ players: game.players, rounds: game.rounds });
          const winners = standings.filter((s) => s.rank === 1);
          return (
            <li key={game.id}>
              <Link
                href={`/historique/${game.id}`}
                className="flex flex-col gap-2 rounded-2xl border-2 border-border/60 bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="truncate font-heading text-base">{game.name}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatDate(game.finishedAt ?? game.createdAt)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="size-4 shrink-0 text-gold" />
                  <span className="truncate text-sm font-bold">
                    {winners.map((w) => w.player.name).join(" & ")}
                  </span>
                  <span className="ml-auto text-sm font-bold tabular-nums">
                    {winners[0]?.total}
                  </span>
                </div>
                <p className="truncate text-xs text-muted-foreground">
                  {game.rounds.length} manche{game.rounds.length > 1 ? "s" : ""} ·{" "}
                  {game.players.map((p) => p.name).join(" · ")}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
