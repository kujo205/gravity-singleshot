import { Scene } from './Scene.ts';
import { emitSceneChange } from '$lib/sceneChange.ts';
import { Button } from '../ui/Button.ts';
import { Application, Text, Container, TextStyle } from 'pixi.js';
import { gameState } from '../core/game/GameState.ts';

abstract class GameEndScene extends Scene {
  protected uiContainer?: Container;

  constructor(name: string, app: Application) {
    super(name, app);
    this.buildUI();
  }

  protected abstract getTitle(): string;
  protected abstract getTitleColor(): number;
  protected abstract getButtons(): Array<{ label: string; action: () => void }>;

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
      text: `Time: ${this.formatTime(gameState.getElapsedTime())}`,
      style: statsStyle
    });
    timeText.anchor.set(0.5);
    timeText.y = 0;

    const diamondsText = new Text({
      text: `Diamonds: ${gameState.currentRound?.diamondsCollected || 0} / ${gameState.currentRound?.totalDiamonds || 0}`,
      style: statsStyle
    });
    diamondsText.anchor.set(0.5);
    diamondsText.y = 50;

    statsContainer.addChild(timeText, diamondsText);
    return statsContainer;
  }

  private createButtonsContainer(): Container {
    const buttonsContainer = new Container();
    const buttons = this.getButtons();
    const buttonWidth = 200;
    const buttonHeight = 50;
    const buttonSpacing = 20;
    const totalWidth = buttons.length * buttonWidth + (buttons.length - 1) * buttonSpacing;
    const startX = (this.app.screen.width - totalWidth) / 2;

    buttons.forEach((buttonConfig, index) => {
      const button = new Button('outline', buttonConfig.label, buttonWidth, buttonHeight, 8);
      button.x = startX + index * (buttonWidth + buttonSpacing);
      button.y = 400;
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
  constructor(app: Application) {
    super('LostGameScene', app);
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
  constructor(app: Application) {
    super('WinGameScene', app);
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
