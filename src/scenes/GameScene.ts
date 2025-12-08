import { Scene } from './Scene.ts';
import { Application, Container } from 'pixi.js';
import { gameState } from '../core/game/GameState.ts';
import { Button } from '../ui/Button.ts';
import { emitSceneChange } from '$lib/sceneChange.ts';

export class GameScene extends Scene {
  private uiContainer?: Container;
  private headerContainer?: Container;

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
    if (this.uiContainer) {
      this.uiContainer.destroy({ children: true });
    }
    if (this.headerContainer) {
      this.headerContainer.destroy({ children: true });
    }
    super.destroy(options);
  }
}
