import { Application, Texture, ParticleContainer, Particle, Rectangle } from 'pixi.js';

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

  constructor(app: Application, layerCount = 3, starsPerLayer = 400) {
    this.app = app;
    this.createLayers(layerCount, starsPerLayer);
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
          scaleX: Math.random() * 1.2 + 0.3,
          scaleY: Math.random() * 1.2 + 0.3,
          anchorX: 0.5,
          anchorY: 0.5,
          rotation: 0,
          color: 0xffffff - Math.floor(Math.random() * 0x003333),
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
    for (const layer of this.layers) {
      this.app.stage.removeChild(layer.container);
      layer.container.destroy({ children: true });
    }
    this.layers = [];
  }
}
