import type { GameRound } from './GameRound.ts';

export interface Force {
  forceX: number;
  forceY: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface RoundBounds {
  point0: Point;
  point1: Point;
}

export type RoundGetter = () => GameRound;
