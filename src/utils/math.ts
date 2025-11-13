import type { Vector2D } from '@types';

/**
 * Calculate distance between two points
 */
export function distance(p1: Vector2D, p2: Vector2D): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate angle between two points in radians
 */
export function angle(p1: Vector2D, p2: Vector2D): number {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}

/**
 * Normalize a vector
 */
export function normalize(v: Vector2D): Vector2D {
  const len = Math.sqrt(v.x * v.x + v.y * v.y);
  if (len === 0) return { x: 0, y: 0 };
  return { x: v.x / len, y: v.y / len };
}

/**
 * Dot product of two vectors
 */
export function dot(v1: Vector2D, v2: Vector2D): number {
  return v1.x * v2.x + v1.y * v2.y;
}

/**
 * Scale a vector by a scalar
 */
export function scale(v: Vector2D, scalar: number): Vector2D {
  return { x: v.x * scalar, y: v.y * scalar };
}

/**
 * Add two vectors
 */
export function add(v1: Vector2D, v2: Vector2D): Vector2D {
  return { x: v1.x + v2.x, y: v1.y + v2.y };
}

/**
 * Subtract two vectors
 */
export function subtract(v1: Vector2D, v2: Vector2D): Vector2D {
  return { x: v1.x - v2.x, y: v1.y - v2.y };
}

/**
 * Linear interpolation between two values
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Map a value from one range to another
 */
export function map(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

/**
 * Check if two rectangles overlap
 */
export function rectOverlap(
  x1: number,
  y1: number,
  w1: number,
  h1: number,
  x2: number,
  y2: number,
  w2: number,
  h2: number
): boolean {
  return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
}

/**
 * Convert degrees to radians
 */
export function degToRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Convert radians to degrees
 */
export function radToDeg(radians: number): number {
  return (radians * 180) / Math.PI;
}

/**
 * Get magnitude of a vector
 */
export function magnitude(v: Vector2D): number {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

/**
 * Rotate a point around another point
 */
export function rotatePoint(point: Vector2D, center: Vector2D, angleRad: number): Vector2D {
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);
  const dx = point.x - center.x;
  const dy = point.y - center.y;

  return {
    x: cos * dx - sin * dy + center.x,
    y: sin * dx + cos * dy + center.y,
  };
}
