/** Palette façon cartes Flip 7 — une couleur par joueur, cyclique. */
export const PLAYER_COLORS = [
  "bg-rose-400",
  "bg-teal",
  "bg-amber-400",
  "bg-sky-500",
  "bg-lime-500",
  "bg-fuchsia-400",
  "bg-orange-400",
  "bg-violet-400",
];

export function playerColor(index: number) {
  return PLAYER_COLORS[index % PLAYER_COLORS.length];
}
