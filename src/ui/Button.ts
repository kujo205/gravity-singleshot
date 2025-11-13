import * as PIXI from 'pixi.js';

export interface ButtonOptions {
  text: string;
  width?: number;
  height?: number;
  backgroundColor?: number;
  textColor?: number;
  fontSize?: number;
  cornerRadius?: number;
}

export class Button extends PIXI.Container {
  private background: PIXI.Graphics;
  private label: PIXI.Text;
  private options: Required<ButtonOptions>;
  private isHovered = false;
  private isPressed = false;

  public onClick: (() => void) | null = null;

  constructor(options: ButtonOptions) {
    super();

    this.options = {
      text: options.text,
      width: options.width ?? 200,
      height: options.height ?? 60,
      backgroundColor: options.backgroundColor ?? 0x4a90e2,
      textColor: options.textColor ?? 0xffffff,
      fontSize: options.fontSize ?? 24,
      cornerRadius: options.cornerRadius ?? 8,
    };

    this.background = new PIXI.Graphics();
    this.label = new PIXI.Text(this.options.text, {
      fontSize: this.options.fontSize,
      fill: this.options.textColor,
      fontFamily: 'Arial',
      fontWeight: 'bold',
    });

    this.setupGraphics();
    this.setupInteractivity();

    this.addChild(this.background);
    this.addChild(this.label);
  }

  private setupGraphics(): void {
    this.drawBackground(this.options.backgroundColor);

    this.label.anchor.set(0.5);
    this.label.position.set(this.options.width / 2, this.options.height / 2);
  }

  private drawBackground(color: number): void {
    this.background.clear();
    this.background.beginFill(color);
    this.background.drawRoundedRect(0, 0, this.options.width, this.options.height, this.options.cornerRadius);
    this.background.endFill();
  }

  private setupInteractivity(): void {
    this.eventMode = 'static';
    this.cursor = 'pointer';

    this.on('pointerover', this.onPointerOver);
    this.on('pointerout', this.onPointerOut);
    this.on('pointerdown', this.onPointerDown);
    this.on('pointerup', this.onPointerUp);
  }

  private onPointerOver = (): void => {
    this.isHovered = true;
    this.drawBackground(this.lightenColor(this.options.backgroundColor, 0.2));
  };

  private onPointerOut = (): void => {
    this.isHovered = false;
    this.isPressed = false;
    this.drawBackground(this.options.backgroundColor);
  };

  private onPointerDown = (): void => {
    this.isPressed = true;
    this.drawBackground(this.darkenColor(this.options.backgroundColor, 0.2));
  };

  private onPointerUp = (): void => {
    if (this.isPressed && this.isHovered) {
      this.onClick?.();
    }
    this.isPressed = false;
    this.drawBackground(
      this.isHovered ? this.lightenColor(this.options.backgroundColor, 0.2) : this.options.backgroundColor
    );
  };

  private lightenColor(color: number, amount: number): number {
    const r = Math.min(255, ((color >> 16) & 0xff) + amount * 255);
    const g = Math.min(255, ((color >> 8) & 0xff) + amount * 255);
    const b = Math.min(255, (color & 0xff) + amount * 255);
    return (r << 16) | (g << 8) | b;
  }

  private darkenColor(color: number, amount: number): number {
    const r = Math.max(0, ((color >> 16) & 0xff) - amount * 255);
    const g = Math.max(0, ((color >> 8) & 0xff) - amount * 255);
    const b = Math.max(0, (color & 0xff) - amount * 255);
    return (r << 16) | (g << 8) | b;
  }

  public setText(text: string): void {
    this.label.text = text;
  }

  public setEnabled(enabled: boolean): void {
    this.eventMode = enabled ? 'static' : 'none';
    this.alpha = enabled ? 1 : 0.5;
    this.cursor = enabled ? 'pointer' : 'default';
  }
}
