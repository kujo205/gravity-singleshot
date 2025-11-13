/**
 * Easing functions for animations
 */

export type EasingFunction = (t: number) => number;

export const Easing = {
  linear: (t: number): number => t,

  easeInQuad: (t: number): number => t * t,

  easeOutQuad: (t: number): number => t * (2 - t),

  easeInOutQuad: (t: number): number => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),

  easeInCubic: (t: number): number => t * t * t,

  easeOutCubic: (t: number): number => {
    const t1 = t - 1;
    return t1 * t1 * t1 + 1;
  },

  easeInOutCubic: (t: number): number =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,

  easeInQuart: (t: number): number => t * t * t * t,

  easeOutQuart: (t: number): number => {
    const t1 = t - 1;
    return 1 - t1 * t1 * t1 * t1;
  },

  easeInOutQuart: (t: number): number => {
    if (t < 0.5) {
      return 8 * t * t * t * t;
    }
    const t1 = t - 1;
    return 1 - 8 * t1 * t1 * t1 * t1;
  },

  easeInExpo: (t: number): number => (t === 0 ? 0 : 2 ** (10 * (t - 1))),

  easeOutExpo: (t: number): number => (t === 1 ? 1 : 1 - 2 ** (-10 * t)),

  easeInOutExpo: (t: number): number => {
    if (t === 0 || t === 1) return t;
    if (t < 0.5) return 2 ** (20 * t - 10) / 2;
    return (2 - 2 ** (-20 * t + 10)) / 2;
  },

  easeInElastic: (t: number): number => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : -(2 ** (10 * t - 10)) * Math.sin((t * 10 - 10.75) * c4);
  },

  easeOutElastic: (t: number): number => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : 2 ** (-10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },

  easeInBack: (t: number): number => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return c3 * t * t * t - c1 * t * t;
  },

  easeOutBack: (t: number): number => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2;
  },

  easeInBounce: (t: number): number => 1 - Easing.easeOutBounce(1 - t),

  easeOutBounce: (t: number): number => {
    const n1 = 7.5625;
    const d1 = 2.75;

    if (t < 1 / d1) {
      return n1 * t * t;
    }
    if (t < 2 / d1) {
      const t2 = t - 1.5 / d1;
      return n1 * t2 * t2 + 0.75;
    }
    if (t < 2.5 / d1) {
      const t2 = t - 2.25 / d1;
      return n1 * t2 * t2 + 0.9375;
    }
    const t2 = t - 2.625 / d1;
    return n1 * t2 * t2 + 0.984375;
  },
};

/**
 * Simple tween class
 */
export class Tween {
  private startValue: number;
  private endValue: number;
  private duration: number;
  private elapsed = 0;
  private easing: EasingFunction;
  private onUpdate: ((value: number) => void) | null = null;
  private onComplete: (() => void) | null = null;
  private isComplete = false;

  constructor(
    startValue: number,
    endValue: number,
    duration: number,
    easing: EasingFunction = Easing.linear
  ) {
    this.startValue = startValue;
    this.endValue = endValue;
    this.duration = duration;
    this.easing = easing;
  }

  public update(deltaTime: number): void {
    if (this.isComplete) return;

    this.elapsed += deltaTime;
    const t = Math.min(1, this.elapsed / this.duration);
    const easedT = this.easing(t);
    const value = this.startValue + (this.endValue - this.startValue) * easedT;

    this.onUpdate?.(value);

    if (t >= 1) {
      this.isComplete = true;
      this.onComplete?.();
    }
  }

  public setOnUpdate(callback: (value: number) => void): this {
    this.onUpdate = callback;
    return this;
  }

  public setOnComplete(callback: () => void): this {
    this.onComplete = callback;
    return this;
  }

  public reset(): void {
    this.elapsed = 0;
    this.isComplete = false;
  }

  public isFinished(): boolean {
    return this.isComplete;
  }
}
