import * as PIXI from 'pixi.js';

import { onSceneChange } from '$lib/sceneChange';
import { config, type TGameScenes } from '../config';
import type { GameState } from './game/GameState.ts';

export class SceneManager {
  private currentScene?: PIXI.Container;

  constructor(
    private app: PIXI.Application,
    public gameState: GameState
  ) {
    this.app = app;
    this.registerSceneChange();
  }

  private registerSceneChange() {
    onSceneChange((newScene) => this.changeScene(newScene));
  }

  changeScene(scene: TGameScenes) {
    const SceneClass = config.GAME_SCENES[scene];
    const newScene: PIXI.Container = new SceneClass(this.app, this.gameState);

    if (this.currentScene) {
      this.app.stage.removeChild(this.currentScene);
      this.currentScene.destroy({ children: true, texture: false, textureSource: false });
    }

    this.currentScene = newScene;
    this.app.stage.addChild(this.currentScene);
  }
}
