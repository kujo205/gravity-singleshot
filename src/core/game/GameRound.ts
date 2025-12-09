import type { GameObject } from './GameObject.ts';
import type { RoundBounds } from './types.ts';

export class GameRound {
  roundBounds: RoundBounds;

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
     */
    public totalDiamonds: number,
    /**
     * Diamond collected by a user
     */
    public diamondsCollected: number
  ) {
    this.roundBounds = this.calculateRoundBounds();
  }

  private calculateRoundBounds(): RoundBounds {
    const windowOffset = 100;

    return {
      point0: { x: -windowOffset, y: -windowOffset },
      point1: { x: window.innerWidth + windowOffset, y: window.innerHeight + windowOffset }
    };
  }
}
