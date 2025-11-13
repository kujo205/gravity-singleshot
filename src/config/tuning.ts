/**
 * Game tuning parameters - adjust these to fine-tune gameplay
 */

export const TUNING = {
  // Player physics
  player: {
    launchVelocityMultiplier: 2.0,
    maxLaunchDistance: 300,
    minLaunchDistance: 20,
    dragSensitivity: 1.0,
  },

  // Trajectory preview
  trajectory: {
    maxPoints: 100,
    timeStep: 0.05,
    pointRadius: 2,
    pointSpacing: 5,
    alpha: 0.6,
  },

  // Camera
  camera: {
    smoothing: 0.1,
    lookAheadDistance: 100,
    zoomFactor: 1.0,
  },

  // Scoring
  scoring: {
    parMultiplier: 1.0,
    checkpointBonus: 10,
    speedBonus: 50,
    perfectShotBonus: 100,
  },

  // Level generation
  levelGen: {
    minPlatformWidth: 50,
    maxPlatformWidth: 300,
    minPlatformHeight: 20,
    maxPlatformHeight: 40,
    platformDensity: 0.3,
  },

  // Difficulty scaling
  difficulty: {
    gravityScale: [1.0, 1.2, 1.5, 1.8, 2.0],
    obstacleCountMultiplier: [1, 1.5, 2, 2.5, 3],
    platformSizeReduction: [1.0, 0.9, 0.8, 0.7, 0.6],
    parReduction: [1.0, 0.95, 0.9, 0.85, 0.8],
  },

  // UI animations
  ui: {
    buttonHoverScale: 1.05,
    buttonPressScale: 0.95,
    transitionDuration: 0.3,
    fadeInDuration: 0.5,
    fadeOutDuration: 0.3,
  },

  // Effects
  effects: {
    trailLength: 20,
    trailFadeRate: 0.95,
    particleCount: 10,
    explosionRadius: 50,
  },
};

/**
 * Get difficulty multiplier for a specific level
 */
export function getDifficultyMultiplier(level: number): number {
  const index = Math.min(Math.floor(level / 5), TUNING.difficulty.gravityScale.length - 1);
  return TUNING.difficulty.gravityScale[index] ?? 1.0;
}

/**
 * Get par for a level based on difficulty
 */
export function calculatePar(baseShots: number, difficulty: number): number {
  const difficultyIndex = Math.min(difficulty - 1, TUNING.difficulty.parReduction.length - 1);
  const multiplier = TUNING.difficulty.parReduction[difficultyIndex] ?? 1.0;
  return Math.max(1, Math.round(baseShots * multiplier));
}
