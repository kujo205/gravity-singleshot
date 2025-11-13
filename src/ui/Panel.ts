import * as PIXI from 'pixi.js';

export interface PanelOptions {
  width?: number;
  height?: number;
  backgroundColor?: number;
  borderColor?: number;
  borderWidth?: number;
  cornerRadius?: number;
  padding?: number;
  alpha?: number;
}

export class Panel extends PIXI.Container {
  private background: PIXI.Graphics;
  private content: PIXI.Container;
  private options: Required<PanelOptions>;

  constructor(options: PanelOptions = {}) {
    super();

    this.options = {
      width: options.width ?? 300,
      height: options.height ?? 200,
      backgroundColor: options.backgroundColor ?? 0x2c3e50,
      borderColor: options.borderColor ?? 0x34495e,
      borderWidth: options.borderWidth ?? 2,
      cornerRadius: options.cornerRadius ?? 10,
      padding: options.padding ?? 20,
      alpha: options.alpha ?? 0.95,
    };

    this.background = new PIXI.Graphics();
    this.content = new PIXI.Container();

    this.drawBackground();
    this.content.position.set(this.options.padding, this.options.padding);

    this.addChild(this.background);
    this.addChild(this.content);

    this.alpha = this.options.alpha;
  }

  private drawBackground(): void {
    this.background.clear();

    // Draw border
    if (this.options.borderWidth > 0) {
      this.background.lineStyle(this.options.borderWidth, this.options.borderColor);
    }

    // Draw background
    this.background.beginFill(this.options.backgroundColor);
    this.background.drawRoundedRect(
      0,
      0,
      this.options.width,
      this.options.height,
      this.options.cornerRadius
    );
    this.background.endFill();
  }

  public addContent(child: PIXI.DisplayObject): void {
    this.content.addChild(child);
  }

  public removeContent(child: PIXI.DisplayObject): void {
    this.content.removeChild(child);
  }

  public clearContent(): void {
    this.content.removeChildren();
  }

  public getContentContainer(): PIXI.Container {
    return this.content;
  }

  public setSize(width: number, height: number): void {
    this.options.width = width;
    this.options.height = height;
    this.drawBackground();
  }

  public setBackgroundColor(color: number): void {
    this.options.backgroundColor = color;
    this.drawBackground();
  }
}
