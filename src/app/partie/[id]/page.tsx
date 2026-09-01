"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Archive, ArrowLeft, Check, Settings, Trash2 } from "lucide-react";
import type { Player } from "@/lib/types";
import { useGame } from "@/lib/use-game";
import { setGameArchived } from "@/lib/games-store";
import { computeStandings } from "@/lib/scoring";
import { playerColor } from "@/lib/palette";
import { cn } from "@/lib/utils";
import { Leaderboard } from "@/components/game/leaderboard";
import { RoundHistory } from "@/components/game/round-history";
import { RoundTransition } from "@/components/game/round-transition";
import { WinnerCelebration } from "@/components/game/winner-celebration";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const TARGET_PRESETS = [200, 250, 300];

export default function PartiePage(props: PageProps<"/partie/[id]">) {
  const { id } = use(props.params);
  const router = useRouter();
  const { game, hydrated, addRound, editRound, undoLastRound, updateSettings, deleteGame } =
    useGame(id);

  const [pending, setPending] = useState<Record<string, number>>({});
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [draft, setDraft] = useState("");
  const [transitionRound, setTransitionRound] = useState<number | null>(null);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsName, setSettingsName] = useState("");
  const [settingsTarget, setSettingsTarget] = useState("");
  const [settingsPlayers, setSettingsPlayers] = useState<Record<string, string>>({});
  const [confirmAbandon, setConfirmAbandon] = useState(false);

  if (!hydrated) return null;

  if (!game) {
    return (
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-4 px-5 py-6 text-center">
        <p className="text-sm text-muted-foreground">Cette partie est introuvable.</p>
        <Button variant="secondary" render={<Link href="/">Retour à l&apos;accueil</Link>} />
      </main>
    );
  }

  const standings = computeStandings({ players: game.players, rounds: game.rounds });

  if (game.status === "finished") {
    return (
      <WinnerCelebration
        standings={standings}
        onNewGame={() => router.push("/partie/nouvelle")}
        onGoHome={() => router.push("/")}
      />
    );
  }

  const roundNumber = game.rounds.length + 1;
  const allFilled = game.players.every((p) => pending[p.id] !== undefined);
  const filledCount = game.players.filter((p) => pending[p.id] !== undefined).length;

  function openEntry(player: Player) {
    setEditingPlayer(player);
    const current = pending[player.id];
    setDraft(current !== undefined ? String(current) : "");
  }

  function saveEntry() {
    if (!editingPlayer) return;
    const value = draft.trim() === "" ? 0 : Number(draft);
    setPending((prev) => ({ ...prev, [editingPlayer.id]: value }));
    setEditingPlayer(null);
  }

  function validateRound() {
    if (!game || !allFilled) return;
    const willFinish = standings.some(
      (s) => s.total + (pending[s.player.id] ?? 0) >= game.targetScore,
    );
    addRound(pending);
    setPending({});
    if (!willFinish) {
      const next = roundNumber + 1;
      setTransitionRound(next);
      window.setTimeout(() => {
        setTransitionRound((current) => (current === next ? null : current));
      }, 1300);
    }
  }

  function openSettings() {
    if (!game) return;
    setSettingsName(game.name);
    setSettingsTarget(String(game.targetScore));
    setSettingsPlayers(Object.fromEntries(game.players.map((p) => [p.id, p.name])));
    setSettingsOpen(true);
  }

  function saveSettings() {
    updateSettings({
      name: settingsName,
      targetScore: Number(settingsTarget),
      playerNames: settingsPlayers,
    });
    setSettingsOpen(false);
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-5 px-5 py-6 pb-10">
      <header className="flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/"
            className="flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-border/50 bg-card text-muted-foreground shadow-sm"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div className="min-w-0">
            <h1 className="truncate font-heading text-xl leading-tight">{game.name}</h1>
            <p className="text-xs text-muted-foreground">
              Manche {roundNumber} · Objectif {game.targetScore} pts
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={openSettings}
          className="flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-border/50 bg-card text-muted-foreground shadow-sm hover:text-foreground"
          aria-label="Réglages de la partie"
        >
          <Settings className="size-4" />
        </button>
      </header>

      <Leaderboard
        standings={standings}
        targetScore={game.targetScore}
        pendingScores={pending}
        onSelectPlayer={openEntry}
      />

      <div className="flex flex-col gap-2">
        <Button
          type="button"
          size="lg"
          disabled={!allFilled}
          onClick={validateRound}
          className="h-14 gap-2 font-heading text-base"
        >
          <Check className="size-5" />
          Valider la manche {roundNumber}
        </Button>
        {!allFilled && (
          <p className="text-center text-xs text-muted-foreground">
            Touche un joueur pour saisir son score ({filledCount}/{game.players.length})
          </p>
        )}
      </div>

      <RoundHistory
        players={game.players}
        rounds={game.rounds}
        onUndoLast={undoLastRound}
        onEditRound={editRound}
      />

      <RoundTransition round={transitionRound} />

      <Dialog open={editingPlayer !== null} onOpenChange={(v) => !v && setEditingPlayer(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Score de {editingPlayer?.name}</DialogTitle>
            <DialogDescription>Manche {roundNumber}</DialogDescription>
          </DialogHeader>
          <Input
            autoFocus
            inputMode="numeric"
            pattern="[0-9]*"
            value={draft}
            onChange={(e) => setDraft(e.target.value.replace(/[^0-9]/g, ""))}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                saveEntry();
              }
            }}
            placeholder="0"
            className="h-14 text-center text-2xl font-bold"
          />
          <DialogFooter>
            <Button variant="secondary" onClick={() => setEditingPlayer(null)}>
              Annuler
            </Button>
            <Button onClick={saveEntry}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="max-h-[88vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Réglages de la partie</DialogTitle>
            <DialogDescription>Nom, objectif et joueurs.</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="settings-name" className="text-xs text-muted-foreground">
                Nom de la partie
              </Label>
              <Input
                id="settings-name"
                value={settingsName}
                onChange={(e) => setSettingsName(e.target.value)}
                maxLength={40}
                className="h-11"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="settings-target" className="text-xs text-muted-foreground">
                Objectif (points pour gagner)
              </Label>
              <div className="flex gap-2">
                {TARGET_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setSettingsTarget(String(preset))}
                    className={cn(
                      "flex-1 rounded-xl border-2 py-2 font-heading text-sm transition-colors",
                      settingsTarget === String(preset)
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/60 bg-card text-muted-foreground",
                    )}
                  >
                    {preset}
                  </button>
                ))}
                <Input
                  id="settings-target"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={settingsTarget}
                  onChange={(e) => setSettingsTarget(e.target.value.replace(/[^0-9]/g, ""))}
                  className="h-auto w-20 text-center font-bold"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-xs text-muted-foreground">Joueurs</p>
              {game.players.map((p, i) => (
                <div key={p.id} className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white",
                      playerColor(i),
                    )}
                  >
                    {(settingsPlayers[p.id] ?? p.name).charAt(0).toUpperCase()}
                  </span>
                  <Input
                    value={settingsPlayers[p.id] ?? ""}
                    onChange={(e) =>
                      setSettingsPlayers((prev) => ({ ...prev, [p.id]: e.target.value }))
                    }
                    maxLength={20}
                    className="h-10"
                  />
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setSettingsOpen(false)}>
              Annuler
            </Button>
            <Button onClick={saveSettings}>Enregistrer</Button>
          </DialogFooter>

          <div className="mt-1 flex flex-col gap-2 border-t border-border/60 pt-4">
            <Button
              variant="secondary"
              className="gap-2"
              onClick={() => {
                setGameArchived(game.id, true);
                router.push("/");
              }}
            >
              <Archive className="size-4" />
              Archiver la partie
            </Button>
            <Button
              variant="ghost"
              className="gap-2 text-destructive hover:text-destructive"
              onClick={() => {
                setSettingsOpen(false);
                setConfirmAbandon(true);
              }}
            >
              <Trash2 className="size-4" />
              Abandonner la partie
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmAbandon} onOpenChange={setConfirmAbandon}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Abandonner la partie ?</DialogTitle>
            <DialogDescription>
              « {game.name} » sera supprimée et ne sera pas ajoutée à l&apos;historique.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setConfirmAbandon(false)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                deleteGame();
                router.push("/");
              }}
            >
              Abandonner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
