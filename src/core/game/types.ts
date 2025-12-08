import type { GameRound } from './GameRound.ts';

export interface Force {
  forceX: number;
  forceY: number;
}

export interface Gravitational {
  x: number; // from container, used to locate the object
  y: number; // from container, used to locate the object

  /**
   * Mass of an object
   * */
  mass: number;

  /**
   * Radius of an object
   * */
  radius: number;
}

export type RoundGetter = () => GameRound;
