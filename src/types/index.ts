import type { App } from '@core/App';
import type { Scene } from '@core/Scene';

export interface ISceneManager {
  register(name: string, sceneClass: SceneConstructor): void;
  goto(name: string, data?: Record<string, unknown>): void;
  getApp(): App;
}

export type SceneConstructor = new (
  sceneManager: ISceneManager,
  data?: Record<string, unknown>
) => Scene;

export interface Vector2D {
  x: number;
  y: number;
}

export interface AABB {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface GameEntity {
  id: string;
  position: Vector2D;
  velocity: Vector2D;
  destroyed: boolean;
}

export interface Level {
  id: string;
  name: string;
  difficulty: number;
  par: number;
  platforms: Platform[];
  start: Vector2D;
  end: Vector2D;
  obstacles: Obstacle[];
  checkpoints: Vector2D[];
  gravity: Vector2D;
}

export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  type?: 'normal' | 'bouncy' | 'sticky';
}

export interface Obstacle {
  x: number;
  y: number;
  radius: number;
  type: 'static' | 'moving';
  path?: Vector2D[];
}

export interface Checkpoint {
  position: Vector2D;
  activated: boolean;
}

export interface PlayerProgress {
  currentLevel: number;
  unlockedLevels: number;
  stars: number;
  coins: number;
  completedLevels: Set<string>;
  levelStats: Map<string, LevelStats>;
}

export interface LevelStats {
  attempts: number;
  completed: boolean;
  bestShots: number;
  stars: number;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  owned: boolean;
  type: 'skin' | 'trail' | 'powerup';
}
