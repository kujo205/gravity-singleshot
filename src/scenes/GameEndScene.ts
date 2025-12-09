import { Scene } from './Scene.ts';
import { emitSceneChange } from '$lib/sceneChange.ts';
import { Button } from '../ui/Button.ts';
import { Application, Text, Container, TextStyle } from 'pixi.js';
import { type GameState } from '../core/game/GameState.ts';
import { BgGridPattern } from '../ui/BgGridPattern.ts';
import { List } from '@pixi/ui';

abstract class GameEndScene extends Scene {
  protected uiContainer?: Container;

  constructor(name: string, app: Application, gameState: GameState) {
    super(name, app, gameState);

    this.buildBg();
    this.buildUI();
  }

  protected abstract getTitle(): string;
  protected abstract getTitleColor(): number;
  protected abstract getButtons(): Array<{ label: string; action: () => void }>;

  private buildBg() {
    const { width, height } = this.app.screen;

    const bgGridPattern = new BgGridPattern(width, height);

    this.addChild(bgGridPattern);
  }

  protected buildUI() {
    if (this.uiContainer) {
      this.removeChild(this.uiContainer);
      this.uiContainer.destroy({ children: true });
    }

    this.uiContainer = new Container();

    // Title
    const titleStyle = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 48,
      fontWeight: 'bold',
      fill: this.getTitleColor()
    });
    const title = new Text({ text: this.getTitle(), style: titleStyle });
    title.anchor.set(0.5);
    title.x = this.app.screen.width / 2;
    title.y = 100;

    // Stats container
    const statsContainer = this.createStatsContainer();

    // Buttons
    const buttonsContainer = this.createButtonsContainer();

    this.uiContainer.addChild(title, statsContainer, buttonsContainer);
    this.addChild(this.uiContainer);
  }

  private createStatsContainer(): Container {
    const statsContainer = new Container();
    statsContainer.x = this.app.screen.width / 2;
    statsContainer.y = 250;

    const statsStyle = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 0xffffff
    });

    const timeText = new Text({
      text: `Time: ${this.formatTime(this.gameState.getElapsedTime())}`,
      style: statsStyle
    });
    timeText.anchor.set(0.5);
    timeText.y = 0;

    const diamondsText = new Text({
      text: `Diamonds collected: ${this.gameState.currentRound?.diamondsCollected || 0} / ${this.gameState.currentRound?.totalDiamonds || 0}`,
      style: statsStyle
    });
    diamondsText.anchor.set(0.5);
    diamondsText.y = 50;

    statsContainer.addChild(timeText, diamondsText);
    return statsContainer;
  }

  private createButtonsContainer(): Container {
    const buttonsContainer = new List({
      type: 'vertical',
      elementsMargin: 20
    });

    const buttons = this.getButtons();
    const buttonWidth = 200;
    const buttonHeight = 50;
    const buttonSpacing = 20;
    const totalHeight = buttons.length * buttonHeight + (buttons.length - 1) * buttonSpacing;

    // Center the list horizontally and vertically
    buttonsContainer.x = (this.app.screen.width - buttonWidth) / 2;
    buttonsContainer.y = (this.app.screen.height - totalHeight) / 2;

    buttons.forEach((buttonConfig) => {
      const button = new Button('outline', buttonConfig.label, buttonWidth, buttonHeight, 8);
      button.onClick(buttonConfig.action);
      buttonsContainer.addChild(button);
    });

    return buttonsContainer;
  }

  protected formatTime(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  destroy(options?: boolean | object) {
    if (this.uiContainer) {
      this.uiContainer.destroy({ children: true });
      this.uiContainer = undefined;
    }
    super.destroy(options);
  }
}

export class LostGameScene extends GameEndScene {
  constructor(app: Application, gameState: GameState) {
    super('LostGameScene', app, gameState);
  }

  protected getTitle(): string {
    return 'What a bummer!';
  }

  protected getTitleColor(): number {
    return 0xff0000; // Red
  }

  protected getButtons(): Array<{ label: string; action: () => void }> {
    return [
      {
        label: 'RESTART',
        action: () => {
          emitSceneChange('GAME_SCENE');
        }
      },
      {
        label: 'MAIN MENU',
        action: () => {
          emitSceneChange('MAIN_MENU');
        }
      }
    ];
  }
}

export class WinGameScene extends GameEndScene {
  constructor(app: Application, gameState: GameState) {
    super('WinGameScene', app, gameState);
  }

  protected getTitle(): string {
    return 'What a beautiful shot!';
  }

  protected getTitleColor(): number {
    return 0x00ff00; // Green
  }

  protected getButtons(): Array<{ label: string; action: () => void }> {
    return [
      {
        label: 'RESTART',
        action: () => {
          emitSceneChange('GAME_SCENE');
        }
      },
      {
        label: 'MAIN MENU',
        action: () => {
          emitSceneChange('MAIN_MENU');
        }
      },
      {
        label: 'NEXT LEVEL',
        action: () => {
          alert('add next game scene handling');
          // gameState.loadNextRound();
          // emitSceneChange('GAME');
        }
      }
    ];
  }
}
