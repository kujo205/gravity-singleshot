import type { Vector2D, Platform } from '@types';

export class TrajectoryPreviewSystem {
  private points: Vector2D[] = [];
  private maxPoints = 100;
  private timeStep = 0.05;

  /**
   * Calculate trajectory preview points
   */
  public calculate(
    startPos: Vector2D,
    velocity: Vector2D,
    gravity: Vector2D,
    platforms: Platform[]
  ): Vector2D[] {
    this.points = [];
    let pos = { ...startPos };
    let vel = { ...velocity };

    for (let i = 0; i < this.maxPoints; i++) {
      // Apply gravity
      vel.x += gravity.x * this.timeStep;
      vel.y += gravity.y * this.timeStep;

      // Update position
      pos.x += vel.x * this.timeStep;
      pos.y += vel.y * this.timeStep;

      this.points.push({ ...pos });

      // Check for platform collisions (simplified)
      let hitPlatform = false;
      for (const platform of platforms) {
        if (
          pos.x >= platform.x &&
          pos.x <= platform.x + platform.width &&
          pos.y >= platform.y &&
          pos.y <= platform.y + platform.height
        ) {
          hitPlatform = true;
          break;
        }
      }

      if (hitPlatform) break;

      // Stop if trajectory goes too far off screen
      if (Math.abs(pos.x) > 10000 || Math.abs(pos.y) > 10000) break;
    }

    return this.points;
  }

  /**
   * Get trajectory points
   */
  public getPoints(): Vector2D[] {
    return this.points;
  }

  /**
   * Clear trajectory
   */
  public clear(): void {
    this.points = [];
  }
}
