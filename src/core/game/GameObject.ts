import { Container } from 'pixi.js';

/**
 * Base game object class
 */
export class GameObject extends Container {
  constructor(
    /**
     * initialX - initial X position of an object
     * */
    public initialX: number,

    /**
     * initialY - initial Y position of an object
     * */
    public initialY: number,

    /**
     * objectType - type of object to be displayed
     * */
    public objectType: string
  ) {
    super();

    this.x = initialX;
    this.y = initialY;
  }
}
