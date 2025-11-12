import * as PIXI from 'pixi.js';

export class SceneManager {
  private app: PIXI.Application;
  private currentScene?: PIXI.Container;

  constructor(app: PIXI.Application) {
    this.app = app;
  }

  changeScene(newScene: PIXI.Container) {
    if (this.currentScene) {
      this.app.stage.removeChild(this.currentScene);
      this.currentScene.destroy({ children: true });
    }

    this.currentScene = newScene;
    this.app.stage.addChild(this.currentScene);
  }
}
