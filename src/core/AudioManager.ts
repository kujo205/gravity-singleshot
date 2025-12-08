export type SoundType = 'click' | 'bright' | 'pleasant' | 'dramatic' | 'soft';

/**
 * Simple Audio Manager for UI sounds
 */
class AudioManager {
  private audioContext: AudioContext | null = null;
  private enabled = true;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  /**
   * Play a sound by type
   */
  playSound(type: SoundType = 'click'): void {
    if (!this.enabled || !this.audioContext) return;

    const ctx = this.audioContext;
    const currentTime = ctx.currentTime;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Different sounds for different types
    switch (type) {
      case 'bright':
        // Bright, ascending click
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(1200, currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1400, currentTime + 0.03);
        gainNode.gain.setValueAtTime(0.2, currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.06);
        oscillator.start(currentTime);
        oscillator.stop(currentTime + 0.06);
        break;

      case 'pleasant':
        // Pleasant, higher pitched
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(1500, currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, currentTime + 0.04);
        gainNode.gain.setValueAtTime(0.18, currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.07);
        oscillator.start(currentTime);
        oscillator.stop(currentTime + 0.07);
        break;

      case 'dramatic':
        // Lower, more dramatic
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(800, currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(600, currentTime + 0.04);
        gainNode.gain.setValueAtTime(0.12, currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.08);
        oscillator.start(currentTime);
        oscillator.stop(currentTime + 0.08);
        break;

      case 'soft':
        // Subtle, soft click
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(900, currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(700, currentTime + 0.02);
        gainNode.gain.setValueAtTime(0.1, currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.04);
        oscillator.start(currentTime);
        oscillator.stop(currentTime + 0.04);
        break;

      case 'click':
      default:
        // Standard click sound
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(1200, currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, currentTime + 0.02);
        gainNode.gain.setValueAtTime(0.15, currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.05);
        oscillator.start(currentTime);
        oscillator.stop(currentTime + 0.05);
        break;
    }
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }
}

export const audioManager = new AudioManager();
