import type { PlayerProgress, LevelStats } from '@types';

export class Progress {
  private static readonly STORAGE_KEY = 'gravity-singleshot-progress';

  private progress: PlayerProgress;

  constructor() {
    this.progress = this.load();
  }

  private load(): PlayerProgress {
    const stored = localStorage.getItem(Progress.STORAGE_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        return {
          currentLevel: data.currentLevel || 0,
          unlockedLevels: data.unlockedLevels || 1,
          stars: data.stars || 0,
          coins: data.coins || 0,
          completedLevels: new Set(data.completedLevels || []),
          levelStats: new Map(Object.entries(data.levelStats || {})),
        };
      } catch (error) {
        console.error('Failed to load progress:', error);
      }
    }

    return {
      currentLevel: 0,
      unlockedLevels: 1,
      stars: 0,
      coins: 0,
      completedLevels: new Set(),
      levelStats: new Map(),
    };
  }

  private save(): void {
    const data = {
      currentLevel: this.progress.currentLevel,
      unlockedLevels: this.progress.unlockedLevels,
      stars: this.progress.stars,
      coins: this.progress.coins,
      completedLevels: Array.from(this.progress.completedLevels),
      levelStats: Object.fromEntries(this.progress.levelStats),
    };

    localStorage.setItem(Progress.STORAGE_KEY, JSON.stringify(data));
  }

  public completeLevel(levelId: string, shots: number, par: number): void {
    this.progress.completedLevels.add(levelId);

    const stats = this.getLevelStats(levelId);
    stats.completed = true;
    stats.attempts += 1;

    if (shots <= stats.bestShots || stats.bestShots === 0) {
      stats.bestShots = shots;
    }

    // Calculate stars based on performance
    if (shots <= par) {
      stats.stars = 3;
    } else if (shots <= par + 2) {
      stats.stars = 2;
    } else {
      stats.stars = 1;
    }

    this.progress.levelStats.set(levelId, stats);
    this.progress.stars += stats.stars;
    this.save();
  }

  public unlockNextLevel(): void {
    this.progress.unlockedLevels += 1;
    this.save();
  }

  public getLevelStats(levelId: string): LevelStats {
    if (!this.progress.levelStats.has(levelId)) {
      this.progress.levelStats.set(levelId, {
        attempts: 0,
        completed: false,
        bestShots: 0,
        stars: 0,
      });
    }
    return this.progress.levelStats.get(levelId)!;
  }

  public isLevelUnlocked(levelIndex: number): boolean {
    return levelIndex < this.progress.unlockedLevels;
  }

  public getCurrentLevel(): number {
    return this.progress.currentLevel;
  }

  public setCurrentLevel(level: number): void {
    this.progress.currentLevel = level;
    this.save();
  }

  public getTotalStars(): number {
    return this.progress.stars;
  }

  public getCoins(): number {
    return this.progress.coins;
  }

  public addCoins(amount: number): void {
    this.progress.coins += amount;
    this.save();
  }

  public spendCoins(amount: number): boolean {
    if (this.progress.coins >= amount) {
      this.progress.coins -= amount;
      this.save();
      return true;
    }
    return false;
  }

  public reset(): void {
    localStorage.removeItem(Progress.STORAGE_KEY);
    this.progress = {
      currentLevel: 0,
      unlockedLevels: 1,
      stars: 0,
      coins: 0,
      completedLevels: new Set(),
      levelStats: new Map(),
    };
  }
}
