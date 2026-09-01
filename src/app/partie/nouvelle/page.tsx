"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createGame } from "@/lib/use-game";
import { PlayerSetup } from "@/components/game/player-setup";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function NouvellePartiePage() {
  const router = useRouter();
  const [name, setName] = useState("");

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-5 py-8">
      <header className="flex items-center gap-3">
        <Link
          href="/"
          className="flex size-9 items-center justify-center rounded-full border-2 border-border/50 bg-card text-muted-foreground shadow-sm"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <h1 className="font-heading text-xl">Nouvelle partie</h1>
      </header>

      <div className="flex flex-col gap-2">
        <Label htmlFor="game-name" className="px-1 text-xs text-muted-foreground">
          Nom de la partie
        </Label>
        <Input
          id="game-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex. Soirée en famille"
          className="h-12 text-base"
          maxLength={40}
        />
      </div>

      <div className="flex flex-col gap-2">
        <p className="px-1 text-xs text-muted-foreground">Joueurs</p>
        <PlayerSetup
          onStart={(names) => {
            const game = createGame(name, names);
            router.replace(`/partie/${game.id}`);
          }}
        />
      </div>
    </main>
  );
}
