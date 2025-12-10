import type { GameObject } from './GameObject.ts';
import type { RoundBounds } from './types.ts';
import type { GameState } from './GameState.ts';
import { Diamond } from './Diamond.ts';

export class GameRound {
  roundBounds: RoundBounds;

  /**
   * Round object to be displayed on the round
   */
  public roundGameObjects: GameObject[];

  public gameState?: GameState;

  public get totalDiamonds() {
    return this.roundGameObjects.filter((item) => item instanceof Diamond).length;
  }

  public get diamondsCollected() {
    return this.roundGameObjects
      .filter((item) => item instanceof Diamond)
      .filter((item) => item.isCollected).length;
  }

  setGameState(gameState?: GameState) {
    this.gameState = gameState;
  }

  constructor(
    /**
     * round id
     */
    public id: number,

    /**
     * round game objects getter
     */
    public roundGameObjectsGetter: () => GameObject[]
  ) {
    this.roundGameObjects = this.roundGameObjectsGetter();
    this.roundBounds = this.calculateRoundBounds();
  }

  /**
   * Create a clone of the GameRound
   * @returns {GameRound} - clone of the GameRound
   */
  public getSameInstance(): GameRound {
    const clone = new GameRound(this.id, this.roundGameObjectsGetter);
    clone.setGameState(this.gameState);
    return clone;
  }

  private calculateRoundBounds(): RoundBounds {
    const windowOffset = 100;

    return {
      point0: { x: -windowOffset, y: -windowOffset },
      point1: { x: window.innerWidth + windowOffset, y: window.innerHeight + windowOffset }
    };
  }
}
