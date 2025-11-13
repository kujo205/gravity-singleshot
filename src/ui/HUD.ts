import * as PIXI from 'pixi.js';

export class HUD extends PIXI.Container {
  private shotsText: PIXI.Text;
  private parText: PIXI.Text;
  private levelText: PIXI.Text;
  private background: PIXI.Graphics;

  private shots = 0;
  private par = 0;
  private levelName = '';

  constructor() {
    super();

    this.background = new PIXI.Graphics();
    this.background.beginFill(0x000000, 0.5);
    this.background.drawRect(0, 0, 400, 80);
    this.background.endFill();

    this.levelText = new PIXI.Text('', {
      fontSize: 24,
      fill: 0xffffff,
      fontFamily: 'Arial',
      fontWeight: 'bold',
    });
    this.levelText.position.set(20, 10);

    this.shotsText = new PIXI.Text('', {
      fontSize: 20,
      fill: 0xffffff,
      fontFamily: 'Arial',
    });
    this.shotsText.position.set(20, 45);

    this.parText = new PIXI.Text('', {
      fontSize: 20,
      fill: 0xffff00,
      fontFamily: 'Arial',
    });
    this.parText.position.set(150, 45);

    this.addChild(this.background);
    this.addChild(this.levelText);
    this.addChild(this.shotsText);
    this.addChild(this.parText);

    this.updateDisplay();
  }

  private updateDisplay(): void {
    this.levelText.text = this.levelName;
    this.shotsText.text = `Shots: ${this.shots}`;
    this.parText.text = `Par: ${this.par}`;

    // Color code shots based on par
    if (this.shots <= this.par) {
      this.shotsText.style.fill = 0x00ff00; // Green
    } else if (this.shots <= this.par + 2) {
      this.shotsText.style.fill = 0xffaa00; // Orange
    } else {
      this.shotsText.style.fill = 0xff0000; // Red
    }
  }

  public setLevel(name: string): void {
    this.levelName = name;
    this.updateDisplay();
  }

  public setPar(par: number): void {
    this.par = par;
    this.updateDisplay();
  }

  public setShots(shots: number): void {
    this.shots = shots;
    this.updateDisplay();
  }

  public incrementShots(): void {
    this.shots++;
    this.updateDisplay();
  }

  public reset(): void {
    this.shots = 0;
    this.updateDisplay();
  }

  public getShots(): number {
    return this.shots;
  }

  public resize(screenWidth: number): void {
    this.position.set((screenWidth - 400) / 2, 10);
  }
}
