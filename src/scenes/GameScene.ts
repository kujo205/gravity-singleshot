import { Scene } from './Scene.ts';
import { Application, Container, Ticker } from 'pixi.js';
import { type GameState } from '../core/game/GameState.ts';
import { Button } from '../ui/Button.ts';
import { emitSceneChange } from '$lib/sceneChange.ts';

export class GameScene extends Scene {
  private uiContainer?: Container;
  private headerContainer?: Container;
  private gameLoopCallback?: (delta: Ticker) => void;

  constructor(app: Application, gameState: GameState) {
    super('GameScene', app, gameState);
    this.createHeader();
    this.buildUi();
  }

  buildUi() {
    if (this.uiContainer) {
      this.removeChild(this.uiContainer);
      this.uiContainer.destroy({ children: true });
    }

    this.uiContainer = new Container();

    this.gameState.loadGameState(this.uiContainer);

    this.gameLoopCallback = (delta: Ticker) => {
      try {
        this.gameState.update(delta.deltaTime);
      } catch (e) {
        // avoid crashes bcs round objects unmouned and were destroyed
      }
    };

    this.gameState.registerCallback('win', () => {
      this.gameState.lastGameEndTime = Date.now();
      emitSceneChange('WIN_GAME_SCENE');
    });

    this.gameState.registerCallback('loss', () => {
      this.gameState.lastGameEndTime = Date.now();
      emitSceneChange('LOST_GAME_SCENE');
    });

    this.app.ticker.add(this.gameLoopCallback);

    this.addChild(this.uiContainer);
  }

  private createHeader() {
    if (this.headerContainer) {
      this.removeChild(this.headerContainer);
      this.headerContainer.destroy({ children: true });
    }

    this.headerContainer = new Container();

    const backButton = new Button('outline', 'BACK TO MENU', 200, 50, 8);
    backButton.x = 60;
    backButton.y = 50;

    backButton.onClick(() => {
      emitSceneChange('MAIN_MENU');
    });

    this.headerContainer.addChild(backButton);
    this.addChild(this.headerContainer);
  }

  destroy(options?: boolean | object) {
    // Remove ticker callback to stop game loop
    if (this.gameLoopCallback) {
      this.app.ticker.remove(this.gameLoopCallback);
      this.gameLoopCallback = undefined;
    }

    if (this.uiContainer) {
      this.uiContainer.destroy({ children: true });
      this.uiContainer = undefined;
    }

    if (this.headerContainer) {
      this.headerContainer.destroy({ children: true });
      this.headerContainer = undefined;
    }

    super.destroy(options);
  }
}
