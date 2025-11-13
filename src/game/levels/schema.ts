import type { Level } from '@types';

/**
 * Level schema definition and validation
 */

export interface LevelSchema {
  id: string;
  name: string;
  difficulty: number;
  par: number;
  platforms: {
    x: number;
    y: number;
    width: number;
    height: number;
    type?: 'normal' | 'bouncy' | 'sticky';
  }[];
  start: {
    x: number;
    y: number;
  };
  end: {
    x: number;
    y: number;
  };
  obstacles: {
    x: number;
    y: number;
    radius: number;
    type: 'static' | 'moving';
    path?: { x: number; y: number }[];
  }[];
  checkpoints: {
    x: number;
    y: number;
  }[];
  gravity: {
    x: number;
    y: number;
  };
}

export function validateLevel(data: unknown): data is LevelSchema {
  if (typeof data !== 'object' || data === null) return false;

  const level = data as Record<string, unknown>;

  if (typeof level.id !== 'string') return false;
  if (typeof level.name !== 'string') return false;
  if (typeof level.difficulty !== 'number') return false;
  if (typeof level.par !== 'number') return false;
  if (!Array.isArray(level.platforms)) return false;
  if (typeof level.start !== 'object' || level.start === null) return false;
  if (typeof level.end !== 'object' || level.end === null) return false;
  if (!Array.isArray(level.obstacles)) return false;
  if (!Array.isArray(level.checkpoints)) return false;
  if (typeof level.gravity !== 'object' || level.gravity === null) return false;

  return true;
}

export function levelSchemaToLevel(schema: LevelSchema): Level {
  return {
    id: schema.id,
    name: schema.name,
    difficulty: schema.difficulty,
    par: schema.par,
    platforms: schema.platforms,
    start: schema.start,
    end: schema.end,
    obstacles: schema.obstacles,
    checkpoints: schema.checkpoints,
    gravity: schema.gravity,
  };
}
