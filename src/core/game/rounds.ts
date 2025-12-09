import { Planet, Earth } from './Planets.ts';
import { GameRound } from './GameRound.ts';
import { Comet } from './Comet.ts';

export function createDummyRound(): GameRound {
  return new GameRound(
    1,
    [
      new Planet(120, 200, 'green'),
      new Planet(450, 200, 'red'),
      new Planet(800, 500, 'red'),
      new Planet(800, 200, 'green'),
      new Comet(400, 400),
      new Earth(400, 600)
    ],
    10,
    0
  );
}
