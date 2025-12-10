import { Comet } from './Comet';
import { type Force } from './types.ts';
import { Gravitational } from './Gravitational.ts';
import { GameState } from './GameState.ts';
import { Diamond } from './Diamond.ts';

export class PhysicsEngine {
  // Tune this for gameplay feel
  static G: number = 100;

  /**
   * Calculate gravitational force between comet and a single planet.
   * Only applies gravity if comet is within the planet's gravitational zone.
   */
  static calculateGravityForce(comet: Comet, body: Gravitational, gameState: GameState): Force {
    const defaultForce = this.getDefaultForce();

    if (!body || !comet || !gameState.currentRound) {
      return defaultForce;
    }

    const dx = body.x - comet.x;
    const dy = body.y - comet.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // No gravity if comet is outside gravitational zone
    if (distance > body.gravitationalZoneRadius) {
      return defaultForce;
    }

    // Collision if distance is less than sum of both radii
    const collisionDistance = body.radius + comet.radius;

    if (distance < collisionDistance) {
      if (body.objectType === 'earth') {
        gameState.triggerEvent('win');
      } else {
        gameState.triggerEvent('loss');
      }
      return defaultForce;
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
    bodies: Gravitational[],
    gameState: GameState
  ): { forceX: number; forceY: number } {
    if (comet.isBeyondRoundBounds(gameState)) {
      gameState.triggerEvent('loss');
      return this.getDefaultForce();
    }

    this.checkRemoveInterceptingDiamonds(gameState, comet);

    let totalForceX = 0;
    let totalForceY = 0;

    for (const body of bodies) {
      const { forceX, forceY } = this.calculateGravityForce(comet, body, gameState);
      totalForceX += forceX;
      totalForceY += forceY;
    }

    return { forceX: totalForceX, forceY: totalForceY };
  }

  static checkRemoveInterceptingDiamonds(gameState: GameState, comet: Comet) {
    const diamonds = gameState.currentRound.roundGameObjects.filter(
      (item) => item instanceof Diamond
    );

    for (const diamond of diamonds) {
      if (!diamond.isCollected && diamond.interceptingWithComet(comet)) {
        diamond.collectDiamond();
        gameState.triggerEvent('diamondCollected', false);
      }
    }
  }

  static getDefaultForce() {
    return {
      forceX: 0,
      forceY: 0
    };
  }
}
