import { Graphics } from 'pixi.js';
import { GameObject } from './GameObject.ts';
import { Gravitational } from './Gravitational.ts';

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
    mass: 2000,
    radius: 30,
    color: 0xe74c3c,
    outlineColor: 0xc0392b,
    gravitationalZoneRadius: 220,
    gravitationalZoneColor: 0xe74c3c
  }
};

const HOVER_SCALE = 1.03;
const HOVER_BRIGHTNESS = 1.5;

export class Planet extends Gravitational {
  private graphics: Graphics;

  public mass: number;
  public radius: number;
  public color: number;
  public outlineColor: number;
  public gravitationalZoneRadius: number;
  public gravitationalZoneColor: number;
  public config: PlanetConfig;

  private isHovered: boolean = false;

  constructor(initialX: number, initialY: number, style: PlanetStyle = 'green') {
    const config = PLANET_STYLES[style];

    super(initialX, initialY, config.mass, config.radius, config.gravitationalZoneRadius, 'planet');

    this.config = config;

    this.mass = config.mass;
    this.radius = config.radius;
    this.color = config.color;
    this.outlineColor = config.outlineColor;
    this.gravitationalZoneRadius = config.gravitationalZoneRadius;
    this.gravitationalZoneColor = config.gravitationalZoneColor;

    this.graphics = new PlanetGraphics({
      gravitationalZoneColor: this.config.gravitationalZoneColor,
      gravitationalZoneRadius: this.config.gravitationalZoneRadius,
      outlineColor: this.config.outlineColor,
      planetColor: this.config.color,
      planetRadius: this.config.radius
    });

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

  /**
   * Clean up event listeners
   */
  destroy() {
    this.off('pointerenter', this.onPointerEnter, this);
    this.off('pointerleave', this.onPointerLeave, this);
    super.destroy();
  }
}

class PlanetGraphics extends Graphics {
  constructor(
    private config: {
      gravitationalZoneColor: number;
      gravitationalZoneRadius: number;
      outlineColor: number;
      planetColor: number;
      planetRadius: number;
    }
  ) {
    super();

    this.clear();

    // Gravitational zone (outer ring)
    this.circle(0, 0, this.config.gravitationalZoneRadius).fill({
      color: this.config.gravitationalZoneColor,
      alpha: 0.05
    });

    // Gravitational zone border
    this.circle(0, 0, this.config.gravitationalZoneRadius).stroke({
      color: this.config.gravitationalZoneColor,
      alpha: 0.3,
      width: 2
    });

    // Inner gravitational gradient ring
    this.circle(0, 0, this.config.gravitationalZoneRadius * 0.6).fill({
      color: this.config.gravitationalZoneColor,
      alpha: 0.08
    });

    // Planet body
    this.circle(0, 0, this.config.planetRadius).fill({ color: this.config.planetColor });

    // Planet outline
    this.circle(0, 0, this.config.planetRadius).stroke({
      color: this.config.outlineColor,
      width: 3
    });
  }
}
