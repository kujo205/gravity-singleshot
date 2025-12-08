import { Graphics } from 'pixi.js';
import { GameObject } from './GameObject.ts';
import { Gravitational } from './Gravitational.ts';
import { PhysicsEngine } from './PhysicalEngine.ts';

const COMET_CONFIG = {
  radius: 12,
  color: 0xf39c12,
  outlineColor: 0xe67e22,
  tailColor: 0xf39c12,

  // Trajectory line
  trajectoryColor: 0xffffff,
  trajectoryLength: 300,
  trajectoryDashLength: 8,
  trajectoryGapLength: 3,

  // Force indicator
  minForce: 50,
  maxForce: 400,
  forceIndicatorColor: 0xe74c3c,
  forceMultiplier: 4
};

export class Comet extends GameObject {
  private graphics: Graphics;
  private trajectoryGraphics: Graphics;

  velocityX: number = 0;
  velocityY: number = 0;
  mass: number = 1;
  isLaunched: boolean = false;
  isActive: boolean = true;

  // Aiming state
  private isAiming: boolean = false;
  private aimAngle: number = 0;
  private aimForce: number = 0;

  constructor(initialX: number, initialY: number) {
    super(initialX, initialY, 'comet');

    this.graphics = new Graphics();
    this.trajectoryGraphics = new Graphics();

    this.addChild(this.trajectoryGraphics);
    this.addChild(this.graphics);

    this.drawComet();
    this.setupInteractivity();
  }

  private setupInteractivity() {
    this.eventMode = 'static';
    this.cursor = 'pointer';

    this.hitArea = {
      contains: (x: number, y: number) => {
        return Math.sqrt(x * x + y * y) <= COMET_CONFIG.radius * 2;
      }
    };

    this.on('pointerdown', this.onPointerDown, this);
    this.on('globalpointermove', this.onPointerMove, this);
    this.on('pointerup', this.onPointerUp, this);
    this.on('pointerupoutside', this.onPointerUp, this);
  }

  private onPointerDown(event: PointerEvent) {
    if (this.isLaunched) return;
    this.isAiming = true;
  }

  private onPointerMove(event: PointerEvent) {
    if (!this.isAiming || this.isLaunched) return;

    const globalPos = event.global;

    const dx = globalPos.x - this.x;
    const dy = globalPos.y - this.y;

    this.aimAngle = Math.atan2(-dy, -dx);

    // Apply multiplier so less drag = more force
    const distance = Math.sqrt(dx * dx + dy * dy);
    const rawForce = distance * COMET_CONFIG.forceMultiplier;

    this.aimForce = Math.min(rawForce, COMET_CONFIG.maxForce);
    this.aimForce = Math.max(this.aimForce, 0);

    this.drawTrajectory();
  }

  private onPointerUp() {
    if (!this.isAiming || this.isLaunched) return;

    this.isAiming = false;

    if (this.aimForce >= COMET_CONFIG.minForce) {
      const velocityX = Math.cos(this.aimAngle) * this.aimForce;
      const velocityY = Math.sin(this.aimAngle) * this.aimForce;

      this.launch(velocityX, velocityY);
    }

    this.clearTrajectory();
  }

  private drawComet() {
    this.graphics.clear();

    this.graphics
      .circle(0, 0, COMET_CONFIG.radius * 1.5)
      .fill({ color: COMET_CONFIG.color, alpha: 0.2 });

    this.graphics.circle(0, 0, COMET_CONFIG.radius).fill({ color: COMET_CONFIG.color });

    this.graphics
      .circle(0, 0, COMET_CONFIG.radius)
      .stroke({ color: COMET_CONFIG.outlineColor, width: 2 });
  }

