import { Scene } from '@core/Scene';
import type { ISceneManager } from '@types';
import * as PIXI from 'pixi.js';
import { Button } from '@ui/Button';

export class MenuScene extends Scene {
  private title: PIXI.Text;
  private playButton: Button;
  private levelSelectButton: Button;
  private shopButton: Button;

  constructor(sceneManager: ISceneManager) {
    super(sceneManager);

    this.title = new PIXI.Text('GRAVITY SINGLESHOT', {
      fontSize: 64,
      fill: 0xffffff,
      fontFamily: 'Arial',
      fontWeight: 'bold',
    });

    this.playButton = new Button({
      text: 'PLAY',
      width: 250,
      height: 70,
      fontSize: 28,
    });

    this.levelSelectButton = new Button({
      text: 'LEVEL SELECT',
      width: 250,
      height: 70,
      fontSize: 28,
    });

    this.shopButton = new Button({
      text: 'SHOP',
      width: 250,
      height: 70,
      fontSize: 28,
    });
  }

  public init(): void {
    // Setup title
    this.title.anchor.set(0.5);
    this.title.position.set(this.screenWidth / 2, this.screenHeight / 3);
    this.addChild(this.title);

    // Setup buttons
    this.playButton.position.set(this.screenWidth / 2 - 125, this.screenHeight / 2);
    this.playButton.onClick = () => this.sceneManager.goto('play');
    this.addChild(this.playButton);

    this.levelSelectButton.position.set(this.screenWidth / 2 - 125, this.screenHeight / 2 + 90);
    this.levelSelectButton.onClick = () => this.sceneManager.goto('levelselect');
    this.addChild(this.levelSelectButton);

    this.shopButton.position.set(this.screenWidth / 2 - 125, this.screenHeight / 2 + 180);
    this.shopButton.onClick = () => this.sceneManager.goto('shop');
    this.addChild(this.shopButton);

    // Add background
    const bg = new PIXI.Graphics();
    bg.beginFill(0x1a1a2e);
    bg.drawRect(0, 0, this.screenWidth, this.screenHeight);
    bg.endFill();
    this.addChildAt(bg, 0);
  }

  public update(_deltaTime: number): void {
    // Could add menu animations here
  }

  public resize(width: number, height: number): void {
    super.resize(width, height);
    this.title.position.set(width / 2, height / 3);
    this.playButton.position.set(width / 2 - 125, height / 2);
    this.levelSelectButton.position.set(width / 2 - 125, height / 2 + 90);
    this.shopButton.position.set(width / 2 - 125, height / 2 + 180);
  }
}
