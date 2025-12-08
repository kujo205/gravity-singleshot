import { Comet } from './Comet';
import { Planet } from './Planets.ts';
import { Gravitational, Force } from './types.ts';

export class PhysicsEngine {
  // Tune this for gameplay feel
  static G: number = 100;

  /**
   * Calculate gravitational force between comet and a single planet
   */
  static calculateGravityForce(comet: Comet, body: Gravitational): Force {
    const dx = body.x - comet.x;
    const dy = body.y - comet.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < body.radius) {
      return { forceX: 0, forceY: 0 };
    }

    const forceMagnitude = (this.G * body.mass) / (distance * distance);

    return {
      forceX: (dx / distance) * forceMagnitude,
      forceY: (dy / distance) * forceMagnitude
    };
  }

  /**
   * Sum forces from ALL planets
   */
  static calculateTotalForce(
    comet: Comet,
    bodies: Gravitational[]
  ): { forceX: number; forceY: number } {
    let totalForceX = 0;
    let totalForceY = 0;

    for (const body of bodies) {
      const { forceX, forceY } = this.calculateGravityForce(comet, body);
      totalForceX += forceX;
      totalForceY += forceY;
    }

    return { forceX: totalForceX, forceY: totalForceY };
  }
}
