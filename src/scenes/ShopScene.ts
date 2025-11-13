import { Scene } from '@core/Scene';
import { Progress } from '@game/services/Progress';
import type { ISceneManager } from '@types';
import type { ShopItem } from '@types';
import { Button } from '@ui/Button';
import { Panel } from '@ui/Panel';
import * as PIXI from 'pixi.js';

export class ShopScene extends Scene {
  private title: PIXI.Text;
  private backButton: Button;
  private coinsText: PIXI.Text;
  private progress: Progress;
  private shopItems: ShopItem[] = [];

  constructor(sceneManager: ISceneManager) {
    super(sceneManager);

    this.progress = new Progress();

    this.title = new PIXI.Text('SHOP', {
      fontSize: 48,
      fill: 0xffffff,
      fontFamily: 'Arial',
      fontWeight: 'bold',
    });

    this.backButton = new Button({
      text: 'BACK',
      width: 150,
      height: 50,
      fontSize: 20,
    });

    this.coinsText = new PIXI.Text('', {
      fontSize: 28,
      fill: 0xffd700,
      fontFamily: 'Arial',
      fontWeight: 'bold',
    });

    // Define shop items
    this.shopItems = [
      {
        id: 'red-ball',
        name: 'Red Ball',
        description: 'A vibrant red ball skin',
        cost: 100,
        owned: false,
        type: 'skin',
      },
      {
        id: 'blue-ball',
        name: 'Blue Ball',
        description: 'A cool blue ball skin',
        cost: 100,
        owned: false,
        type: 'skin',
      },
      {
        id: 'rainbow-trail',
        name: 'Rainbow Trail',
        description: 'Leave a rainbow trail',
        cost: 200,
        owned: false,
        type: 'trail',
      },
      {
        id: 'fire-trail',
        name: 'Fire Trail',
        description: 'Leave a fiery trail',
        cost: 200,
        owned: false,
        type: 'trail',
      },
      {
        id: 'extra-shot',
        name: 'Extra Shot',
        description: 'Get an extra shot per level',
        cost: 500,
        owned: false,
        type: 'powerup',
      },
      {
        id: 'slow-motion',
        name: 'Slow Motion',
        description: 'Slow down time',
        cost: 750,
        owned: false,
        type: 'powerup',
      },
    ];
  }

  public init(): void {
    // Background
    const bg = new PIXI.Graphics();
    bg.beginFill(0x1a1a2e);
    bg.drawRect(0, 0, this.screenWidth, this.screenHeight);
    bg.endFill();
    this.addChild(bg);

    // Title
    this.title.anchor.set(0.5);
    this.title.position.set(this.screenWidth / 2, 80);
    this.addChild(this.title);

    // Coins display
    this.updateCoinsDisplay();
    this.coinsText.anchor.set(0.5);
    this.coinsText.position.set(this.screenWidth / 2, 140);
    this.addChild(this.coinsText);

    // Back button
    this.backButton.position.set(50, 50);
    this.backButton.onClick = () => this.sceneManager.goto('menu');
    this.addChild(this.backButton);

    // Create shop item panels
    const startX = 150;
    const startY = 220;
    const spacing = 380;
    const cols = 3;

    for (let i = 0; i < this.shopItems.length; i++) {
      const item = this.shopItems[i];
      if (!item) continue;

      const row = Math.floor(i / cols);
      const col = i % cols;
      const x = startX + col * spacing;
      const y = startY + row * 280;

      this.createShopItemPanel(item, x, y);
    }
  }

  private createShopItemPanel(item: ShopItem, x: number, y: number): void {
    const panel = new Panel({
      width: 320,
      height: 220,
      backgroundColor: 0x2c3e50,
    });
    panel.position.set(x, y);
    this.addChild(panel);

    const nameText = new PIXI.Text(item.name, {
      fontSize: 24,
      fill: 0xffffff,
      fontFamily: 'Arial',
      fontWeight: 'bold',
    });
    nameText.position.set(160 - nameText.width / 2, 15);
    panel.addContent(nameText);

    const descText = new PIXI.Text(item.description, {
      fontSize: 16,
      fill: 0xcccccc,
      fontFamily: 'Arial',
      wordWrap: true,
      wordWrapWidth: 280,
    });
    descText.position.set(160 - descText.width / 2, 55);
    panel.addContent(descText);

    const buyButton = new Button({
      text: item.owned ? 'OWNED' : `${item.cost} coins`,
      width: 200,
      height: 50,
      fontSize: 18,
      backgroundColor: item.owned ? 0x95a5a6 : 0x2ecc71,
    });
    buyButton.position.set(60, 130);
    buyButton.setEnabled(!item.owned);

    if (!item.owned) {
      buyButton.onClick = () => {
        if (this.progress.spendCoins(item.cost)) {
          item.owned = true;
          buyButton.setText('OWNED');
          buyButton.setEnabled(false);
          this.updateCoinsDisplay();
        } else {
          console.log('Not enough coins!');
        }
      };
    }

    panel.addContent(buyButton);
  }

  private updateCoinsDisplay(): void {
    this.coinsText.text = `💰 ${this.progress.getCoins()} coins`;
  }

  public update(_deltaTime: number): void {
    // Nothing to update
  }

  public override resize(width: number, height: number): void {
    super.resize(width, height);
    this.title.position.set(width / 2, 80);
    this.coinsText.position.set(width / 2, 140);
  }
}
