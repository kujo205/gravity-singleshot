import { Scene } from './Scene.ts';
import { Application, Container, Graphics, Text } from 'pixi.js';
import { Button } from '../ui/Button.ts';
import { emitSceneChange } from '$lib/sceneChange.ts';
import { BgGridPattern } from '../ui/BgGridPattern.ts';
import { colors } from '../config/colors.ts';

interface RoundData {
  roundNumber: number;
  diamondsCollected: number;
  totalDiamonds: number;
  state: RoundCardState;
}

/**
 * TODO:
 * I want to be able to allow users to:
 * - allow to participate in all rounds
 * - allow to replay rounds any number of times
 * - if round has all the stars collected - it is completed
 *
 * so basically 2 states: completed and unlocked
 * */

const rounds = [
  {
    roundNumber: 1,
    diamondsCollected: 3,
    totalDiamonds: 3,
    state: 'completed'
  },
  {
    roundNumber: 2,
    diamondsCollected: 3,
    totalDiamonds: 4,
    state: 'unlocked'
  },
  {
    roundNumber: 3,
    diamondsCollected: 1,
    totalDiamonds: 8,
    state: 'unlocked'
  },
  {
    roundNumber: 4,
    diamondsCollected: 0,
    totalDiamonds: 10,
    state: 'locked'
  },
  {
    roundNumber: 5,
    diamondsCollected: 0,
    totalDiamonds: 10,
    state: 'locked'
  },
  {
    roundNumber: 6,
    diamondsCollected: 0,
    totalDiamonds: 10,
    state: 'locked'
  },
  {
    roundNumber: 7,
    diamondsCollected: 0,
    totalDiamonds: 10,
    state: 'locked'
  },
  {
    roundNumber: 8,
    diamondsCollected: 0,
    totalDiamonds: 10,
    state: 'locked'
  },
  {
    roundNumber: 9,
    diamondsCollected: 0,
    totalDiamonds: 10,
    state: 'locked'
  },
  {
    roundNumber: 10,
    diamondsCollected: 0,
    totalDiamonds: 10,
    state: 'locked'
  }
] satisfies RoundData[];

type RoundCardState = 'unlocked' | 'completed' | 'locked';

interface RoundCardData {
  roundNumber: number;
  diamondsCollected: number;
  totalDiamonds: number;
  state: RoundCardState;
}

export class RoundSelectionScene extends Scene {
  private readonly CARD_WIDTH = 140;
  private readonly CARD_HEIGHT = 140;
  private readonly CARD_SPACING = 30;
  private readonly CARDS_PER_ROW = 4;

  private roundsContainer: Container;
  private roundCards: RoundCard[] = [];

  constructor(app: Application) {
    super('RoundSelectionScene', app);
    this.buildUI();
  }

  private buildUI() {
    this.createBackground();
    this.createHeader();
    this.createRoundsGrid();
  }

  private createBackground() {
    const { width, height } = this.app.screen;

    const bgGridPattern = new BgGridPattern(width, height);

    this.addChild(bgGridPattern);
  }

  private createHeader() {
    const headerContainer = new Container();

    // Back button
    const backButton = new Button('outline', 'BACK TO MENU', 200, 50, 8);
    backButton.x = 60;
    backButton.y = 50;

    backButton.onClick(() => {
      emitSceneChange('MAIN_MENU');
    });

    headerContainer.addChild(backButton);

    // Title
    const title = new Text({
      text: 'SELECT ROUND',
      style: {
        fontFamily: 'Arial',
        fontSize: 32,
        fontWeight: 'bold',
        fill: colors.main,
        letterSpacing: 2
      }
    });
    title.anchor.set(0.5, 0);
    title.x = this.app.screen.width / 2;
    title.y = 40;

    // Add decorative elements around title
    const leftDot = this.createGlowDot(0x22d3ee);
    leftDot.x = title.x - title.width / 2 - 20;
    leftDot.y = title.y + title.height / 2;

    const rightDot = this.createGlowDot(0x22d3ee);
    rightDot.x = title.x + title.width / 2 + 20;
    rightDot.y = title.y + title.height / 2;

    headerContainer.addChild(title, leftDot, rightDot);
    this.addChild(headerContainer);
  }

  private createGlowDot(color: number): Graphics {
    const dot = new Graphics();

    // Outer glow
    dot.circle(0, 0, 6).fill({ color, alpha: 0.3 });

    // Inner dot
    dot.circle(0, 0, 3).fill({ color, alpha: 1 });

    return dot;
  }

