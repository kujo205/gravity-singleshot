import { Application, Texture, ParticleContainer, Particle, Rectangle, Graphics } from 'pixi.js';

interface IStarParticle {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  anchorX: number;
  anchorY: number;
  rotation: number;
  color: number;
  texture: Texture;
}

interface Layer {
  container: ParticleContainer;
  particles: IStarParticle[];
  speed: number;
}

export class Starfield {
  private app: Application;
  private layers: Layer[] = [];
  private background: Graphics | null = null;

  constructor(app: Application, layerCount = 3, starsPerLayer = 400) {
    this.app = app;
    this.createBackground();
    this.createLayers(layerCount, starsPerLayer);
  }

  private createBackground() {
    const { screen } = this.app;
    this.background = new Graphics();

    // Tailwind colors: slate-950 = #020617, blue-950 = #172554
    const topColor = 0x020617; // from-slate-950
    const middleColor = 0x172554; // via-blue-950
    const bottomColor = 0x020617; // to-slate-950

    // Create gradient effect by drawing multiple horizontal rectangles
    const steps = 100;
    const heightPerStep = screen.height / steps;

    for (let i = 0; i < steps; i++) {
      const ratio = i / steps;
      let color: number;

      if (ratio < 0.5) {
        // Interpolate from top to middle
        const t = ratio * 2;
        color = this.interpolateColor(topColor, middleColor, t);
      } else {
        // Interpolate from middle to bottom
        const t = (ratio - 0.5) * 2;
        color = this.interpolateColor(middleColor, bottomColor, t);
      }

      this.background.rect(0, i * heightPerStep, screen.width, heightPerStep);
      this.background.fill(color);
    }

    this.app.stage.addChildAt(this.background, 0);
  }

  private interpolateColor(color1: number, color2: number, t: number): number {
    const r1 = (color1 >> 16) & 0xff;
    const g1 = (color1 >> 8) & 0xff;
    const b1 = color1 & 0xff;

    const r2 = (color2 >> 16) & 0xff;
    const g2 = (color2 >> 8) & 0xff;
    const b2 = color2 & 0xff;

    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);

    return (r << 16) | (g << 8) | b;
  }

  private createLayers(layerCount: number, starsPerLayer: number) {
    const { screen } = this.app;

    const speeds = Array.from({ length: layerCount }, (_, i) => 0.15 + i * 0.15);

    const starTexture = Texture.WHITE;

    for (let i = 0; i < layerCount; i++) {
      const container = new ParticleContainer({
        dynamicProperties: {
          position: true,
          scale: true,
          rotation: false,
          color: true // If you keep color static to optimize performance
        },
        // Optional additional settings:
        roundPixels: false
      });

      container.boundsArea = new Rectangle(0, 0, screen.width, screen.height);

      const particles: IStarParticle[] = [];

      for (let j = 0; j < starsPerLayer; j++) {
        const star: IStarParticle = {
          x: Math.random() * screen.width,
          y: Math.random() * screen.height,
          scaleX: Math.random() * 1.2 + 0.9,
          scaleY: Math.random() * 1.2 + 0.9,
          anchorX: 0.5,
          anchorY: 0.5,
          rotation: 0,
          color: 0xffffff - Math.floor(Math.random() * 0x000004),
          texture: starTexture
        };

        // Create a Particle object wrapping this data
        const p = new Particle({
          texture: starTexture,
          x: star.x,
          y: star.y,
          scaleX: star.scaleX,
          scaleY: star.scaleY,
          rotation: star.rotation,
          tint: star.color
        });
        // Note: if Particle class expects a specific constructor format, adapt accordingly
        container.addParticle(p);
        particles.push(star);
      }

      this.layers.push({ container, particles, speed: speeds[i] });
      this.app.stage.addChild(container);
    }
    this.app.ticker.add((delta) => this.update(delta.deltaTime));
  }

  private update(delta: number) {
    const width = this.app.screen.width;

    for (const layer of this.layers) {
      for (const star of layer.particles) {
        star.x -= layer.speed * delta;
        if (star.x < 0) star.x += width;

        // Twinkle via scale change
        star.scaleX += (Math.random() - 0.5) * 0.02;
        star.scaleY += (Math.random() - 0.5) * 0.02;

        star.scaleX = Math.min(Math.max(star.scaleX, 0.3), 1.5);
        star.scaleY = Math.min(Math.max(star.scaleY, 0.3), 1.5);
      }
      // Since scaleX/Y changes are static‐property updates (unless we set them dynamic), we should call update() on container
      layer.container.update();
    }
  }

  destroy() {
    if (this.background) {
      this.app.stage.removeChild(this.background);
      this.background.destroy();
      this.background = null;
    }
    for (const layer of this.layers) {
      this.app.stage.removeChild(layer.container);
      layer.container.destroy({ children: true });
    }
    this.layers = [];
  }
}
