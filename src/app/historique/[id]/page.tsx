"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useGames } from "@/lib/use-game";
import { removeGame } from "@/lib/games-store";
import { computeStandings } from "@/lib/scoring";
import { RoundHistory } from "@/components/game/round-history";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const RANK_MEDAL: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

export default function HistoriqueDetailPage(props: PageProps<"/historique/[id]">) {
  const { id } = use(props.params);
  const router = useRouter();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { games, hydrated } = useGames();
  const game = games.find((g) => g.id === id) ?? null;

  if (!hydrated) return null;

  if (game === null) {
    return (
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-4 px-5 py-6 text-center">
        <p className="text-sm text-muted-foreground">Cette partie est introuvable.</p>
        <Button variant="secondary" render={<Link href="/historique">Retour à l&apos;historique</Link>} />
      </main>
    );
  }

  const standings = computeStandings({ players: game.players, rounds: game.rounds });

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-5 px-5 py-6 pb-10">
      <header className="flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/historique"
            className="flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-border/50 bg-card text-muted-foreground shadow-sm"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div className="min-w-0">
            <h1 className="truncate font-heading text-xl leading-tight">{game.name}</h1>
            <p className="text-xs text-muted-foreground">
              {formatDate(game.finishedAt ?? game.createdAt)}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setConfirmDelete(true)}
          className="flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-border/50 bg-card text-muted-foreground shadow-sm hover:text-destructive"
          aria-label="Supprimer cette partie"
        >
          <Trash2 className="size-4" />
        </button>
      </header>

      <div className="flex flex-col gap-2.5">
        {standings.map((s) => (
          <div
            key={s.player.id}
            className="flex items-center gap-3 rounded-2xl border-2 border-border/60 bg-card p-3.5 shadow-sm"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-base font-bold">
              {RANK_MEDAL[s.rank] ?? s.rank}
            </span>
            <span className="flex-1 truncate font-heading text-base">{s.player.name}</span>
            <span className="text-xl font-bold tabular-nums">{s.total}</span>
          </div>
        ))}
      </div>

      <RoundHistory players={game.players} rounds={game.rounds} />

      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer cette partie ?</DialogTitle>
            <DialogDescription>Cette action est définitive.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setConfirmDelete(false)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                removeGame(game.id);
                router.push("/historique");
              }}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
