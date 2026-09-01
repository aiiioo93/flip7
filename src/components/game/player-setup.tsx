"use client";

import { useState } from "react";
import { X, Plus, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { playerColor } from "@/lib/palette";
import { cn } from "@/lib/utils";

export function PlayerSetup({ onStart }: { onStart: (names: string[]) => void }) {
  const [names, setNames] = useState<string[]>([]);
  const [draft, setDraft] = useState("");

  function addPlayer() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    setNames((prev) => [...prev, trimmed]);
    setDraft("");
  }

  function removePlayer(index: number) {
    setNames((prev) => prev.filter((_, i) => i !== index));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      addPlayer();
    }
  }

  const canStart = names.length >= 2;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nom du joueur"
          className="h-12 text-base"
          maxLength={20}
        />
        <Button type="button" size="icon" className="h-12 w-12 shrink-0" onClick={addPlayer}>
          <Plus className="size-5" />
        </Button>
      </div>

      {names.length > 0 && (
        <ul className="flex flex-col gap-2">
          {names.map((name, i) => (
            <li
              key={`${name}-${i}`}
              className="flex items-center gap-3 rounded-2xl border-2 border-border/60 bg-card px-4 py-3 shadow-sm"
            >
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white",
                  playerColor(i),
                )}
              >
                {name.charAt(0).toUpperCase()}
              </span>
              <span className="flex-1 truncate font-medium">{name}</span>
              <button
                type="button"
                onClick={() => removePlayer(i)}
                className="text-muted-foreground hover:text-destructive"
                aria-label={`Retirer ${name}`}
              >
                <X className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Button
        type="button"
        size="lg"
        disabled={!canStart}
        onClick={() => onStart(names)}
        className="h-14 gap-2 font-heading text-base font-bold"
      >
        <Play className="size-5" />
        Démarrer la partie
      </Button>
      {!canStart && (
        <p className="text-center text-xs text-muted-foreground">
          Ajoute au moins 2 joueurs pour commencer.
        </p>
      )}
    </div>
  );
}
