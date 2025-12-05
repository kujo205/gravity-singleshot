import { Scene } from './Scene.ts';
import { emitSceneChange } from '$lib/sceneChange.ts';
import { Button, type ButtonStyle } from '../ui/Button.ts';
import { List } from '@pixi/ui';
import { Application, Text, Container } from 'pixi.js';

export class MainMenuScene extends Scene {
  constructor(app: Application) {
    super('MainMenuScene', app);

    console.log('rendering main menu scene');
    this.buildUI();
  }

  private buildUI() {
    const menuButtons = [
      {
        buttonStyle: 'primary',
        label: 'Play the game',
        onClick: () => {
          alert(
            'not implemented, need to save selected round to state and than redirect to game scene'
          );
        }
      },
      {
        buttonStyle: 'success',
        label: 'Choose round',
        onClick: () => emitSceneChange('ROUND_SELECTION')
      },
      {
        buttonStyle: 'secondary',
        label: 'Settings',
        onClick: () => alert('setting not implemented')
      },
      {
        buttonStyle: 'secondary',
        label: 'About this game',
        onClick: () => alert('not implemented')
      }
    ] satisfies Array<{ label: string; buttonStyle: ButtonStyle; onClick: () => void }>;

    // Create game title
    const title = new Text({
      text: 'Gravity Singleshot',
      style: {
        fontFamily: 'Arial',
        fontSize: 48,
        fontWeight: 'bold',
        fill: 0xffffff,
        align: 'center',
        resolution: 5
      }
    });
    title.anchor.set(0.5, 0);

    // Create button list
    const list = new List({
      items: [],
      type: 'vertical',
      elementsMargin: 10
    });

    for (let i = 0; i < menuButtons.length; i++) {
      const curr = menuButtons[i];

      const button = new Button(curr.buttonStyle, curr.label, 200);

      button.view.onPress.connect(curr.onClick);

      list.addChild(button);
    }

    // Create a container for title and list
    const menuContainer = new Container();
    menuContainer.addChild(title);
    menuContainer.addChild(list);

    // Position title and list relative to each other
    title.x = 100; // Half of button width (200/2)
    title.y = 0;

    list.x = 0;
    list.y = title.height + 40; // 40px spacing below title

    // Center the entire menu container
    menuContainer.x = this.width / 2 - 100;
    menuContainer.y = this.height / 3 - title.height - 20;

    this.addChild(menuContainer);
  }
}
