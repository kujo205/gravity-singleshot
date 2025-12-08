import type { GameRound } from './GameRound.ts';

export interface Force {
  forceX: number;
  forceY: number;
}

export type RoundGetter = () => GameRound;