  private drawTrajectory() {
    this.trajectoryGraphics.clear();

    if (this.aimForce < COMET_CONFIG.minForce) return;

    const dirX = Math.cos(this.aimAngle);
    const dirY = Math.sin(this.aimAngle);

    const trajectoryLength = COMET_CONFIG.trajectoryLength;

    // Draw dashed line
    let currentLength = COMET_CONFIG.radius + 5;
    let isDash = true;

    while (currentLength < trajectoryLength) {
      const segmentLength = isDash
        ? COMET_CONFIG.trajectoryDashLength
        : COMET_CONFIG.trajectoryGapLength;

      if (isDash) {
        const startX = dirX * currentLength;
        const startY = dirY * currentLength;
        const endX = dirX * Math.min(currentLength + segmentLength, trajectoryLength);
        const endY = dirY * Math.min(currentLength + segmentLength, trajectoryLength);

        const alpha = 1 - (currentLength / trajectoryLength) * 0.8;

        this.trajectoryGraphics
          .moveTo(startX, startY)
          .lineTo(endX, endY)
          .stroke({ color: COMET_CONFIG.trajectoryColor, width: 3, alpha });
      }

      currentLength += segmentLength;
      isDash = !isDash;
    }

    // Draw arrow head
    const arrowSize = 12;
    const arrowX = dirX * trajectoryLength;
    const arrowY = dirY * trajectoryLength;

    this.trajectoryGraphics
      .moveTo(arrowX, arrowY)
      .lineTo(
        arrowX - Math.cos(this.aimAngle - 0.4) * arrowSize,
        arrowY - Math.sin(this.aimAngle - 0.4) * arrowSize
      )
      .moveTo(arrowX, arrowY)
      .lineTo(
        arrowX - Math.cos(this.aimAngle + 0.4) * arrowSize,
        arrowY - Math.sin(this.aimAngle + 0.4) * arrowSize
      )
      .stroke({ color: COMET_CONFIG.trajectoryColor, width: 3, alpha: 0.6 });

    this.drawForceIndicator();
  }

  private drawForceIndicator() {
    const barWidth = 50;
    const barHeight = 8;
    const barX = -barWidth / 2;
    const barY = COMET_CONFIG.radius + 20;

    // Calculate percentage based on distance dragged
    const forcePercentage = Math.min(
      (this.aimForce - COMET_CONFIG.minForce) / (COMET_CONFIG.maxForce - COMET_CONFIG.minForce),
      1
    );

    // Background bar
    this.trajectoryGraphics
      .roundRect(barX, barY, barWidth, barHeight, 4)
      .fill({ color: 0x333333, alpha: 0.8 });

    // Force fill (only show if above minimum)
    if (forcePercentage > 0) {
      this.trajectoryGraphics
        .roundRect(barX, barY, barWidth * forcePercentage, barHeight, 4)
        .fill({ color: COMET_CONFIG.forceIndicatorColor });
    }
  }

  private clearTrajectory() {
    this.trajectoryGraphics.clear();
  }

  get currentAimAngle(): number {
    return (this.aimAngle * 180) / Math.PI;
  }

  get currentAimForce(): number {
    return this.aimForce;
  }

  launch(velocityX: number, velocityY: number) {
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.isLaunched = true;
    this.cursor = 'default';
  }

  update(deltaTime: number, bodies: GameObject[]) {
    if (!this.isLaunched) return;

    const gravitationalBodies = bodies.filter((body) => body instanceof Gravitational);

    const { forceX, forceY } = PhysicsEngine.calculateTotalForce(this, gravitationalBodies);

    const delta = deltaTime / 30;
    const velocityMultiplier = deltaTime / 3;

    // Apply force to velocity (F = ma, assuming mass = 1)
    this.velocityX += forceX * velocityMultiplier;
    this.velocityY += forceY * velocityMultiplier;

    // Update position
    this.x += this.velocityX * delta;
    this.y += this.velocityY * delta;
  }

  reset() {
    this.x = this.initialX;
    this.y = this.initialY;
    this.velocityX = 0;
    this.velocityY = 0;
    this.isLaunched = false;
    this.isActive = true;
    this.isAiming = false;
    this.aimAngle = 0;
    this.aimForce = 0;
    this.cursor = 'pointer';
    this.clearTrajectory();
  }

  destroy() {
    this.off('pointerdown', this.onPointerDown, this);
    this.off('globalpointermove', this.onPointerMove, this);
    this.off('pointerup', this.onPointerUp, this);
    this.off('pointerupoutside', this.onPointerUp, this);
    super.destroy();
  }
}
