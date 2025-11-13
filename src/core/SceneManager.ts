import type { ISceneManager, SceneConstructor } from '@types';
import type { App } from './App';

export class SceneManager implements ISceneManager {
  private app: App;
  private scenes: Map<string, SceneConstructor> = new Map();

  constructor(app: App) {
    this.app = app;
    this.app.setSceneManager(this);
  }

  public register(name: string, sceneClass: SceneConstructor): void {
    this.scenes.set(name, sceneClass);
  }

  public goto(name: string, data?: Record<string, unknown>): void {
    const SceneClass = this.scenes.get(name);
    if (!SceneClass) {
      throw new Error(`Scene "${name}" not found`);
    }

    const scene = new SceneClass(this, data);
    this.app.setScene(scene);
  }

  public getApp(): App {
    return this.app;
  }
}
