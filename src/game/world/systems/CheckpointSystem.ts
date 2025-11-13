import type { Checkpoint, Vector2D } from '@types';

export class CheckpointSystem {
  private checkpoints: Checkpoint[] = [];

  constructor(checkpointPositions: Vector2D[]) {
    this.checkpoints = checkpointPositions.map((pos) => ({
      position: pos,
      activated: false,
    }));
  }

  /**
   * Check if player has reached a checkpoint
   */
  public checkCheckpoint(playerPos: Vector2D, playerRadius: number): Checkpoint | null {
    for (const checkpoint of this.checkpoints) {
      if (checkpoint.activated) continue;

      const dx = playerPos.x - checkpoint.position.x;
      const dy = playerPos.y - checkpoint.position.y;
      const distSquared = dx * dx + dy * dy;
      const radiusSum = playerRadius + 25; // checkpoint radius

      if (distSquared < radiusSum * radiusSum) {
        checkpoint.activated = true;
        return checkpoint;
      }
    }
    return null;
  }

  /**
   * Get all checkpoints
   */
  public getCheckpoints(): Checkpoint[] {
    return this.checkpoints;
  }

  /**
   * Get number of activated checkpoints
   */
  public getActivatedCount(): number {
    return this.checkpoints.filter((cp) => cp.activated).length;
  }

  /**
   * Reset all checkpoints
   */
  public reset(): void {
    for (const checkpoint of this.checkpoints) {
      checkpoint.activated = false;
    }
  }

  /**
   * Get last activated checkpoint position
   */
  public getLastActivated(): Vector2D | null {
    for (let i = this.checkpoints.length - 1; i >= 0; i--) {
      const checkpoint = this.checkpoints[i];
      if (checkpoint?.activated) {
        return checkpoint.position;
      }
    }
    return null;
  }
}
