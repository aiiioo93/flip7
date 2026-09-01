"use client";

import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { motion } from "motion/react";
import { Trophy } from "lucide-react";
import type { PlayerStanding } from "@/lib/types";
import { Button } from "@/components/ui/button";

export function WinnerCelebration({
  standings,
  onNewGame,
  onGoHome,
}: {
  standings: PlayerStanding[];
  onNewGame: () => void;
  onGoHome: () => void;
}) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    const colors = ["#f4c95d", "#2fb8c6", "#e5484d", "#3b6fd6"];
    const duration = 1600;
    const end = Date.now() + duration;
    (function frame() {
      confetti({ particleCount: 4, angle: 60, spread: 65, origin: { x: 0 }, colors });
      confetti({ particleCount: 4, angle: 120, spread: 65, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }, []);

  const winners = standings.filter((s) => s.rank === 1);
  const winnerLabel =
    winners.length > 1
      ? `${winners.map((w) => w.player.name).join(" & ")} — égalité !`
      : winners[0]?.player.name;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-background/95 p-6 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.6, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="flex flex-col items-center gap-3 text-center"
      >
        <span className="flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-orange-500 shadow-lg shadow-amber-500/40">
          <Trophy className="size-10 text-amber-950" />
        </span>
        <h1 className="font-heading text-2xl font-extrabold text-foreground">{winnerLabel}</h1>
        <p className="text-sm text-muted-foreground">remporte la partie !</p>
      </motion.div>

      <div className="w-full max-w-sm rounded-2xl border-2 border-border/60 bg-card p-4 shadow-sm">
        <p className="mb-3 text-center text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Classement final
        </p>
        <ul className="flex max-h-[38vh] flex-col gap-2 overflow-y-auto">
          {standings.map((s) => (
            <li key={s.player.id} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <span className="w-5 text-muted-foreground">{s.rank}</span>
                <span className="font-medium">{s.player.name}</span>
              </span>
              <span className="font-bold tabular-nums">{s.total}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex w-full max-w-sm flex-col gap-2.5">
        <Button size="lg" className="h-12 font-semibold" onClick={onNewGame}>
          Nouvelle partie
        </Button>
        <Button size="lg" variant="secondary" className="h-12 font-semibold" onClick={onGoHome}>
          Retour à l&apos;accueil
        </Button>
      </div>
    </motion.div>
  );
}
