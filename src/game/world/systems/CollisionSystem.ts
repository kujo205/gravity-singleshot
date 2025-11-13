import type { Platform, Vector2D } from '@types';

export class CollisionSystem {
  /**
   * Check collision between circle and rectangle
   */
  public checkCircleRect(
    circlePos: Vector2D,
    radius: number,
    rectX: number,
    rectY: number,
    rectWidth: number,
    rectHeight: number
  ): boolean {
    // Find the closest point on the rectangle to the circle
    const closestX = Math.max(rectX, Math.min(circlePos.x, rectX + rectWidth));
    const closestY = Math.max(rectY, Math.min(circlePos.y, rectY + rectHeight));

    // Calculate distance between circle center and closest point
    const distanceX = circlePos.x - closestX;
    const distanceY = circlePos.y - closestY;
    const distanceSquared = distanceX * distanceX + distanceY * distanceY;

    return distanceSquared < radius * radius;
  }

  /**
   * Check collision between two circles
   */
  public checkCircleCircle(
    pos1: Vector2D,
    radius1: number,
    pos2: Vector2D,
    radius2: number
  ): boolean {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    const distSquared = dx * dx + dy * dy;
    const radiiSum = radius1 + radius2;
    return distSquared < radiiSum * radiiSum;
  }

  /**
   * Resolve collision with a platform
   */
  public resolvePlatformCollision(
    position: Vector2D,
    velocity: Vector2D,
    _radius: number,
    platform: Platform
  ): Vector2D {
    const restitution = platform.type === 'bouncy' ? 1.2 : 0.6;

    // Find the closest point on the rectangle
    const closestX = Math.max(platform.x, Math.min(position.x, platform.x + platform.width));
    const closestY = Math.max(platform.y, Math.min(position.y, platform.y + platform.height));

    // Determine collision normal
    const dx = position.x - closestX;
    const dy = position.y - closestY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance === 0) return velocity;

    const normalX = dx / distance;
    const normalY = dy / distance;

    // Reflect velocity across normal with restitution
    const dotProduct = velocity.x * normalX + velocity.y * normalY;

    return {
      x: velocity.x - 2 * dotProduct * normalX * restitution,
      y: velocity.y - 2 * dotProduct * normalY * restitution,
    };
  }

  /**
   * Check if point is inside AABB
   */
  public pointInRect(
    point: Vector2D,
    x: number,
    y: number,
    width: number,
    height: number
  ): boolean {
    return point.x >= x && point.x <= x + width && point.y >= y && point.y <= y + height;
  }
}
