/**
 * Game constants
 */

export const GAME_WIDTH = 1920;
export const GAME_HEIGHT = 1080;

export const COLORS = {
  BACKGROUND: 0x1a1a2e,
  PRIMARY: 0x4a90e2,
  SUCCESS: 0x2ecc71,
  WARNING: 0xf39c12,
  DANGER: 0xe74c3c,
  TEXT: 0xffffff,
  TEXT_DARK: 0x2c3e50,
  PLATFORM: 0x4a4a4a,
  PLATFORM_BOUNCY: 0xff6b6b,
  PLATFORM_STICKY: 0x95e1d3,
  CHECKPOINT: 0xfeca57,
  OBSTACLE: 0xe74c3c,
  PLAYER: 0xffffff,
  START: 0x2ecc71,
  END: 0xe74c3c,
} as const;

export const PHYSICS = {
  DEFAULT_GRAVITY: { x: 0, y: 200 },
  PLAYER_RADIUS: 10,
  MAX_VELOCITY: 1000,
  AIR_RESISTANCE: 0.99,
  BOUNCE_RESTITUTION: 0.6,
  BOUNCY_RESTITUTION: 1.2,
  STICKY_FRICTION: 0.5,
} as const;

export const UI = {
  BUTTON_WIDTH: 200,
  BUTTON_HEIGHT: 60,
  BUTTON_FONT_SIZE: 24,
  TITLE_FONT_SIZE: 48,
  SUBTITLE_FONT_SIZE: 32,
  BODY_FONT_SIZE: 20,
  PANEL_PADDING: 20,
  PANEL_CORNER_RADIUS: 10,
} as const;

export const LEVELS = {
  TOTAL_LEVELS: 20,
  STARS_PER_LEVEL: 3,
} as const;

export const SHOP = {
  STARTING_COINS: 0,
} as const;

export const ASSETS = {
  AUDIO_PATH: '/assets/audio/',
  IMAGE_PATH: '/assets/images/',
  LEVEL_PATH: '/levels/',
} as const;

export const AUDIO = {
  MUSIC_VOLUME: 0.7,
  SFX_VOLUME: 0.8,
} as const;

export const CAMERA = {
  SMOOTHING: 0.1,
  DEADZONE_WIDTH: 200,
  DEADZONE_HEIGHT: 150,
} as const;
