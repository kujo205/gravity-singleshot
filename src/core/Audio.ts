export interface AudioOptions {
  volume?: number;
  loop?: boolean;
}

export class Audio {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private musicVolume = 0.7;
  private sfxVolume = 0.8;
  private muted = false;
  private currentMusic: HTMLAudioElement | null = null;

  /**
   * Load a sound file
   */
  public load(key: string, path: string): void {
    const audio = new window.Audio(path);
    audio.preload = 'auto';
    this.sounds.set(key, audio);
  }

  /**
   * Play a sound effect
   */
  public playSfx(key: string, options: AudioOptions = {}): void {
    const sound = this.sounds.get(key);
    if (!sound) {
      console.warn(`Sound "${key}" not found`);
      return;
    }

    const clone = sound.cloneNode() as HTMLAudioElement;
    clone.volume = this.muted ? 0 : (options.volume ?? this.sfxVolume);
    clone.loop = options.loop ?? false;

    clone.play().catch((error) => {
      console.warn(`Failed to play sound "${key}":`, error);
    });
  }

  /**
   * Play background music
   */
  public playMusic(key: string, options: AudioOptions = {}): void {
    const sound = this.sounds.get(key);
    if (!sound) {
      console.warn(`Music "${key}" not found`);
      return;
    }

    if (this.currentMusic) {
      this.currentMusic.pause();
      this.currentMusic.currentTime = 0;
    }

    this.currentMusic = sound;
    this.currentMusic.volume = this.muted ? 0 : (options.volume ?? this.musicVolume);
    this.currentMusic.loop = options.loop ?? true;

    this.currentMusic.play().catch((error) => {
      console.warn(`Failed to play music "${key}":`, error);
    });
  }

  /**
   * Stop current music
   */
  public stopMusic(): void {
    if (this.currentMusic) {
      this.currentMusic.pause();
      this.currentMusic.currentTime = 0;
      this.currentMusic = null;
    }
  }

  /**
   * Set music volume
   */
  public setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.currentMusic) {
      this.currentMusic.volume = this.muted ? 0 : this.musicVolume;
    }
  }

  /**
   * Set SFX volume
   */
  public setSfxVolume(volume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Mute/unmute all audio
   */
  public setMuted(muted: boolean): void {
    this.muted = muted;
    if (this.currentMusic) {
      this.currentMusic.volume = muted ? 0 : this.musicVolume;
    }
  }

  /**
   * Get muted state
   */
  public isMuted(): boolean {
    return this.muted;
  }
}
