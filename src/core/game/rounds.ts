import { Planet, Earth } from './Planets.ts';
import { GameRound } from './GameRound.ts';
import { Comet } from './Comet.ts';
import { Diamond } from './Diamond.ts';

export function roundsFactory() {
  return [
    new GameRound(1, () => [
      new Comet(300, 400),
      new Planet(650, 400, 'red-giant'),
      new Earth(1000, 400)
    ]),
    new GameRound(2, () => [
      new Comet(200, 350),
      new Planet(550, 450, 'blackhole'),
      new Earth(900, 350)
    ]),
    new GameRound(3, () => [
      new Comet(400, 500),
      new Planet(700, 300, 'green-dwarf'),
      new Diamond(800, 400),
      new Planet(800, 500, 'red-giant'),
      new Earth(1100, 450)
    ]),
    new GameRound(4, () => [
      new Comet(250, 300),
      new Planet(600, 350, 'red-giant'),
      new Planet(750, 400, 'blackhole'),
      new Earth(950, 500)
    ]),
    new GameRound(5, () => [
      new Comet(350, 450),
      new Planet(500, 400, 'green-dwarf'),
      new Planet(650, 350, 'blackhole'),
      new Earth(1050, 400)
    ])
  ];
}
