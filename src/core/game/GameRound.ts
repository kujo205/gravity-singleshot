import type { GameObject } from './GameObject.ts';

export class GameRound {
  constructor(
    /**
     * round id
     */
    public id: number,

    /**
     * Round object to be displayed on the round
     */
    public roundGameObjects: GameObject[],

    /**
     * All diamonds that can be collected by a user
     * */
    public totalDiamonds: number,

    /**
     * Diamond collected by a user
     */
    public diamondsCollected: number
  ) {}
}
