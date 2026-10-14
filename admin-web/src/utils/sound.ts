/**
 * Synthesizes an emergency chime using Web Audio API
 * No external audio files or network requests required.
 */
export const playEmergencyChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    const playTone = (freq: number, start: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.2, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + duration);
    };

    // Urgent 3-tone clinical alert sequence
    playTone(880, now, 0.15); // A5
    playTone(700, now + 0.18, 0.15); // F5
    playTone(880, now + 0.36, 0.25); // A5
  } catch (error) {
    console.warn('[AUDIO] Failed to play emergency alert chime:', error);
  }
};
