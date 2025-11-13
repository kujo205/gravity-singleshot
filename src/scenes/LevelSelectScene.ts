import { Scene } from '@core/Scene';
import type { ISceneManager } from '@types';
import * as PIXI from 'pixi.js';
import { Button } from '@ui/Button';
import { Panel } from '@ui/Panel';
import { Progress } from '@game/services/Progress';

export class LevelSelectScene extends Scene {
  private title: PIXI.Text;
  private backButton: Button;
  private levelButtons: Button[] = [];
  private progress: Progress;

  constructor(sceneManager: ISceneManager) {
    super(sceneManager);

    this.title = new PIXI.Text('SELECT LEVEL', {
      fontSize: 48,
      fill: 0xffffff,
      fontFamily: 'Arial',
      fontWeight: 'bold',
    });

    this.backButton = new Button({
      text: 'BACK',
      width: 150,
      height: 50,
      fontSize: 20,
    });

    this.progress = new Progress();
  }

  public init(): void {
    // Background
    const bg = new PIXI.Graphics();
    bg.beginFill(0x1a1a2e);
    bg.drawRect(0, 0, this.screenWidth, this.screenHeight);
    bg.endFill();
    this.addChild(bg);

    // Title
    this.title.anchor.set(0.5);
    this.title.position.set(this.screenWidth / 2, 80);
    this.addChild(this.title);

    // Back button
    this.backButton.position.set(50, 50);
    this.backButton.onClick = () => this.sceneManager.goto('menu');
    this.addChild(this.backButton);

    // Create level buttons (4x5 grid for 20 levels)
    const startX = 200;
    const startY = 180;
    const spacing = 180;
    const cols = 5;

    for (let i = 0; i < 20; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const x = startX + col * spacing;
      const y = startY + row * spacing;

      const isUnlocked = this.progress.isLevelUnlocked(i);
      const stats = this.progress.getLevelStats(`level-${i + 1}`);

      const button = new Button({
        text: `${i + 1}`,
        width: 120,
        height: 120,
        fontSize: 36,
        backgroundColor: stats.completed ? 0x2ecc71 : isUnlocked ? 0x4a90e2 : 0x555555,
      });

      button.position.set(x, y);
      button.setEnabled(isUnlocked);

      if (isUnlocked) {
        button.onClick = () => {
          this.progress.setCurrentLevel(i);
          this.sceneManager.goto('play', { levelIndex: i });
        };
      }

      this.levelButtons.push(button);
      this.addChild(button);

      // Show stars if completed
      if (stats.completed) {
        const starsText = new PIXI.Text('⭐'.repeat(stats.stars), {
          fontSize: 20,
          fill: 0xffd700,
        });
        starsText.anchor.set(0.5);
        starsText.position.set(x + 60, y + 135);
        this.addChild(starsText);
      }
    }
  }

  public update(_deltaTime: number): void {
    // Nothing to update
  }

  public resize(width: number, height: number): void {
    super.resize(width, height);
    this.title.position.set(width / 2, 80);
  }
}
