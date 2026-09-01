"use client";

import Link from "next/link";
import { History, Layers, Plus } from "lucide-react";
import { useGames } from "@/lib/use-game";
import { setGameArchived } from "@/lib/games-store";
import { Flip7Logo } from "@/components/flip7-logo";
import { GameCard } from "@/components/game/game-card";
import { Button } from "@/components/ui/button";

const MAX_ONGOING_SHOWN = 2;

export default function Home() {
  const { games, hydrated } = useGames();
  const ongoing = games.filter((g) => g.status === "playing" && !g.archived);
  const archivedCount = games.filter((g) => g.status === "playing" && g.archived).length;
  const shown = ongoing.slice(0, MAX_ONGOING_SHOWN);
  const showAllGames = ongoing.length > MAX_ONGOING_SHOWN || archivedCount > 0;

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-8 px-6 py-10">
      <div className="flex flex-col items-center gap-6 pt-14 text-center">
        <Flip7Logo />
        <p className="max-w-[26ch] text-sm text-muted-foreground">
          Le compteur de points pour tes parties de Flip 7. Classement en direct, sans prise de
          tête.
        </p>
      </div>

      {hydrated && (shown.length > 0 || showAllGames) && (
        <section className="flex flex-col gap-2.5">
          <h2 className="px-1 font-heading text-sm uppercase tracking-wide text-muted-foreground">
            Parties en cours
          </h2>
          {shown.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onToggleArchive={() => setGameArchived(game.id, true)}
            />
          ))}
          {showAllGames && (
            <Link
              href="/parties"
              className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-card/60 px-4 py-3 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground"
            >
              <Layers className="size-4" />
              Toutes les parties
              <span className="rounded-full bg-teal/15 px-2 py-0.5 text-xs font-bold text-teal-foreground">
                {ongoing.length + archivedCount}
              </span>
            </Link>
          )}
        </section>
      )}

      <div className="mt-auto flex flex-col gap-3">
        <Button
          size="lg"
          className="h-14 gap-2 font-heading text-base"
          render={
            <Link href="/partie/nouvelle">
              <Plus className="size-5" />
              Nouvelle partie
            </Link>
          }
        />
        <Button
          size="lg"
          variant="secondary"
          className="h-14 gap-2 font-heading text-base"
          render={
            <Link href="/historique">
              <History className="size-5" />
              Historique
            </Link>
          }
        />
      </div>
    </main>
  );
}
