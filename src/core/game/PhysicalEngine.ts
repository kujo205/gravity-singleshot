import { Comet } from './Comet';
import { type Force } from './types.ts';
import { Gravitational } from './Gravitational.ts';
import { gameState } from './GameState.ts';

export class PhysicsEngine {
  // Tune this for gameplay feel
  static G: number = 100;

  /**
   * Calculate gravitational force between comet and a single planet.
   * Only applies gravity if comet is within the planet's gravitational zone.
   */
  static calculateGravityForce(comet: Comet, body: Gravitational): Force {
    if (this.isGameOver || !body || !comet) {
      return { forceX: 0, forceY: 0 };
    }

    const dx = body.x - comet.x;
    const dy = body.y - comet.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Collision if distance is less than sum of both radii
    const collisionDistance = body.radius + comet.radius;

    if (distance < collisionDistance) {
      if (body.objectType === 'earth') {
        gameState.triggerEvent('win');
      } else {
        gameState.triggerEvent('loss');
      }
      gameState.triggerEvent('gameOver', true);
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
