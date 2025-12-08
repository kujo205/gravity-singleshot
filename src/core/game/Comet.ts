import { GameObject } from './GameObject.ts';

export class Comet extends GameObject {
  /**
   * Velocity in X direction (pixels per second)
   */
  velocityX: number = 0;

  /**
   * Velocity in Y direction (pixels per second)
   */
  velocityY: number = 0;

  /**
   * Mass of the comet (affects gravitational interactions)
   */
  mass: number = 1;

  /**
   * Whether the comet has been launched
   */
  isLaunched: boolean = false;

  /**
   * Whether the comet is still active (not destroyed/off-screen)
   */
  isActive: boolean = true;

  constructor(initialX: number, initialY: number) {
    super(initialX, initialY, 'comet');
    this.x = initialX;
    this.y = initialY;
  }

  /**
   * Launch the comet with initial velocity
   */
  launch(velocityX: number, velocityY: number) {
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.isLaunched = true;
  }

  /**
   * Apply a force to the comet (from gravity, etc.)
   */
  applyForce(forceX: number, forceY: number, deltaTime: number) {
    // a = F / m
    this.velocityX += (forceX / this.mass) * deltaTime;
    this.velocityY += (forceY / this.mass) * deltaTime;
  }

  /**
   * Update position based on current velocity
   */
  update(deltaTime: number) {
    if (!this.isLaunched || !this.isActive) return;

    this.x += this.velocityX * deltaTime;
    this.y += this.velocityY * deltaTime;
  }

  /**
   * Reset comet to initial position
   */
  reset() {
    this.x = this.initialX;
    this.y = this.initialY;
    this.velocityX = 0;
    this.velocityY = 0;
    this.isLaunched = false;
    this.isActive = true;
  }
}
