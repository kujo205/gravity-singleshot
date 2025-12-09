import { Gravitational } from './Gravitational.ts';
import { Assets, Graphics } from 'pixi.js';
import type { Comet } from './Comet.ts';
import { GifSprite } from 'pixi.js/gif';

const earthConfig = {
  mass: 300,
  gravitationalZoneRadius: 120,
  radius: 20,
  gravitationalZoneColor: 0x3498db // Blue color for Earth's zone
};

export class Earth extends Gravitational {
  mass: number;
  gravitationalZoneRadius: number;
  radius: number;

  private sprite: GifSprite;
  private graphics: Graphics;

  constructor(x: number, y: number) {
    super(x, y, earthConfig.mass, earthConfig.radius, earthConfig.gravitationalZoneRadius, 'earth');

    this.mass = 40;
    this.gravitationalZoneRadius = 300;
    this.radius = 20;

    // Draw gravitational zone outline
    this.graphics = new Graphics();
    this.drawGravitationalZone();
    this.addChild(this.graphics);

    const source = Assets.get('earth');

    this.sprite = new GifSprite({
      source,
      autoPlay: true,
      loop: true,
      autoUpdate: false
    });

    globalThis.__PIXI_APP__.ticker.add(() => {
      this.sprite.update(globalThis.__PIXI_APP__.ticker);
    });

    this.sprite.anchor.set(0.5);
    this.sprite.width = this.radius * 2;
    this.sprite.height = this.radius * 2;

    this.addChild(this.sprite);

    this.x = x;
    this.y = y;
  }

  private drawGravitationalZone() {
    this.graphics.clear();

    // Gravitational zone fill
    this.graphics
      .circle(0, 0, this.gravitationalZoneRadius)
      .fill({ color: earthConfig.gravitationalZoneColor, alpha: 0.05 });

    // Gravitational zone border
    this.graphics
      .circle(0, 0, this.gravitationalZoneRadius)
      .stroke({ color: earthConfig.gravitationalZoneColor, alpha: 0.3, width: 2 });

    // Inner gravitational gradient ring
    this.graphics
      .circle(0, 0, this.gravitationalZoneRadius * 0.6)
      .fill({ color: earthConfig.gravitationalZoneColor, alpha: 0.08 });
  }

  override destroy(options?: any) {
    this.removeChild(this.sprite);
    this.sprite.stop();
    super.destroy({ ...options, children: false });
  }

  isHit(comet: Comet): boolean {
    const dx = this.x - comet.x;
    const dy = this.y - comet.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < this.radius + comet.radius;
  }
}
