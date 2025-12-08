import { assert } from '$lib/helpers/assert.ts';
import type { Container } from 'pixi.js';
import { createDummyRound } from './rounds.ts';
import { type RoundGetter } from './types.ts';
import type { GameRound } from './GameRound.ts';

export class GameState {
  /**
   * current comet x coordinate
   */
  currentCometX: number = 0;

  /**
   * current  y coordinate
   */
  currentCometY: number = 0;

  /**
   * a list of all available round objects and their state related to how player played
   */
  roundGetters: RoundGetter[] = [createDummyRound];

  /**
   * currently selected game round
   */
  private currentlySelectedIndex?: number | null = 0;

  /**
   * reference to the currently loaded game round
   */
  currentRound?: GameRound;

  // calls this function when game scene is loaded
  loadGameState(parentContainer: Container) {
    assert(typeof this.currentlySelectedIndex === 'number', 'no round is selected');

    this.currentRound = this.roundGetters[this.currentlySelectedIndex]();

    for (const round of this.currentRound.roundGameObjects) {
      parentContainer.addChild(round);
    }
  }
}

export const gameState = new GameState();
