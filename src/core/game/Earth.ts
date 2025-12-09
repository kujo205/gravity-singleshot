import { Gravitational } from './Gravitational.ts';
import { AnimatedSprite, Assets, Sprite, Spritesheet, Texture, Ticker } from 'pixi.js';
import type { Comet } from './Comet.ts';

import { GifSprite } from 'pixi.js/gif';

const earthConfig = {
  mass: 30,
  gravitationalZoneRadius: 30,
  radius: 30
};

export class Earth extends Gravitational {
  mass: number;
  gravitationalZoneRadius: number;
  radius: number;

  private sprite: GifSprite;

  constructor(x: number, y: number) {
    super(x, y, earthConfig.mass, earthConfig.radius, earthConfig.gravitationalZoneRadius, 'earth');

    this.mass = 40;
    this.gravitationalZoneRadius = 300;
    this.radius = 20;

    const source = Assets.get('earth');

    console.log('source', source);

    this.sprite = new GifSprite({
      source,
      autoPlay: true,
      loop: true,
      autoUpdate: false
    });

    // Manually update the sprite using the application's ticker
    globalThis.__PIXI_APP__.ticker.add(() => {
      this.sprite.update(globalThis.__PIXI_APP__.ticker);
    });

    console.log('sprite', this.sprite);

    // Set anchor and size for correct positioning and visibility
    this.sprite.anchor.set(0.5);
    this.sprite.width = this.radius * 2;
    this.sprite.height = this.radius * 2;

    this.addChild(this.sprite);

    this.x = x;
    this.y = y;
  }

  // NOTE: this is needed to stop pixi js removing assets
  override destroy(options?: any) {
    this.removeChild(this.sprite);
    this.sprite.stop();

    // Destroy container but skip the gif
    super.destroy({ ...options, children: false });
  }

  /**
   * Check if a comet has reached Earth (win condition)
   */
  isHit(comet: Comet): boolean {
    const dx = this.x - comet.x;
    const dy = this.y - comet.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < this.radius + comet.radius;
  }

  /**
   * Asynchronously creates and returns a new Earth instance after ensuring assets are loaded.
   */
  public static async create(x: number, y: number): Promise<Earth> {
    await Assets.load('earth');
    return new Earth(x, y);
  }
}
