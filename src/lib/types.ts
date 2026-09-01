export type Player = {
  id: string;
  name: string;
};

export type Round = {
  id: string;
  /** score gagné par chaque joueur pendant cette manche (playerId -> points) */
  scores: Record<string, number>;
};

export type GameStatus = "playing" | "finished";

export type Game = {
  id: string;
  name: string;
  createdAt: string;
  finishedAt?: string;
  status: GameStatus;
  players: Player[];
  rounds: Round[];
  targetScore: number;
  winnerIds?: string[];
  /** partie mise de côté, à reprendre plus tard */
  archived?: boolean;
};

export type PlayerStanding = {
  player: Player;
  total: number;
  rank: number;
  previousTotal: number;
};
