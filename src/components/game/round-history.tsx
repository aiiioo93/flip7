"use client";

import { useState } from "react";
import { ChevronDown, Crown, Pencil, Undo2 } from "lucide-react";
import type { Player, Round } from "@/lib/types";
import { playerColor } from "@/lib/palette";
import { cn } from "@/lib/utils";
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

export function RoundHistory({
  players,
  rounds,
  onUndoLast,
  onEditRound,
}: {
  players: Player[];
  rounds: Round[];
  onUndoLast?: () => void;
  onEditRound?: (roundId: string, scores: Record<string, number>) => void;
}) {
  const [open, setOpen] = useState(false);
  const [editingRound, setEditingRound] = useState<Round | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});

  if (rounds.length === 0) return null;

  function startEdit(round: Round) {
    if (!onEditRound) return;
    setEditingRound(round);
    setValues(
      Object.fromEntries(players.map((p) => [p.id, String(round.scores[p.id] ?? 0)])),
    );
  }

  function saveEdit() {
    if (!editingRound || !onEditRound) return;
    const scores: Record<string, number> = {};
    for (const p of players) {
      const raw = values[p.id]?.trim();
      scores[p.id] = raw ? Number(raw) : 0;
    }
    onEditRound(editingRound.id, scores);
    setEditingRound(null);
  }

  return (
    <div className="flex flex-col gap-2.5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-2xl border-2 border-border/60 bg-card px-4 py-3 shadow-sm"
      >
        <span className="font-heading text-sm text-foreground">
          Détail des manches
          <span className="ml-2 rounded-full bg-teal/15 px-2 py-0.5 text-xs font-bold text-teal-foreground">
            {rounds.length}
          </span>
        </span>
        <ChevronDown
          className={cn("size-4 text-muted-foreground transition-transform", open && "rotate-180")}
        />
      </button>

      {open &&
        [...rounds]
          .map((round, i) => ({ round, number: i + 1 }))
          .reverse()
          .map(({ round, number }) => {
            const best = Math.max(...players.map((p) => round.scores[p.id] ?? 0));
            return (
              <button
                key={round.id}
                type="button"
                disabled={!onEditRound}
                onClick={() => startEdit(round)}
                className={cn(
                  "w-full rounded-2xl border-2 border-border/60 bg-card p-3.5 text-left shadow-sm",
                  onEditRound && "transition-shadow hover:shadow-md active:scale-[0.99]",
                )}
              >
                <div className="mb-2.5 flex items-center justify-between">
                  <span className="rounded-full border border-gold/60 bg-gold/20 px-2.5 py-0.5 font-heading text-xs text-gold-foreground">
                    Manche {number}
                  </span>
                  {onEditRound && <Pencil className="size-3.5 text-muted-foreground" />}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {players.map((p, pi) => {
                    const score = round.scores[p.id] ?? 0;
                    const isBest = score === best && best > 0;
                    return (
                      <span
                        key={p.id}
                        className={cn(
                          "flex items-center gap-1.5 rounded-full py-1 pl-1 pr-2.5",
                          isBest ? "bg-gold/25" : "bg-muted",
                        )}
                      >
                        <span
                          className={cn(
                            "flex size-5 items-center justify-center rounded-full text-[10px] font-bold text-white",
                            playerColor(pi),
                          )}
                        >
                          {p.name.charAt(0).toUpperCase()}
                        </span>
                        <span className="text-sm font-bold tabular-nums">{score}</span>
                        {isBest && <Crown className="size-3 text-gold-foreground" />}
                      </span>
                    );
                  })}
                </div>
              </button>
            );
          })}

      {open && onUndoLast && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onUndoLast}
          className="gap-1.5 self-start text-muted-foreground"
        >
          <Undo2 className="size-3.5" />
          Annuler la dernière manche
        </Button>
      )}

      <Dialog open={editingRound !== null} onOpenChange={(v) => !v && setEditingRound(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Modifier la manche{" "}
              {editingRound ? rounds.findIndex((r) => r.id === editingRound.id) + 1 : ""}
            </DialogTitle>
            <DialogDescription>Corrige le score de chaque joueur pour cette manche.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            {players.map((p) => (
              <div key={p.id} className="flex flex-col gap-1.5">
                <Label htmlFor={`edit-score-${p.id}`} className="truncate text-xs text-muted-foreground">
                  {p.name}
                </Label>
                <Input
                  id={`edit-score-${p.id}`}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={values[p.id] ?? ""}
                  onChange={(e) =>
                    setValues((prev) => ({
                      ...prev,
                      [p.id]: e.target.value.replace(/[^0-9]/g, ""),
                    }))
                  }
                  className="h-11 text-center text-lg font-semibold"
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setEditingRound(null)}>
              Annuler
            </Button>
            <Button onClick={saveEdit}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
