"use client";

import Link from "next/link";
import { Archive, ArrowLeft, Plus } from "lucide-react";
import { useGames } from "@/lib/use-game";
import { setGameArchived } from "@/lib/games-store";
import { GameCard } from "@/components/game/game-card";
import { Button } from "@/components/ui/button";

export default function PartiesPage() {
  const { games, hydrated } = useGames();
  const ongoing = games.filter((g) => g.status === "playing" && !g.archived);
  const archived = games.filter((g) => g.status === "playing" && g.archived);

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-5 py-6 pb-10">
      <header className="flex items-center gap-3">
        <Link
          href="/"
          className="flex size-9 items-center justify-center rounded-full border-2 border-border/50 bg-card text-muted-foreground shadow-sm"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <h1 className="font-heading text-xl">Toutes les parties</h1>
      </header>

      {hydrated && ongoing.length === 0 && archived.length === 0 && (
        <div className="mt-10 flex flex-col items-center gap-4 text-center">
          <p className="text-sm text-muted-foreground">Aucune partie en cours.</p>
          <Button
            className="gap-2 font-heading"
            render={
              <Link href="/partie/nouvelle">
                <Plus className="size-4" />
                Nouvelle partie
              </Link>
            }
          />
        </div>
      )}

      {ongoing.length > 0 && (
        <section className="flex flex-col gap-2.5">
          <h2 className="px-1 font-heading text-sm uppercase tracking-wide text-muted-foreground">
            En cours
          </h2>
          {ongoing.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onToggleArchive={() => setGameArchived(game.id, true)}
            />
          ))}
        </section>
      )}

      {archived.length > 0 && (
        <section className="flex flex-col gap-2.5">
          <h2 className="flex items-center gap-1.5 px-1 font-heading text-sm uppercase tracking-wide text-muted-foreground">
            <Archive className="size-3.5" />
            Archivées
          </h2>
          {archived.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onToggleArchive={() => setGameArchived(game.id, false)}
            />
          ))}
        </section>
      )}
    </main>
  );
}