  private createRoundsGrid() {
    this.roundsContainer = new Container();

    // TODO: make it a parameter passed somewhere from global state sitting in local storage
    const roundsData = rounds;

    // Calculate grid positioning
    const totalWidth =
      this.CARDS_PER_ROW * this.CARD_WIDTH + (this.CARDS_PER_ROW - 1) * this.CARD_SPACING;
    const startX = (this.app.screen.width - totalWidth) / 2;
    const startY = 150;

    // Create cards in grid layout
    roundsData.forEach((data, index) => {
      const col = index % this.CARDS_PER_ROW;
      const row = Math.floor(index / this.CARDS_PER_ROW);

      const card = new RoundCard(data);
      card.x = startX + col * (this.CARD_WIDTH + this.CARD_SPACING);
      card.y = startY + row * (this.CARD_HEIGHT + this.CARD_SPACING);

      // Add hover effects
      card.addHoverEffect();

      // Add click handler for unlocked/completed rounds
      if (data.state !== 'locked') {
        card.on('pointertap', () => {
          this.onRoundSelected(data.roundNumber);
        });
      }

      this.roundCards.push(card);
      this.roundsContainer.addChild(card);
    });

    this.addChild(this.roundsContainer);

    // Add progress indicator
    this.createProgressIndicator(roundsData);
  }

  private createProgressIndicator(roundsData: RoundData[]) {
    const completedRounds = roundsData.filter((r) => r.state === 'completed').length;
    const totalRounds = roundsData.filter((r) => r.state !== 'locked').length;

    const progressContainer = new Container();
    progressContainer.y = this.app.screen.height - 80;
    progressContainer.x = this.app.screen.width / 2;

    // Progress text
    const progressText = new Text({
      text: `PROGRESS: ${completedRounds}/${totalRounds} ROUNDS COMPLETED`,
      style: {
        fontFamily: 'Arial',
        fontSize: 16,
        fontWeight: '600',
        fill: 0x94a3b8,
        letterSpacing: 1
      }
    });
    progressText.anchor.set(0.5);

    // Progress bar background
    const barWidth = 300;
    const barHeight = 6;
    const progressBar = new Graphics();

    progressBar
      .roundRect(-barWidth / 2, 20, barWidth, barHeight, 3)
      .fill({ color: 0x1e293b, alpha: 0.5 });

    // Progress bar fill
    const progress = totalRounds > 0 ? completedRounds / totalRounds : 0;
    const fillWidth = barWidth * progress;

    progressBar
      .roundRect(-barWidth / 2, 20, fillWidth, barHeight, 3)
      .fill({ color: colors.main, alpha: 0.8 });

    // Progress bar border
    progressBar
      .roundRect(-barWidth / 2, 20, barWidth, barHeight, 3)
      .stroke({ width: 1, color: colors.main, alpha: 0.3 });

    progressContainer.addChild(progressText, progressBar);
    this.addChild(progressContainer);
  }

  private onRoundSelected(roundNumber: number) {
    console.log(`Round ${roundNumber} selected`);
    // TODO: Load the selected round and transition to game scene
  }
}

class RoundCard extends Container {
  private cardWidth = 140;
  private cardHeight = 140;
  private background: Graphics;
  private data: RoundCardData;

  constructor(data: RoundCardData) {
    super();
    this.data = data;
    this.buildCard();
    this.interactive = data.state !== 'locked';
    this.cursor = data.state !== 'locked' ? 'pointer' : 'default';
  }

  private buildCard() {
    const { state, roundNumber, diamondsCollected, totalDiamonds } = this.data;

    // Create background based on state
    this.background = new Graphics();

    if (state === 'locked') {
      // Dashed border for locked rounds
      this.drawDashedRect(0, 0, this.cardWidth, this.cardHeight, 8, 0x475569, 0.3);
    } else {
      // Solid card with glow
      this.drawCardBackground(state);

      // Round number
      const numberText = new Text({
        text: roundNumber.toString(),
        style: {
          fontFamily: 'Arial',
          fontSize: 48,
          fontWeight: 'bold',
          fill: state === 'completed' ? 0x22d3ee : 0xffffff,
          align: 'center'
        }
      });
      numberText.anchor.set(0.5);
      numberText.x = this.cardWidth / 2;
      numberText.y = this.cardHeight / 2 - 15;
      this.addChild(numberText);

      // Diamond rating
      const ratingContainer = this.createRatingDisplay(diamondsCollected, totalDiamonds, state);
      ratingContainer.x = this.cardWidth / 2;
      ratingContainer.y = this.cardHeight - 30;
      this.addChild(ratingContainer);
    }

    this.addChild(this.background);
  }

