import { Planet } from './Planets.ts';
import { GameRound } from './GameRound.ts';

export function createDummyRound(): GameRound {
  return new GameRound(
    1,
    [
      new Planet(120, 400, 'green'),
      new Planet(120, 200, 'green'),
      new Planet(450, 200, 'blue'),
      new Planet(800, 600, 'red'),
      new Planet(800, 200, 'green')
    ],
    10,
    0
  );
}
