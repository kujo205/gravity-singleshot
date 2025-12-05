import { Container, Graphics, Text, FillGradient } from 'pixi.js';
import { FancyButton } from '@pixi/ui';
import { audioManager } from '../game/AudioManager.ts';

export type ButtonStyle = 'primary' | 'secondary' | 'danger' | 'success';

interface ButtonStyleConfig {
  fillType: 'gradient' | 'solid';
  defaultColor: number | { start: number; end: number };
  hoverColor: number | { start: number; end: number };
  pressedColor: number | { start: number; end: number };
  borderColor: number;
  borderAlpha: number;
  textColor: number;
  glowColor: number;
  glowAlpha: number;
}

const BUTTON_STYLES: Record<ButtonStyle, ButtonStyleConfig> = {
  primary: {
    fillType: 'gradient',
    defaultColor: { start: 0x22d3ee, end: 0x3b82f6 }, // cyan to blue gradient
    hoverColor: { start: 0x22d3ee, end: 0x2563eb },
    pressedColor: { start: 0x0891b2, end: 0x1d4ed8 },
    borderColor: 0x22d3ee,
    borderAlpha: 0.6,
    textColor: 0xffffff,
    glowColor: 0x22d3ee,
    glowAlpha: 0.3
  },
  secondary: {
    fillType: 'solid',
    defaultColor: 0x1e293b, // dark slate with transparency
    hoverColor: 0x334155,
    pressedColor: 0x0f172a,
    borderColor: 0x475569,
    borderAlpha: 0.3,
    textColor: 0x94a3b8,
    glowColor: 0x22d3ee,
    glowAlpha: 0.2
  },
  danger: {
    fillType: 'gradient',
    defaultColor: { start: 0xef4444, end: 0xdc2626 },
    hoverColor: { start: 0xf87171, end: 0xef4444 },
    pressedColor: { start: 0xb91c1c, end: 0x991b1b },
    borderColor: 0xef4444,
    borderAlpha: 0.5,
    textColor: 0xffffff,
    glowColor: 0xef4444,
    glowAlpha: 0.3
  },
  success: {
    fillType: 'gradient',
    defaultColor: { start: 0xa78bfa, end: 0x8b5cf6 }, // purple gradient
    hoverColor: { start: 0xc4b5fd, end: 0xa78bfa },
    pressedColor: { start: 0x7c3aed, end: 0x6d28d9 },
    borderColor: 0xa78bfa,
    borderAlpha: 0.5,
    textColor: 0xffffff,
    glowColor: 0xa78bfa,
    glowAlpha: 0.3
  }
};

export class Button extends Container {
  public view: FancyButton;

  constructor(
    style: ButtonStyle,
    label: string = 'Button',
    width: number = 140,
    height: number = 50,
    radius: number = 8
  ) {
    super();

    const colors = BUTTON_STYLES[style];

    // Create text with space-themed styling
    const textObj = new Text({
      text: label,
      style: {
        fontFamily: 'Arial',
        fontSize: 16,
        fontWeight: '600',
        fill: colors.textColor,
        letterSpacing: 1.2 // Tracking for that space aesthetic
      }
    });

    // Initialize FancyButton
    this.view = new FancyButton({
      defaultView: this.createBg(colors, 'default', width, height, radius),
      hoverView: this.createBg(colors, 'hover', width, height, radius),
      pressedView: this.createBg(colors, 'pressed', width, height, radius),

      text: textObj,
      defaultTextAnchor: { x: 0.5, y: 0.5 },

      animations: {
        default: {
          props: { scale: { x: 1, y: 1 }, y: 0 },
          duration: 150
        },
        hover: {
          props: { scale: { x: 1.02, y: 1.02 }, y: -1 },
          duration: 150
        },
        pressed: {
          props: { scale: { x: 0.98, y: 0.98 }, y: 1 },
          duration: 100
        }
      }
    });

    this.view.anchor.set(0.5);
    this.view.x = width / 2;
    this.view.y = height / 2;

    this.addChild(this.view);
  }

  /**
   * Create background with space theme styling
   */
  private createBg(
    colors: ButtonStyleConfig,
    state: 'default' | 'hover' | 'pressed',
    w: number,
    h: number,
    r: number
  ): Graphics {
    const graphics = new Graphics();

    // Get color based on state
    let fillColor: number | { start: number; end: number };
    switch (state) {
      case 'hover':
        fillColor = colors.hoverColor;
        break;
      case 'pressed':
        fillColor = colors.pressedColor;
        break;
      default:
        fillColor = colors.defaultColor;
    }

    // Draw outer glow (for space aesthetic)
    if (state === 'hover' || state === 'default') {
      const glowPadding = 4;
      graphics
        .roundRect(-glowPadding, -glowPadding, w + glowPadding * 2, h + glowPadding * 2, r + 2)
        .fill({
          color: colors.glowColor,
          alpha: state === 'hover' ? colors.glowAlpha * 1.5 : colors.glowAlpha
        });
    }

    // Draw main button background
    if (colors.fillType === 'gradient' && typeof fillColor === 'object') {
      // Create gradient fill
      const gradient = new FillGradient(0, 0, 0, h);
      gradient.addColorStop(0, fillColor.start);
      gradient.addColorStop(1, fillColor.end);

      graphics.roundRect(0, 0, w, h, r).fill(gradient);
    } else {
      // Solid fill with slight transparency for secondary style
      const alpha = colors.fillType === 'solid' ? 0.5 : 1;
      graphics.roundRect(0, 0, w, h, r).fill({
        color: typeof fillColor === 'number' ? fillColor : fillColor.start,
        alpha
      });
    }

    // Draw border
    const borderWidth = state === 'hover' ? 2 : 1;
    const borderAlpha = state === 'hover' ? colors.borderAlpha * 1.3 : colors.borderAlpha;

    graphics.roundRect(0, 0, w, h, r).stroke({
      width: borderWidth,
      color: colors.borderColor,
      alpha: borderAlpha
    });

    // Add subtle inner highlight for depth (top edge)
    if (colors.fillType === 'gradient') {
      graphics.roundRect(1, 1, w - 2, h / 3, r - 1).fill({ color: 0xffffff, alpha: 0.1 });
    }

    return graphics;
  }

  public onClick(callback: () => void): void {
    this.view.onPress.connect(() => {
      audioManager.playSound('click');
      callback();
    });
  }
}
