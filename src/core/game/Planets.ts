import { Graphics } from 'pixi.js';
import { GameObject } from './GameObject.ts';
import { type Gravitational } from './types.ts';

export type PlanetStyle = 'green' | 'blue' | 'red';

interface PlanetConfig {
  mass: number;
  radius: number;
  color: number;
  outlineColor: number;
  gravitationalZoneRadius: number;
  gravitationalZoneColor: number;
}

const PLANET_STYLES: Record<PlanetStyle, PlanetConfig> = {
  green: {
    mass: 200,
    radius: 15,
    color: 0x2ecc71,
    outlineColor: 0x27ae60,
    gravitationalZoneRadius: 80,
    gravitationalZoneColor: 0x2ecc71
  },
  blue: {
    mass: 500,
    radius: 20,
    color: 0x3498db,
    outlineColor: 0x2980b9,
    gravitationalZoneRadius: 140,
    gravitationalZoneColor: 0x3498db
  },
  red: {
    mass: 1000,
    radius: 30,
    color: 0xe74c3c,
    outlineColor: 0xc0392b,
    gravitationalZoneRadius: 220,
    gravitationalZoneColor: 0xe74c3c
  }
};

const HOVER_SCALE = 1.03;
const HOVER_BRIGHTNESS = 1.5;

export class Planet extends GameObject implements Gravitational {
  private graphics: Graphics;

  public mass: number;
  public radius: number;
  public color: number;
  public outlineColor: number;
  public gravitationalZoneRadius: number;
  public gravitationalZoneColor: number;

  private isHovered: boolean = false;

  constructor(initialX: number, initialY: number, style: PlanetStyle = 'medium') {
    super(initialX, initialY, 'planet');

    const config = PLANET_STYLES[style];
    this.mass = config.mass;
    this.radius = config.radius;
    this.color = config.color;
    this.outlineColor = config.outlineColor;
    this.gravitationalZoneRadius = config.gravitationalZoneRadius;
    this.gravitationalZoneColor = config.gravitationalZoneColor;

    this.graphics = new Graphics();
    this.draw();
    this.addChild(this.graphics);

    this.setupInteractivity();
  }

  private setupInteractivity() {
    this.eventMode = 'static';
    this.cursor = 'pointer';

    this.on('pointerenter', this.onPointerEnter, this);
    this.on('pointerleave', this.onPointerLeave, this);
  }

  private onPointerEnter() {
    this.isHovered = true;
    this.scale.set(HOVER_SCALE);
    this.alpha = HOVER_BRIGHTNESS;
  }

  private onPointerLeave() {
    this.isHovered = false;
    this.scale.set(1);
    this.alpha = 1;
  }

  private draw() {
    this.graphics.clear();

    // Gravitational zone (outer ring)
    this.graphics
      .circle(0, 0, this.gravitationalZoneRadius)
      .fill({ color: this.gravitationalZoneColor, alpha: 0.05 });

    // Gravitational zone border
    this.graphics
      .circle(0, 0, this.gravitationalZoneRadius)
      .stroke({ color: this.gravitationalZoneColor, alpha: 0.3, width: 2 });

    // Inner gravitational gradient ring
    this.graphics
      .circle(0, 0, this.gravitationalZoneRadius * 0.6)
      .fill({ color: this.gravitationalZoneColor, alpha: 0.08 });

    // Planet body
    this.graphics.circle(0, 0, this.radius).fill({ color: this.color });

    // Planet outline
    this.graphics.circle(0, 0, this.radius).stroke({ color: this.outlineColor, width: 3 });
  }

  /**
   * Check if a point is within gravitational zone
   */
  isInGravitationalZone(x: number, y: number): boolean {
    const dx = x - this.x;
    const dy = y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= this.gravitationalZoneRadius;
  }

  redraw() {
    this.draw();
  }

  /**
   * Clean up event listeners
   */
  destroy() {
    this.off('pointerenter', this.onPointerEnter, this);
    this.off('pointerleave', this.onPointerLeave, this);
    super.destroy();
  }
}
