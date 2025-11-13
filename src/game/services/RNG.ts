export class RNG {
  private seed: number;

  constructor(seed?: number) {
    this.seed = seed ?? Date.now();
  }

  /**
   * Generate a random number between 0 and 1 using seeded PRNG
   */
  public random(): number {
    // Simple LCG (Linear Congruential Generator)
    const a = 1664525;
    const c = 1013904223;
    const m = 2 ** 32;

    this.seed = (a * this.seed + c) % m;
    return this.seed / m;
  }

  /**
   * Generate a random integer between min (inclusive) and max (inclusive)
   */
  public randomInt(min: number, max: number): number {
    return Math.floor(this.random() * (max - min + 1)) + min;
  }

  /**
   * Generate a random float between min and max
   */
  public randomFloat(min: number, max: number): number {
    return this.random() * (max - min) + min;
  }

  /**
   * Choose a random element from an array
   */
  public choose<T>(array: T[]): T | undefined {
    if (array.length === 0) return undefined;
    return array[this.randomInt(0, array.length - 1)];
  }

  /**
   * Shuffle an array in place
   */
  public shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = this.randomInt(0, i);
      const temp = array[i];
      const swapValue = array[j];
      if (temp !== undefined && swapValue !== undefined) {
        array[i] = swapValue;
        array[j] = temp;
      }
    }
    return array;
  }

  /**
   * Generate a random boolean with given probability (0-1)
   */
  public chance(probability: number): boolean {
    return this.random() < probability;
  }

  /**
   * Reset the seed
   */
  public setSeed(seed: number): void {
    this.seed = seed;
  }

  /**
   * Get current seed
   */
  public getSeed(): number {
    return this.seed;
  }
}
