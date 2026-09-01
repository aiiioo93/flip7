import { cn } from "@/lib/utils";

/* Recréation du logo officiel Flip 7 : éventail de cartes, bannière crème
   inclinée bordée de teal, lettrage jaune contour violet + extrusion rose. */

const FAN_CARDS = [
  { rotate: -58, color: "#2fb8c6" },
  { rotate: -44, color: "#e5484d" },
  { rotate: -30, color: "#ffd23e" },
  { rotate: -16, color: "#f7efdc" },
  { rotate: -2, color: "#4f7dd9" },
];

export function Flip7Logo({ className }: { className?: string }) {
  return (
    <div className={cn("relative inline-block", className)} aria-label="Flip 7">
      <div className="absolute -top-9 left-8 flex" aria-hidden>
        {FAN_CARDS.map((card, i) => (
          <span
            key={i}
            className="-ml-4 h-16 w-11 origin-bottom rounded-lg border-[3px] border-[#3d2b71] shadow-sm first:ml-0"
            style={{ backgroundColor: card.color, transform: `rotate(${card.rotate}deg)` }}
          />
        ))}
      </div>

      <div className="relative -skew-x-6 rounded-xl border-[3px] border-[#2fb8c6] bg-[#f7efdc] py-2 pl-6 pr-16 shadow-[5px_5px_0_0_#3d2b71]">
        <span className="logo-outline block skew-x-6 font-heading text-6xl leading-none text-[#ffd23e]">
          FLIP
        </span>
      </div>

      <span
        className="logo-outline absolute -right-4 -top-9 rotate-6 font-heading text-[6.5rem] leading-none text-[#ffd23e]"
        aria-hidden
      >
        7
      </span>
    </div>
  );
}
