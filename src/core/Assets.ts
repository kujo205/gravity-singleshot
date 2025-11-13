import * as PIXI from 'pixi.js';

export interface AssetManifest {
  [key: string]: string;
}

export class Assets {
  private static loadedAssets: Map<string, PIXI.Texture | PIXI.Spritesheet> = new Map();
  private static loadedSounds: Map<string, string> = new Map();

  /**
   * Load a single asset
   */
  public static async load(key: string, path: string): Promise<void> {
    try {
      const texture = await PIXI.Assets.load(path);
      this.loadedAssets.set(key, texture);
    } catch (error) {
      console.error(`Failed to load asset: ${key} from ${path}`, error);
    }
  }

  /**
   * Load multiple assets from a manifest
   */
  public static async loadManifest(manifest: AssetManifest): Promise<void> {
    const promises = Object.entries(manifest).map(([key, path]) => this.load(key, path));
    await Promise.all(promises);
  }

  /**
   * Get a loaded texture
   */
  public static getTexture(key: string): PIXI.Texture {
    const asset = this.loadedAssets.get(key);
    if (!asset) {
      console.warn(`Asset "${key}" not found, returning empty texture`);
      return PIXI.Texture.EMPTY;
    }
    return asset as PIXI.Texture;
  }

  /**
   * Get a loaded spritesheet
   */
  public static getSpritesheet(key: string): PIXI.Spritesheet | null {
    const asset = this.loadedAssets.get(key);
    if (!asset) {
      console.warn(`Spritesheet "${key}" not found`);
      return null;
    }
    return asset as PIXI.Spritesheet;
  }

  /**
   * Register a sound asset (URLs only, no actual audio loading in this simple implementation)
   */
  public static registerSound(key: string, path: string): void {
    this.loadedSounds.set(key, path);
  }

  /**
   * Get a sound path
   */
  public static getSound(key: string): string | null {
    return this.loadedSounds.get(key) || null;
  }

  /**
   * Clear all loaded assets
   */
  public static clear(): void {
    this.loadedAssets.clear();
    this.loadedSounds.clear();
  }

  /**
   * Check if asset is loaded
   */
  public static has(key: string): boolean {
    return this.loadedAssets.has(key) || this.loadedSounds.has(key);
  }
}
