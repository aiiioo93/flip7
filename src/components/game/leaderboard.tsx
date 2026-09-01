"use client";

import { motion } from "motion/react";
import { Plus } from "lucide-react";
import type { Player, PlayerStanding } from "@/lib/types";
import { cn } from "@/lib/utils";

const RANK_STYLES: Record<number, string> = {
  1: "bg-gradient-to-br from-amber-300 to-amber-500 text-amber-950 shadow-md shadow-amber-500/40",
  2: "bg-gradient-to-br from-slate-200 to-slate-400 text-slate-900 shadow-sm",
  3: "bg-gradient-to-br from-orange-300 to-orange-500 text-orange-950 shadow-sm",
};

const RANK_RING: Record<number, string> = {
  1: "border-amber-400/70 ring-2 ring-amber-300/40",
  2: "border-slate-300",
  3: "border-orange-400/50",
};

export function Leaderboard({
  standings,
  targetScore,
  pendingScores,
  onSelectPlayer,
}: {
  standings: PlayerStanding[];
  targetScore: number;
  /** scores de la manche en cours, saisis mais pas encore validés (playerId -> points) */
  pendingScores?: Record<string, number>;
  onSelectPlayer?: (player: Player) => void;
}) {
  const interactive = onSelectPlayer !== undefined;

  return (
    <div className="flex flex-col gap-2.5">
      {standings.map((s) => {
        const delta = s.total - s.previousTotal;
        const progress = Math.min(100, Math.round((s.total / targetScore) * 100));
        const pending = pendingScores?.[s.player.id];
        return (
          <motion.div
            key={s.player.id}
            layout
            layoutId={s.player.id}
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
            onClick={interactive ? () => onSelectPlayer(s.player) : undefined}
            role={interactive ? "button" : undefined}
            tabIndex={interactive ? 0 : undefined}
            onKeyDown={
              interactive
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelectPlayer(s.player);
                    }
                  }
                : undefined
            }
            className={cn(
              "relative overflow-hidden rounded-2xl border-2 bg-card p-3.5 shadow-sm",
              RANK_RING[s.rank] ?? "border-border/60",
              interactive && "cursor-pointer transition-transform active:scale-[0.98]",
            )}
          >
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-teal/25 to-teal/5 transition-all"
              style={{ width: `${progress}%` }}
              aria-hidden
            />
            <div className="relative flex items-center gap-3">
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                  RANK_STYLES[s.rank] ?? "bg-muted text-muted-foreground",
                )}
              >
                {s.rank}
              </span>
              <span className="flex-1 truncate font-heading text-base">{s.player.name}</span>
              {pending !== undefined ? (
                <span className="animate-pulse rounded-full border-2 border-dashed border-gold bg-gold/20 px-2.5 py-0.5 text-sm font-bold text-gold-foreground">
                  +{pending}
                </span>
              ) : (
                <>
                  {delta !== 0 && (
                    <span className="rounded-full bg-teal/15 px-2 py-0.5 text-xs font-bold text-teal-foreground">
                      +{delta}
                    </span>
                  )}
                  {interactive && (
                    <span
                      className="flex size-7 items-center justify-center rounded-full border-2 border-dashed border-border text-muted-foreground"
                      aria-hidden
                    >
                      <Plus className="size-3.5" />
                    </span>
                  )}
                </>
              )}
              <span className="min-w-[3ch] text-right text-xl font-bold tabular-nums">
                {s.total}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
