class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;

  constructor() {
    // Lazy initialization on first user interaction
  }

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.08, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.08, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.08, this.ctx.currentTime);
    }
  }

  /**
   * Play a frequency tone based on value and max value
   * @param value Current value
   * @param maxValue Max value in the array
   * @param duration Duration in ms (default 40ms)
   * @param type Waveform type
   */
  public playTone(value: number, maxValue: number, duration: number = 40, type: OscillatorType = 'triangle') {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    try {
      const minFreq = 160;
      const maxFreq = 960;
      const ratio = Math.max(0, Math.min(1, value / (maxValue || 1)));
      const freq = minFreq + Math.pow(ratio, 1.2) * (maxFreq - minFreq);

      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const startTime = this.ctx.currentTime;
      const attack = 0.005;
      const release = duration / 1000;

      noteGain.gain.setValueAtTime(0.0001, startTime);
      noteGain.gain.exponentialRampToValueAtTime(0.6, startTime + attack);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + attack + release);

      osc.connect(noteGain);
      noteGain.connect(this.masterGain);

      osc.start(startTime);
      osc.stop(startTime + attack + release + 0.01);
    } catch {
      // Ignore audio scheduling errors during fast teardown
    }
  }

  /**
   * Play a celebratory arpeggio when algorithm finishes
   */
  public playCompletionFanfare() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [440, 554.37, 659.25, 880]; // A major arpeggio
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx || !this.masterGain || this.isMuted) return;
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        noteGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
        noteGain.gain.exponentialRampToValueAtTime(0.4, this.ctx.currentTime + 0.02);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.25);
        osc.connect(noteGain);
        noteGain.connect(this.masterGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.28);
      }, idx * 60);
    });
  }
}

export const soundEngine = new SoundEngine();
