import { Scene } from '@core/Scene';
import type { ISceneManager } from '@types';
import * as PIXI from 'pixi.js';
import { Assets } from '@core/Assets';

export class BootScene extends Scene {
  private loadingText: PIXI.Text;
  private loadingBar: PIXI.Graphics;
  private progress = 0;

  constructor(sceneManager: ISceneManager) {
    super(sceneManager);

    this.loadingText = new PIXI.Text('Loading...', {
      fontSize: 32,
      fill: 0xffffff,
      fontFamily: 'Arial',
    });

    this.loadingBar = new PIXI.Graphics();
  }

  public init(): void {
    // Center loading text
    this.loadingText.anchor.set(0.5);
    this.loadingText.position.set(this.screenWidth / 2, this.screenHeight / 2 - 50);
    this.addChild(this.loadingText);

    // Setup loading bar
    this.loadingBar.position.set(this.screenWidth / 2 - 200, this.screenHeight / 2 + 20);
    this.addChild(this.loadingBar);

    this.drawLoadingBar();

    // Start loading assets
    this.loadAssets();
  }

  private async loadAssets(): Promise<void> {
    // Simulate loading (in a real game, you'd load actual assets here)
    for (let i = 0; i <= 100; i += 10) {
      await this.sleep(100);
      this.progress = i;
      this.updateLoadingBar();
    }

    // Loading complete, go to menu
    this.sceneManager.goto('menu');
  }

  private updateLoadingBar(): void {
    this.loadingText.text = `Loading... ${this.progress}%`;
    this.drawLoadingBar();
  }

  private drawLoadingBar(): void {
    this.loadingBar.clear();

    // Background
    this.loadingBar.beginFill(0x333333);
    this.loadingBar.drawRect(0, 0, 400, 30);
    this.loadingBar.endFill();

    // Progress
    this.loadingBar.beginFill(0x4a90e2);
    this.loadingBar.drawRect(0, 0, (400 * this.progress) / 100, 30);
    this.loadingBar.endFill();

    // Border
    this.loadingBar.lineStyle(2, 0xffffff);
    this.loadingBar.drawRect(0, 0, 400, 30);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public update(_deltaTime: number): void {
    // Nothing to update during loading
  }

  public resize(width: number, height: number): void {
    super.resize(width, height);
    this.loadingText.position.set(width / 2, height / 2 - 50);
    this.loadingBar.position.set(width / 2 - 200, height / 2 + 20);
  }
}
