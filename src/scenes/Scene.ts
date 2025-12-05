import { Container } from 'pixi.js';

export class Scene extends Container {
  name: string;

  constructor(sceneName: string) {
    super();
    this.name = sceneName;
  }
}
