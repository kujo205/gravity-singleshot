import { Graphics, Container } from 'pixi.js';

export class BgGridPattern extends Container {
  constructor(
    private bgWidth: number,
    private bgHeight: number
  ) {
    super();
    this.createBackground();
  }

  private createBackground() {
    // Gradient background matching the space theme
    const bg = new Graphics();

    // Create vertical gradient from dark blue to darker slate
    bg.rect(0, 0, this.bgWidth, this.bgHeight);
    bg.fill({
      color: 0x0f172a, // Very dark slate
      alpha: 1
    });

    // Add subtle radial glow in the center
    const centerGlow = new Graphics();
    centerGlow.fill({ color: 0x1e3a8a, alpha: 0.2 }); // Dark blue glow

    this.addChild(bg);
    this.addChild(centerGlow);

    // Add decorative grid overlay (very subtle)
    const gridOverlay = new Graphics();
    gridOverlay.setStrokeStyle({ width: 1, color: 0x22d3ee, alpha: 0.03 });

    const gridSize = 50;
    for (let x = 0; x < this.bgWidth; x += gridSize) {
      gridOverlay.moveTo(x, 0).lineTo(x, this.bgHeight);
    }
    for (let y = 0; y < this.bgHeight; y += gridSize) {
      gridOverlay.moveTo(0, y).lineTo(this.bgWidth, y);
    }
    gridOverlay.stroke();
    this.addChild(gridOverlay);
  }
}
