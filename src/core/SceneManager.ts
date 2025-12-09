import * as PIXI from 'pixi.js';

import { onSceneChange } from '$lib/sceneChange';
import { config, type TGameScenes } from '../config';
import { Assets } from 'pixi.js';

export class SceneManager {
  private app: PIXI.Application;
  private currentScene?: PIXI.Container;

  constructor(app: PIXI.Application) {
    this.app = app;
    this.registerSceneChange();
  }

  private registerSceneChange() {
    onSceneChange((newScene) => this.changeScene(newScene));
  }

  changeScene(scene: TGameScenes) {
    const SceneClass = config.GAME_SCENES[scene];
    const newScene: PIXI.Container = new SceneClass(this.app);

    console.log('Cached assets:', Assets.cache);

    if (this.currentScene) {
      this.app.stage.removeChild(this.currentScene);
      this.currentScene.destroy({ children: true, texture: false, textureSource: false });
    }

    console.log('Cached assets:', Assets.cache);

    this.currentScene = newScene;
    this.app.stage.addChild(this.currentScene);
  }
}
