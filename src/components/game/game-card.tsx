"use client";

import Link from "next/link";
import { Archive, ArchiveRestore, Play } from "lucide-react";
import type { Game } from "@/lib/types";
import { playerColor } from "@/lib/palette";
import { cn } from "@/lib/utils";

const MAX_AVATARS = 3;

export function GameCard({
  game,
  onToggleArchive,
}: {
  game: Game;
  onToggleArchive?: () => void;
}) {
  const extra = game.players.length - MAX_AVATARS;

  return (
    <div className="relative">
      <Link
        href={`/partie/${game.id}`}
        className={cn(
          "flex items-center gap-3 rounded-2xl border-2 bg-card p-4 shadow-sm transition-shadow hover:shadow-md",
          game.archived ? "border-border/60 opacity-80" : "border-primary/30",
          onToggleArchive && "pr-14",
        )}
      >
        <span
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-xl",
            game.archived ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary",
          )}
        >
          {game.archived ? <Archive className="size-5" /> : <Play className="size-5" />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-heading text-base leading-tight">{game.name}</span>
          <span className="block truncate text-xs text-muted-foreground">
            Manche {game.rounds.length + 1} · {game.players.map((p) => p.name).join(" · ")}
          </span>
        </span>
        <span className="flex shrink-0 -space-x-1.5">
          {game.players.slice(0, MAX_AVATARS).map((p, i) => (
            <span
              key={p.id}
              className={cn(
                "flex size-6 items-center justify-center rounded-full border-2 border-card text-[10px] font-bold text-white",
                playerColor(i),
              )}
            >
              {p.name.charAt(0).toUpperCase()}
            </span>
          ))}
          {extra > 0 && (
            <span className="flex size-6 items-center justify-center rounded-full border-2 border-card bg-muted text-[10px] font-bold text-muted-foreground">
              +{extra}
            </span>
          )}
        </span>
      </Link>
      {onToggleArchive && (
        <button
          type="button"
          onClick={onToggleArchive}
          className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border-2 border-border/50 bg-card text-muted-foreground shadow-sm hover:text-foreground"
          aria-label={game.archived ? "Reprendre cette partie" : "Archiver cette partie"}
        >
          {game.archived ? <ArchiveRestore className="size-4" /> : <Archive className="size-4" />}
        </button>
      )}
    </div>
  );
}
