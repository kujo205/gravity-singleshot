import { GameObject } from './GameObject.ts';
import { GifSprite } from 'pixi.js/gif';
import { Assets, Container, Graphics } from 'pixi.js';
import type { Comet } from './Comet.ts';

export class Diamond extends GameObject {
  static idCounter = 0;
  public id: number;
  public radius: number;
  private sprite!: GifSprite;
  private outerCircle!: Graphics;
  private collected!: boolean;
  private diamondInnerContainer: Container;

  public get isCollected() {
    return this.collected;
  }

  public interceptingWithComet(comet: Comet) {
    const dx = this.x - comet.x;
    const dy = this.y - comet.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < this.radius + comet.radius;
  }

  constructor(x: number, y: number) {
    super(x, y, 'diamond');
    this.id = ++Diamond.idCounter;
    this.radius = 10;

    this.diamondInnerContainer = new Container();
    this.addChild(this.diamondInnerContainer);

    this.buildUi();

    this.collected = false;
  }

  public collectDiamond() {
    this.collected = true;
    this.softDestroy();
  }

  private buildUi() {
    // Create outer circle
    this.outerCircle = new Graphics();
    this.outerCircle.circle(0, 0, this.radius + 6);
    this.outerCircle.stroke({ width: 3, color: 0x22d3ee, alpha: 0.8 });
    this.diamondInnerContainer.addChild(this.outerCircle);

    // Create inner glow circle
    const glowCircle = new Graphics();
    glowCircle.circle(0, 0, this.radius + 4);
    glowCircle.stroke({ width: 1, color: 0x22d3ee, alpha: 0.4 });
    this.diamondInnerContainer.addChild(glowCircle);

    // Create sprite
    const source = Assets.get('diamond');
    this.sprite = new GifSprite({
      source,
      autoPlay: true,
      loop: true,
      autoUpdate: false
    });

    globalThis.__PIXI_APP__.ticker.add(() => {
      this?.sprite.update(globalThis.__PIXI_APP__.ticker);

      // Add pulsing animation to outer circle
      if (this?.outerCircle) {
        const time = Date.now() * 0.002;
        const scale = 1 + Math.sin(time) * 0.1;
        this.outerCircle.scale.set(scale);
        this.outerCircle.alpha = 0.6 + Math.sin(time) * 0.2;
      }
    });

    this.sprite.anchor.set(0.5);
    this.sprite.width = this.radius * 2;
    this.sprite.height = this.radius * 2;
    this.diamondInnerContainer.addChild(this.sprite);
  }

  override destroy(options?: any) {
    this.removeChild(this?.sprite);
    this?.sprite.stop();
    if (this?.outerCircle) {
      this.removeChild(this.outerCircle);
    }
    super.destroy({ ...options, children: false });
  }

  softDestroy() {
    if (this.sprite) {
      this.removeChild(this.sprite);
      this.sprite.stop();
    }
    if (this.outerCircle) {
      this.removeChild(this.outerCircle);
    }
    this.diamondInnerContainer.destroy();
  }
}
