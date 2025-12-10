import { assert } from '$lib/helpers/assert.ts';
import type { Container } from 'pixi.js';
import { GameRound } from './GameRound.ts';
import { Comet } from './Comet.ts';
import { emitSceneChange } from '$lib/sceneChange.ts';

type TCallback = () => void;
type TGameEvent = 'loss' | 'win' | 'diamondCollected';

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
   * currently selected game round
   */
  private currentlySelectedRoundId?: number | null = 1;

  /**
   * reference to the currently loaded game round
   */
  currentRound: GameRound;

  callbacks: Array<{ cb: TCallback; event: TGameEvent }> = [];

  setCurrentlySelectedRoundId(id: number | null) {
    this.currentlySelectedRoundId = id;
  }

  constructor(
    /**
     * a list of all available round objects and their state related to how player played
     */
    public rounds: GameRound[] = []
  ) {}

  registerCallback(ev: TGameEvent, cb: TCallback) {
    this.callbacks.push({ cb, event: ev });
  }

  // calls this function when game scene is loaded
  loadGameState(parentContainer: Container) {
    const roundTemplateIndex = this.rounds.findIndex((r) => r.id === this.currentlySelectedRoundId);

    assert(roundTemplateIndex !== -1, 'no round is selected');

    // setting game state reference
    this.rounds[roundTemplateIndex].setGameState(this);

    // we need to clone the round cause each time round is unmount all the component are removed
    this.currentRound = this.rounds[roundTemplateIndex].getSameInstance();
    this.rounds[roundTemplateIndex] = this.currentRound;

    this.lastGameStartTime = Date.now();

    for (const round of this.currentRound.roundGameObjects) {
      parentContainer.addChild(round);
    }
  }

  update(deltaTime: number) {
    if (!this.currentRound) return;

    for (const gameObject of this.currentRound.roundGameObjects) {
      if (gameObject instanceof Comet) {
        gameObject.update(deltaTime, this.currentRound.roundGameObjects, this);
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

  loadNextRound() {
    assert(typeof this?.currentlySelectedRoundId === 'number', 'round not selected');

    const nextRoundId = this?.currentlySelectedRoundId + 1;

    if (nextRoundId > this.rounds.length) {
      alert('game over, thankx, this scene is still in progress');
      // TODO: add game over scene with stats
    } else {
      this.currentlySelectedRoundId = nextRoundId;
      emitSceneChange('GAME_SCENE');
    }
  }
}
