import { Scene } from './Scene.ts';
import { Application, Container, Ticker } from 'pixi.js';
import { gameState } from '../core/game/GameState.ts';
import { Button } from '../ui/Button.ts';
import { emitSceneChange } from '$lib/sceneChange.ts';
import { CollisionError } from '../core/game/CollisionError.ts';

export class GameScene extends Scene {
  private uiContainer?: Container;
  private headerContainer?: Container;
  private gameLoopCallback?: (delta: Ticker) => void;

  constructor(app: Application) {
    super('GameScene', app);
    this.createHeader();
    this.buildUi();
  }

  buildUi() {
    if (this.uiContainer) {
      this.removeChild(this.uiContainer);
      this.uiContainer.destroy({ children: true });
    }

    this.uiContainer = new Container();

    gameState.loadGameState(this.uiContainer);

    this.gameLoopCallback = (delta: Ticker) => {
      try {
        gameState.update(delta.deltaTime);
      } catch (e) {
        // avoid crashes bcs round objects unmouned and were destroyed
      }
    };

    gameState.registerCallback('win', () => {
      gameState.lastGameEndTime = Date.now();
      emitSceneChange('WIN_GAME_SCENE');
    });

    gameState.registerCallback('loss', () => {
      gameState.lastGameEndTime = Date.now();
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
