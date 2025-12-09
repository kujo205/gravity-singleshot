import { Planet, Earth } from './Planets.ts';
import { GameRound } from './GameRound.ts';
import { Comet } from './Comet.ts';

export function roundsFactory() {
  return [
    new GameRound(
      1,
      () => [
        new Comet(300, 400),
        new Planet(650, 400, 'red-giant'),
        new Earth(1000, 400)

        // new Planet(450, 400, 'blackhole')

        // new Planet(450, 300, 'green-dwarf'),
        // new Planet(700, 500, 'yellow')
      ],
      10,
      0
    )
  ];
}
