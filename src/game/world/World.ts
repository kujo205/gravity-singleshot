import * as PIXI from 'pixi.js';
import type { Level, Vector2D } from '@types';
import { PhysicsSystem } from './systems/PhysicsSystem';
import { CollisionSystem } from './systems/CollisionSystem';
import { TrajectoryPreviewSystem } from './systems/TrajectoryPreviewSystem';
import { CheckpointSystem } from './systems/CheckpointSystem';
import { CameraSystem } from './systems/CameraSystem';

export class World extends PIXI.Container {
  private level: Level;
  private physicsSystem: PhysicsSystem;
  private collisionSystem: CollisionSystem;
  private trajectorySystem: TrajectoryPreviewSystem;
  private checkpointSystem: CheckpointSystem;
  private cameraSystem: CameraSystem;

  private player: PIXI.Graphics | null = null;
  private playerVelocity: Vector2D = { x: 0, y: 0 };
  private playerRadius = 10;
  private launched = false;
  private completed = false;

  constructor(level: Level, screenWidth: number, screenHeight: number) {
    super();
    this.level = level;

    // Initialize systems
    this.physicsSystem = new PhysicsSystem(level.gravity);
    this.collisionSystem = new CollisionSystem();
    this.trajectorySystem = new TrajectoryPreviewSystem();
    this.checkpointSystem = new CheckpointSystem(level.checkpoints);
    this.cameraSystem = new CameraSystem(screenWidth, screenHeight);

    this.setupLevel();
  }

  private setupLevel(): void {
    // Create platforms
    for (const platform of this.level.platforms) {
      const platformGraphic = new PIXI.Graphics();
      platformGraphic.beginFill(0x4a4a4a);
      platformGraphic.drawRect(platform.x, platform.y, platform.width, platform.height);
      platformGraphic.endFill();
      this.addChild(platformGraphic);
    }

    // Create start position
    const startMarker = new PIXI.Graphics();
    startMarker.beginFill(0x00ff00);
    startMarker.drawCircle(this.level.start.x, this.level.start.y, 15);
    startMarker.endFill();
    this.addChild(startMarker);

    // Create end position
    const endMarker = new PIXI.Graphics();
    endMarker.beginFill(0xff0000);
    endMarker.drawCircle(this.level.end.x, this.level.end.y, 20);
    endMarker.endFill();
    this.addChild(endMarker);

    // Create player
    this.player = new PIXI.Graphics();
    this.player.beginFill(0xffffff);
    this.player.drawCircle(0, 0, this.playerRadius);
    this.player.endFill();
    this.player.x = this.level.start.x;
    this.player.y = this.level.start.y;
    this.addChild(this.player);

    // Create checkpoints
    for (const checkpoint of this.level.checkpoints) {
      const checkpointGraphic = new PIXI.Graphics();
      checkpointGraphic.beginFill(0xffff00, 0.5);
      checkpointGraphic.drawCircle(checkpoint.x, checkpoint.y, 25);
      checkpointGraphic.endFill();
      this.addChild(checkpointGraphic);
    }

    // Create obstacles
    for (const obstacle of this.level.obstacles) {
      const obstacleGraphic = new PIXI.Graphics();
      obstacleGraphic.beginFill(0xff0000);
      obstacleGraphic.drawCircle(obstacle.x, obstacle.y, obstacle.radius);
      obstacleGraphic.endFill();
      this.addChild(obstacleGraphic);
    }
  }

  public launch(velocityX: number, velocityY: number): void {
    if (!this.launched) {
      this.playerVelocity = { x: velocityX, y: velocityY };
      this.launched = true;
    }
  }

  public update(deltaTime: number): void {
    if (!this.player || !this.launched || this.completed) return;

    // Apply physics
    this.playerVelocity = this.physicsSystem.applyGravity(this.playerVelocity, deltaTime);

    // Update position
    this.player.x += this.playerVelocity.x * deltaTime;
    this.player.y += this.playerVelocity.y * deltaTime;

    // Check collisions with platforms
    const playerPos = { x: this.player.x, y: this.player.y };
    for (const platform of this.level.platforms) {
      if (
        this.collisionSystem.checkCircleRect(
          playerPos,
          this.playerRadius,
          platform.x,
          platform.y,
          platform.width,
          platform.height
        )
      ) {
        this.playerVelocity = this.collisionSystem.resolvePlatformCollision(
          playerPos,
          this.playerVelocity,
          this.playerRadius,
          platform
        );
      }
    }

    // Check checkpoint collisions
    const checkpoint = this.checkpointSystem.checkCheckpoint(playerPos, this.playerRadius);
    if (checkpoint) {
      console.log('Checkpoint reached!');
    }

    // Check if reached end
    const distToEnd = Math.sqrt(
      Math.pow(this.player.x - this.level.end.x, 2) +
        Math.pow(this.player.y - this.level.end.y, 2)
    );
    if (distToEnd < this.playerRadius + 20) {
      this.completed = true;
      console.log('Level completed!');
    }

    // Update camera to follow player
    this.cameraSystem.update(playerPos, deltaTime);
    this.position.set(-this.cameraSystem.getPosition().x, -this.cameraSystem.getPosition().y);
  }

  public showTrajectory(startPos: Vector2D, velocity: Vector2D): void {
    this.trajectorySystem.calculate(startPos, velocity, this.level.gravity, this.level.platforms);
  }

  public hideTrajectory(): void {
    this.trajectorySystem.clear();
  }

  public reset(): void {
    if (this.player) {
      this.player.x = this.level.start.x;
      this.player.y = this.level.start.y;
    }
    this.playerVelocity = { x: 0, y: 0 };
    this.launched = false;
    this.completed = false;
    this.checkpointSystem.reset();
  }

  public isCompleted(): boolean {
    return this.completed;
  }

  public isLaunched(): boolean {
    return this.launched;
  }
}
