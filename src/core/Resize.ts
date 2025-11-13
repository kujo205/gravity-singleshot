import type { App } from './App';

export class Resize {
  private app: App;
  private resizeCallback: (() => void) | null = null;

  constructor(app: App) {
    this.app = app;
    this.setupResizeListener();
    this.resize();
  }

  private setupResizeListener(): void {
    window.addEventListener('resize', () => this.resize());
  }

  private resize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.app.resize(width, height);

    if (this.resizeCallback) {
      this.resizeCallback();
    }
  }

  public onResize(callback: () => void): void {
    this.resizeCallback = callback;
  }

  public destroy(): void {
    window.removeEventListener('resize', () => this.resize());
  }
}
