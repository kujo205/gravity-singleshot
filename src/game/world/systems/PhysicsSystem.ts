import type { Vector2D } from '@types';

export class PhysicsSystem {
  private gravity: Vector2D;

  constructor(gravity: Vector2D = { x: 0, y: 9.8 }) {
    this.gravity = gravity;
  }

  public applyGravity(velocity: Vector2D, deltaTime: number): Vector2D {
    return {
      x: velocity.x + this.gravity.x * deltaTime,
      y: velocity.y + this.gravity.y * deltaTime,
    };
  }

  public applyDamping(velocity: Vector2D, damping: number): Vector2D {
    return {
      x: velocity.x * damping,
      y: velocity.y * damping,
    };
  }

  public setGravity(gravity: Vector2D): void {
    this.gravity = gravity;
  }

  public getGravity(): Vector2D {
    return { ...this.gravity };
  }
}