  private drawCardBackground(state: RoundCardState) {
    const glow = state === 'completed' ? 0x22d3ee : 0x8b5cf6;
    const glowAlpha = state === 'completed' ? 0.3 : 0.2;

    // Outer glow
    this.background
      .roundRect(-4, -4, this.cardWidth + 8, this.cardHeight + 8, 12)
      .fill({ color: glow, alpha: glowAlpha });

    // Main background - dark with slight transparency
    this.background
      .roundRect(0, 0, this.cardWidth, this.cardHeight, 8)
      .fill({ color: 0x1e293b, alpha: 0.2 });

    // Border
    const borderColor = state === 'completed' ? 0x22d3ee : 0x8b5cf6;
    this.background
      .roundRect(0, 0, this.cardWidth, this.cardHeight, 8)
      .stroke({ width: 2, color: borderColor, alpha: 0.4 });

    // Top highlight for depth
    this.background
      .roundRect(2, 2, this.cardWidth - 4, this.cardHeight / 3, 6)
      .fill({ color: 0xffffff, alpha: 0.05 });
  }

  private drawDashedRect(
    x: number,
    y: number,
    w: number,
    h: number,
    radius: number,
    color: number,
    alpha: number
  ) {
    const dashLength = 10;
    const gapLength = 8;
    const corners = radius;

    this.background.setStrokeStyle({ width: 2, color, alpha });

    // Helper to draw dashed line
    const drawDashedLine = (x1: number, y1: number, x2: number, y2: number) => {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const length = Math.sqrt(dx * dx + dy * dy);
      const steps = Math.floor(length / (dashLength + gapLength));
      const stepX = dx / length;
      const stepY = dy / length;

      for (let i = 0; i < steps; i++) {
        const startPos = i * (dashLength + gapLength);
        const endPos = startPos + dashLength;
        this.background
          .moveTo(x1 + stepX * startPos, y1 + stepY * startPos)
          .lineTo(x1 + stepX * endPos, y1 + stepY * endPos)
          .stroke();
      }
    };

    // Draw four sides with dashed lines
    drawDashedLine(x + corners, y, x + w - corners, y); // Top
    drawDashedLine(x + w, y + corners, x + w, y + h - corners); // Right
    drawDashedLine(x + w - corners, y + h, x + corners, y + h); // Bottom
    drawDashedLine(x, y + h - corners, x, y + corners); // Left
  }

  private createRatingDisplay(collected: number, total: number, state: RoundCardState): Container {
    const container = new Container();

    // Diamond icon (simple geometric shape)
    const diamond = this.createDiamond(state === 'completed' ? 0xfbbf24 : 0x64748b);
    diamond.x = -25;
    diamond.y = -8;
    container.addChild(diamond);

    // Rating text
    const ratingText = new Text({
      text: `${collected}/${total}`,
      style: {
        fontFamily: 'Arial',
        fontSize: 18,
        fontWeight: '600',
        fill: state === 'completed' ? 0xfbbf24 : 0x64748b,
        letterSpacing: 0.5
      }
    });
    ratingText.anchor.set(0, 0.5);
    ratingText.x = -10;
    ratingText.y = 0;
    container.addChild(ratingText);

    container.pivot.set(container.width / 2, container.height / 2);

    return container;
  }

  private createDiamond(color: number): Graphics {
    const diamond = new Graphics();
    const size = 12;

    // Draw diamond shape
    diamond.poly([
      0,
      -size / 2, // Top
      size / 2,
      0, // Right
      0,
      size / 2, // Bottom
      -size / 2,
      0 // Left
    ]);
    diamond.fill(color);

    // Add border for definition
    diamond.poly([0, -size / 2, size / 2, 0, 0, size / 2, -size / 2, 0]);
    diamond.stroke({ width: 1, color: 0xffffff, alpha: 0.3 });

    return diamond;
  }

  public addHoverEffect() {
    if (this.data.state === 'locked') return;

    this.on('pointerover', () => {
      this.scale.set(1.05);
      this.y -= 3;
    });

    this.on('pointerout', () => {
      this.scale.set(1);
      this.y += 3;
    });
  }
}
