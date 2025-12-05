import { Scene } from './Scene.ts';
// import { Container, Text, TextStyle, FillGradient } from 'pixi.js';
// import { FancyButton } from '@pixi/ui';

export class RoundSelectionScene extends Scene {
  constructor() {
    super('RoundSelectionScene');
  }

  // private buildUI() {
  //   const { innerWidth: w, innerHeight: h } = window;
  //
  //   // === Gradient title fill ===
  //   const gradient = new FillGradient(0, 0, 0, 200); // x0, y0, x1, y1
  //   gradient.addColorStop(0, '#c084fc'); // top color
  //   gradient.addColorStop(1, '#7dd3fc'); // bottom color
  //
  //   // === Title ===
  //   const title = new Text({
  //     text: 'Gravity Singleshot',
  //     style: new TextStyle({
  //       fill: gradient,
  //       fontSize: 72,
  //       fontWeight: '900',
  //       dropShadow: true,
  //       dropShadowColor: '#000',
  //       dropShadowDistance: 6,
  //       dropShadowBlur: 8,
  //       fontFamily: 'Orbitron, Arial, sans-serif'
  //     })
  //   });
  //
  //   title.anchor.set(0.5);
  //   title.position.set(w / 2, h / 2 - 200);
  //   this.addChild(title);
  //
  //   // === Buttons container ===
  //   const buttonContainer = new Container();
  //   buttonContainer.x = w / 2;
  //   buttonContainer.y = h / 2 + 50;
  //   this.addChild(buttonContainer);
  //
  //   // === Buttons config ===
  //   const buttons = [
  //     { label: 'Start', route: '/rounds' },
  //     { label: 'About', route: '/about' },
  //     { label: 'Sandbox', route: '/sandbox' }
  //   ];
  //
  //   buttons.forEach((btn, i) => {
  //     const button = new FancyButton({
  //       defaultView: this.createButtonText(btn.label, '#ffffff'),
  //       hoverView: this.createButtonText(btn.label, '#a78bfa'),
  //       pressedView: this.createButtonText(btn.label, '#6d28d9'),
  //       anchor: 0.5
  //     });
  //
  //     button.y = i * 80;
  //     button.onPress.connect(() => navigateTo(btn.route));
  //
  //     this.buttons[btn.label] = button;
  //     buttonContainer.addChild(button);
  //   });
  //
  //   buttonContainer.pivot.y = (buttons.length * 80) / 2;
  // }
  //
  // private createButtonText(label: string, color: string) {
  //   const text = new Text({
  //     text: label,
  //     style: new TextStyle({
  //       fill: color,
  //       fontSize: 36,
  //       fontFamily: 'Orbitron, Arial, sans-serif',
  //       fontWeight: '600',
  //       dropShadow: true,
  //       dropShadowColor: '#000',
  //       dropShadowBlur: 4
  //     })
  //   });
  //   text.anchor.set(0.5);
  //   return text;
  // }
}
