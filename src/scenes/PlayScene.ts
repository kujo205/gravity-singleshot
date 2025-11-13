import { Input } from '@core/Input';
import { Scene } from '@core/Scene';
import { LevelFactory } from '@game/levels';
import { World } from '@game/world/World';
import type { ISceneManager } from '@types';
import type { Level } from '@types';
import { Button } from '@ui/Button';
import { HUD } from '@ui/HUD';
import * as PIXI from 'pixi.js';

export class PlayScene extends Scene {
  private world: World | null = null;
  private hud: HUD;
  private pauseButton: Button;
  private resetButton: Button;
  private level: Level;
  private input: Input;
  private isDragging = false;
  private dragStart = { x: 0, y: 0 };
  private trajectoryLine: PIXI.Graphics;

  constructor(sceneManager: ISceneManager, data?: Record<string, unknown>) {
    super(sceneManager);

    // Load level (for now, use test level)
    const levelFactory = new LevelFactory();
    const levelIndex = (data?.levelIndex as number) ?? 0;

    // In a real implementation, load from file
    this.level = levelFactory.createTestLevel();
    this.level.id = `level-${levelIndex + 1}`;
    this.level.name = `Level ${levelIndex + 1}`;

    this.hud = new HUD();
    this.pauseButton = new Button({
      text: 'PAUSE',
      width: 120,
      height: 50,
      fontSize: 18,
    });

    this.resetButton = new Button({
      text: 'RESET',
      width: 120,
      height: 50,
      fontSize: 18,
    });

    this.input = new Input(document.body);
    this.trajectoryLine = new PIXI.Graphics();
  }

  public init(): void {
    // Background
    const bg = new PIXI.Graphics();
    bg.beginFill(0x0a0a1a);
    bg.drawRect(0, 0, this.screenWidth, this.screenHeight);
    bg.endFill();
    this.addChild(bg);

    // Create world
    this.world = new World(this.level, this.screenWidth, this.screenHeight);
    this.addChild(this.world);

    // Add trajectory line
    this.addChild(this.trajectoryLine);

    // Setup HUD
    this.hud.setLevel(this.level.name);
    this.hud.setPar(this.level.par);
    this.hud.setShots(0);
    this.hud.resize(this.screenWidth);
    this.addChild(this.hud);

    // Setup buttons
    this.pauseButton.position.set(this.screenWidth - 140, 10);
    this.pauseButton.onClick = () => this.sceneManager.goto('menu');
    this.addChild(this.pauseButton);

    this.resetButton.position.set(this.screenWidth - 270, 10);
    this.resetButton.onClick = () => this.reset();
    this.addChild(this.resetButton);

    // Setup input
    this.setupInput();

    // Start update loop
    this.sceneManager.getApp().getTicker().add(this.update, this);
  }

  private setupInput(): void {
    this.input.onDown((x, y) => {
      if (!this.world?.isLaunched()) {
        this.isDragging = true;
        this.dragStart = { x, y };
      }
    });

    this.input.onMove((x, y) => {
      if (this.isDragging && this.world && !this.world.isLaunched()) {
        this.drawTrajectoryPreview(x, y);
      }
    });

    this.input.onUp((x, y) => {
      if (this.isDragging && this.world && !this.world.isLaunched()) {
        this.launch(x, y);
        this.isDragging = false;
        this.trajectoryLine.clear();
      }
    });
  }

  private drawTrajectoryPreview(currentX: number, currentY: number): void {
    const dx = this.dragStart.x - currentX;
    const dy = this.dragStart.y - currentY;

    this.trajectoryLine.clear();
    this.trajectoryLine.lineStyle(3, 0xffffff, 0.5);
    this.trajectoryLine.moveTo(this.dragStart.x, this.dragStart.y);
    this.trajectoryLine.lineTo(currentX, currentY);

    // Draw arrow
    const angle = Math.atan2(dy, dx);
    const arrowSize = 15;
    this.trajectoryLine.moveTo(currentX, currentY);
    this.trajectoryLine.lineTo(
      currentX + arrowSize * Math.cos(angle - Math.PI / 6),
      currentY + arrowSize * Math.sin(angle - Math.PI / 6)
    );
    this.trajectoryLine.moveTo(currentX, currentY);
    this.trajectoryLine.lineTo(
      currentX + arrowSize * Math.cos(angle + Math.PI / 6),
      currentY + arrowSize * Math.sin(angle + Math.PI / 6)
    );
  }

  private launch(currentX: number, currentY: number): void {
    const velocityX = (this.dragStart.x - currentX) * 2;
    const velocityY = (this.dragStart.y - currentY) * 2;

    this.world?.launch(velocityX, velocityY);
    this.hud.incrementShots();
  }

  private reset(): void {
    this.world?.reset();
    this.hud.reset();
    this.trajectoryLine.clear();
  }

  public update(deltaTime: number): void {
    if (!this.world) return;

    this.world.update(deltaTime);

    // Check if level is completed
    if (this.world.isCompleted()) {
      this.sceneManager.goto('results', {
        levelId: this.level.id,
        shots: this.hud.getShots(),
        par: this.level.par,
        levelName: this.level.name,
      });
    }
  }

  public override resize(width: number, height: number): void {
    super.resize(width, height);
    this.hud.resize(width);
    this.pauseButton.position.set(width - 140, 10);
    this.resetButton.position.set(width - 270, 10);
  }

  public override destroy(options?: Parameters<PIXI.Container['destroy']>[0]): void {
    this.input.destroy();
    this.sceneManager.getApp().getTicker().remove(this.update, this);
    super.destroy(options);
  }
}
