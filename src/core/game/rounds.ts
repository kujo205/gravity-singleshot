import { Planet, Earth } from './Planets.ts';
import { GameRound } from './GameRound.ts';
import { Comet } from './Comet.ts';
import { Diamond } from './Diamond.ts';

export function roundsFactory() {
  return [
    new GameRound(1, () => [
      new Comet(300, 400),
      new Planet(650, 400, 'red-giant'),
      new Diamond(800, 350),
      new Earth(1000, 400)
    ]),
    new GameRound(2, () => [
      new Comet(200, 350),
      new Planet(550, 450, 'blackhole'),
      new Diamond(700, 300),
      new Diamond(800, 500),
      new Earth(900, 350)
    ]),
    new GameRound(3, () => [
      new Comet(400, 500),
      new Planet(700, 300, 'green-dwarf'),
      new Diamond(800, 400),
      new Diamond(900, 350),
      new Diamond(950, 500),
      new Planet(800, 500, 'red-giant'),
      new Earth(1100, 450)
    ]),
    new GameRound(4, () => [
      new Comet(250, 300),
      new Planet(600, 350, 'red-giant'),
      new Planet(750, 400, 'blackhole'),
      new Diamond(700, 300),
      new Diamond(850, 450),
      new Diamond(900, 500),
      new Earth(950, 500)
    ]),
    new GameRound(5, () => [
      new Comet(350, 450),
      new Planet(500, 400, 'green-dwarf'),
      new Planet(650, 350, 'blackhole'),
      new Diamond(600, 500),
      new Diamond(800, 400),
      new Diamond(950, 350),
      new Diamond(1000, 450),
      new Earth(1050, 400)
    ]),
    new GameRound(6, () => [
      new Comet(300, 600),
      new Planet(600, 100, 'blackhole'),
      new Planet(600, 175, 'blackhole'),
      new Planet(600, 250, 'blackhole'),
      new Planet(600, 325, 'blackhole'),
      new Planet(600, 400, 'blackhole'),
      new Planet(600, 475, 'blackhole'),
      new Planet(700, 475, 'blackhole'),
      new Planet(800, 475, 'blackhole'),
      new Earth(1000, 150),
      new Diamond(1000, 250),
      new Diamond(1000, 350),
      new Diamond(1000, 450),
      new Planet(900, 550, 'blackhole')
    ])
  ];
}
