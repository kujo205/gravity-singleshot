import { Container, Application } from 'pixi.js';
import { Graphics } from 'pixi.js';

export class Scene extends Container {
  /**
   * Name of the scene
   */
  name: string;

  app: Application;

  constructor(sceneName: string, app: Application) {
    super();
    this.app = app;
    this.name = sceneName;

    console.log('width', app.screen.width);
    console.log('height', app.screen.height);

    // Create a transparent background that defines the scene size
    const background = new Graphics();
    background.rect(0, 0, app.screen.width, app.screen.height);
    background.fill({ color: 0x000000, alpha: 0 });

    this.addChildAt(background, 0);
  }
}
