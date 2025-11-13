export type InputCallback = (x: number, y: number) => void;

export class Input {
  private isMouseDown = false;
  private mouseX = 0;
  private mouseY = 0;
  private element: HTMLElement;

  private onDownCallbacks: InputCallback[] = [];
  private onUpCallbacks: InputCallback[] = [];
  private onMoveCallbacks: InputCallback[] = [];

  constructor(element: HTMLElement) {
    this.element = element;
    this.setupListeners();
  }

  private setupListeners(): void {
    // Mouse events
    this.element.addEventListener('mousedown', this.handleMouseDown);
    this.element.addEventListener('mouseup', this.handleMouseUp);
    this.element.addEventListener('mousemove', this.handleMouseMove);

    // Touch events
    this.element.addEventListener('touchstart', this.handleTouchStart);
    this.element.addEventListener('touchend', this.handleTouchEnd);
    this.element.addEventListener('touchmove', this.handleTouchMove);
  }

  private handleMouseDown = (e: MouseEvent): void => {
    this.isMouseDown = true;
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
    this.onDownCallbacks.forEach((cb) => cb(this.mouseX, this.mouseY));
  };

  private handleMouseUp = (e: MouseEvent): void => {
    this.isMouseDown = false;
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
    this.onUpCallbacks.forEach((cb) => cb(this.mouseX, this.mouseY));
  };

  private handleMouseMove = (e: MouseEvent): void => {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
    this.onMoveCallbacks.forEach((cb) => cb(this.mouseX, this.mouseY));
  };

  private handleTouchStart = (e: TouchEvent): void => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      if (!touch) return;
      this.isMouseDown = true;
      this.mouseX = touch.clientX;
      this.mouseY = touch.clientY;
      this.onDownCallbacks.forEach((cb) => cb(this.mouseX, this.mouseY));
    }
  };

  private handleTouchEnd = (e: TouchEvent): void => {
    this.isMouseDown = false;
    if (e.changedTouches.length > 0) {
      const touch = e.changedTouches[0];
      if (!touch) return;
      this.mouseX = touch.clientX;
      this.mouseY = touch.clientY;
      this.onUpCallbacks.forEach((cb) => cb(this.mouseX, this.mouseY));
    }
  };

  private handleTouchMove = (e: TouchEvent): void => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      if (!touch) return;
      this.mouseX = touch.clientX;
      this.mouseY = touch.clientY;
      this.onMoveCallbacks.forEach((cb) => cb(this.mouseX, this.mouseY));
    }
  };

  public onDown(callback: InputCallback): void {
    this.onDownCallbacks.push(callback);
  }

  public onUp(callback: InputCallback): void {
    this.onUpCallbacks.push(callback);
  }

  public onMove(callback: InputCallback): void {
    this.onMoveCallbacks.push(callback);
  }

  public getMousePosition(): { x: number; y: number } {
    return { x: this.mouseX, y: this.mouseY };
  }

  public isPressed(): boolean {
    return this.isMouseDown;
  }

  public destroy(): void {
    this.element.removeEventListener('mousedown', this.handleMouseDown);
    this.element.removeEventListener('mouseup', this.handleMouseUp);
    this.element.removeEventListener('mousemove', this.handleMouseMove);
    this.element.removeEventListener('touchstart', this.handleTouchStart);
    this.element.removeEventListener('touchend', this.handleTouchEnd);
    this.element.removeEventListener('touchmove', this.handleTouchMove);
  }
}
