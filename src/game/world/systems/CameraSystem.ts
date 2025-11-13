import type { Vector2D } from '@types';

export class CameraSystem {
  private position: Vector2D = { x: 0, y: 0 };
  private target: Vector2D = { x: 0, y: 0 };
  private screenWidth: number;
  private screenHeight: number;
  private smoothing = 0.1;

  constructor(screenWidth: number, screenHeight: number) {
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
  }

  /**
   * Update camera to follow target
   */
  public update(target: Vector2D, _deltaTime: number): void {
    // Center target on screen
    this.target.x = target.x - this.screenWidth / 2;
    this.target.y = target.y - this.screenHeight / 2;

    // Smooth camera movement
    this.position.x += (this.target.x - this.position.x) * this.smoothing;
    this.position.y += (this.target.y - this.position.y) * this.smoothing;
  }

  /**
   * Set camera position directly
   */
  public setPosition(x: number, y: number): void {
    this.position.x = x;
    this.position.y = y;
    this.target.x = x;
    this.target.y = y;
  }

  /**
   * Get camera position
   */
  public getPosition(): Vector2D {
    return { ...this.position };
  }

  /**
   * Set smoothing factor (0 = instant, 1 = no movement)
   */
  public setSmoothing(smoothing: number): void {
    this.smoothing = Math.max(0, Math.min(1, smoothing));
  }

  /**
   * Update screen dimensions
   */
  public resize(width: number, height: number): void {
    this.screenWidth = width;
    this.screenHeight = height;
  }
}
