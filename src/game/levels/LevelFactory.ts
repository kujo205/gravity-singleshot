import type { Level } from '@types';
import { levelSchemaToLevel, validateLevel } from './schema';

export class LevelFactory {
  private levels: Map<string, Level> = new Map();

  /**
   * Load level from JSON data
   */
  public loadFromJSON(jsonData: unknown): Level {
    if (!validateLevel(jsonData)) {
      throw new Error('Invalid level data');
    }

    const level = levelSchemaToLevel(jsonData);
    this.levels.set(level.id, level);
    return level;
  }

  /**
   * Load level from URL
   */
  public async loadFromURL(url: string): Promise<Level> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to load level from ${url}`);
      }
      const jsonData = await response.json();
      return this.loadFromJSON(jsonData);
    } catch (error) {
      console.error('Error loading level:', error);
      throw error;
    }
  }

  /**
   * Load multiple levels from URLs
   */
  public async loadMultipleLevels(urls: string[]): Promise<Level[]> {
    const promises = urls.map((url) => this.loadFromURL(url));
    return Promise.all(promises);
  }

  /**
   * Get a loaded level by ID
   */
  public getLevel(id: string): Level | undefined {
    return this.levels.get(id);
  }

  /**
   * Get all loaded levels
   */
  public getAllLevels(): Level[] {
    return Array.from(this.levels.values());
  }

  /**
   * Create a simple test level
   */
  public createTestLevel(): Level {
    const level: Level = {
      id: 'test-level',
      name: 'Test Level',
      difficulty: 1,
      par: 3,
      platforms: [
        { x: 100, y: 400, width: 200, height: 20, type: 'normal' },
        { x: 400, y: 350, width: 150, height: 20, type: 'normal' },
        { x: 650, y: 300, width: 200, height: 20, type: 'normal' },
      ],
      start: { x: 150, y: 300 },
      end: { x: 750, y: 200 },
      obstacles: [{ x: 500, y: 300, radius: 30, type: 'static' }],
      checkpoints: [{ x: 400, y: 280 }],
      gravity: { x: 0, y: 200 },
    };

    this.levels.set(level.id, level);
    return level;
  }
}
