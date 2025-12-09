import { assert } from '$lib/helpers/assert.ts';
import type { Container } from 'pixi.js';
import { createDummyRound } from './rounds.ts';
import { type RoundGetter } from './types.ts';
import type { GameRound } from './GameRound.ts';
import { Comet } from './Comet.ts';

type TCallback = () => void;
type TGameEvent = 'loss' | 'win';

export class GameState {
  /**
   * current comet x coordinate
   */
  currentCometX: number = 0;

  /**
   * current  y coordinate
   */
  currentCometY: number = 0;

  lastGameStartTime: number = 0;

  lastGameEndTime: number = 0;

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

  callbacks: Array<{ cb: TCallback; event: TGameEvent }> = [];

  registerCallback(ev: TGameEvent, cb: TCallback) {
    this.callbacks.push({ cb, event: ev });
  }

  // calls this function when game scene is loaded
  loadGameState(parentContainer: Container) {
    assert(typeof this.currentlySelectedIndex === 'number', 'no round is selected');

    this.currentRound = this.roundGetters[this.currentlySelectedIndex]();
    this.lastGameStartTime = Date.now();

    for (const round of this.currentRound.roundGameObjects) {
      parentContainer.addChild(round);
    }
  }

  update(deltaTime: number) {
    if (!this.currentRound) return;

    for (const gameObject of this.currentRound.roundGameObjects) {
      if (gameObject instanceof Comet) {
        gameObject.update(deltaTime, this.currentRound.roundGameObjects);
      }
    }
  }

  triggerEvent(event: TGameEvent, clearCbQueue: boolean = true) {
    for (const { event: registeredEvent, cb } of this.callbacks) {
      if (registeredEvent === event) {
        console.log('handling registeredEvent', event);
        cb();
      }
    }

    if (clearCbQueue) {
      this.callbacks = [];
    }
  }

  getElapsedTime() {
    console.log('getElapsedTime');
    console.log('lastGameEndTime', this.lastGameEndTime);
    console.log('lastGameStartTime', this.lastGameStartTime);
    return this.lastGameEndTime - this.lastGameStartTime;
  }
}

export const gameState = new GameState();
