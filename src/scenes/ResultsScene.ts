import { Scene } from '@core/Scene';
import { Progress } from '@game/services/Progress';
import type { ISceneManager } from '@types';
import { Button } from '@ui/Button';
import { Panel } from '@ui/Panel';
import * as PIXI from 'pixi.js';

export class ResultsScene extends Scene {
  private title: PIXI.Text;
  private resultsPanel: Panel;
  private nextButton: Button;
  private retryButton: Button;
  private menuButton: Button;
  private progress: Progress;

  private levelId: string;
  private shots: number;
  private par: number;
  private levelName: string;

  constructor(sceneManager: ISceneManager, data?: Record<string, unknown>) {
    super(sceneManager);

    this.levelId = (data?.levelId as string) ?? 'level-1';
    this.shots = (data?.shots as number) ?? 0;
    this.par = (data?.par as number) ?? 3;
    this.levelName = (data?.levelName as string) ?? 'Level';

    this.progress = new Progress();

    this.title = new PIXI.Text('LEVEL COMPLETE!', {
      fontSize: 56,
      fill: 0x2ecc71,
      fontFamily: 'Arial',
      fontWeight: 'bold',
    });

    this.resultsPanel = new Panel({
      width: 500,
      height: 400,
      backgroundColor: 0x2c3e50,
    });

    this.nextButton = new Button({
      text: 'NEXT LEVEL',
      width: 200,
      height: 60,
      fontSize: 24,
    });

    this.retryButton = new Button({
      text: 'RETRY',
      width: 200,
      height: 60,
      fontSize: 24,
    });

    this.menuButton = new Button({
      text: 'MENU',
      width: 200,
      height: 60,
      fontSize: 24,
    });
  }

  public init(): void {
    // Background
    const bg = new PIXI.Graphics();
    bg.beginFill(0x1a1a2e);
    bg.drawRect(0, 0, this.screenWidth, this.screenHeight);
    bg.endFill();
    this.addChild(bg);

    // Calculate stars earned
    let stars = 1;
    if (this.shots <= this.par) {
      stars = 3;
    } else if (this.shots <= this.par + 2) {
      stars = 2;
    }

    // Save progress
    this.progress.completeLevel(this.levelId, this.shots, this.par);
    this.progress.unlockNextLevel();

    // Title
    this.title.anchor.set(0.5);
    this.title.position.set(this.screenWidth / 2, 100);
    this.addChild(this.title);

    // Results panel
    this.resultsPanel.position.set(this.screenWidth / 2 - 250, 200);
    this.addChild(this.resultsPanel);

    // Add results text
    const levelText = new PIXI.Text(this.levelName, {
      fontSize: 32,
      fill: 0xffffff,
      fontFamily: 'Arial',
      fontWeight: 'bold',
    });
    levelText.position.set(250 - levelText.width / 2, 30);
    this.resultsPanel.addContent(levelText);

    const shotsText = new PIXI.Text(`Shots: ${this.shots}`, {
      fontSize: 28,
      fill: 0xffffff,
      fontFamily: 'Arial',
    });
    shotsText.position.set(250 - shotsText.width / 2, 100);
    this.resultsPanel.addContent(shotsText);

    const parText = new PIXI.Text(`Par: ${this.par}`, {
      fontSize: 28,
      fill: 0xffff00,
      fontFamily: 'Arial',
    });
    parText.position.set(250 - parText.width / 2, 150);
    this.resultsPanel.addContent(parText);

    const starsText = new PIXI.Text('⭐'.repeat(stars), {
      fontSize: 48,
      fill: 0xffd700,
      fontFamily: 'Arial',
    });
    starsText.position.set(250 - starsText.width / 2, 220);
    this.resultsPanel.addContent(starsText);

    // Buttons
    this.nextButton.position.set(this.screenWidth / 2 - 100, 650);
    this.nextButton.onClick = () => {
      const currentLevel = this.progress.getCurrentLevel();
      this.sceneManager.goto('play', { levelIndex: currentLevel + 1 });
    };
    this.addChild(this.nextButton);

    this.retryButton.position.set(this.screenWidth / 2 - 320, 650);
    this.retryButton.onClick = () => {
      const currentLevel = this.progress.getCurrentLevel();
      this.sceneManager.goto('play', { levelIndex: currentLevel });
    };
    this.addChild(this.retryButton);

    this.menuButton.position.set(this.screenWidth / 2 + 120, 650);
    this.menuButton.onClick = () => this.sceneManager.goto('menu');
    this.addChild(this.menuButton);
  }

  public update(_deltaTime: number): void {
    // Nothing to update
  }

  public override resize(width: number, height: number): void {
    super.resize(width, height);
    this.title.position.set(width / 2, 100);
    this.resultsPanel.position.set(width / 2 - 250, 200);
    this.nextButton.position.set(width / 2 - 100, 650);
    this.retryButton.position.set(width / 2 - 320, 650);
    this.menuButton.position.set(width / 2 + 120, 650);
  }
}
