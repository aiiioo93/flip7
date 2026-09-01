"use client";

import { AnimatePresence, motion } from "motion/react";

/** Gros "Manche N" façon logo qui surgit quand on valide une manche. */
export function RoundTransition({ round }: { round: number | null }) {
  return (
    <AnimatePresence>
      {round !== null && (
        <motion.div
          key={round}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-[2px]"
        >
          <motion.p
            initial={{ scale: 0.3, rotate: -14, opacity: 0 }}
            animate={{ scale: 1, rotate: -4, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 16 }}
            className="logo-outline font-heading text-6xl text-[#ffd23e]"
          >
            Manche {round}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
