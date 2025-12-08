import { GameObject } from './GameObject';

export class Gravitational extends GameObject {
  mass: number;
  radius: number;

  /**
   * radius of the gravitational zone
   */
  gravitationalZoneRadius: number;

  constructor(
    x: number,
    y: number,
    mass: number,
    radius: number,
    gravitationalZoneRadius: number,
    objectType: string
  ) {
    super(x, y, objectType);
    this.x = x;
    this.y = y;
    this.mass = mass;
    this.radius = radius;
    this.gravitationalZoneRadius = gravitationalZoneRadius;
  }
}
