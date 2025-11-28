// Advanced synth for UI sounds
const getCtx = () => {
  return typeof window !== 'undefined' ? new (window.AudioContext || (window as any).webkitAudioContext)() : null;
};

// Helper to play a sound
const playOscillator = (
  ctx: AudioContext, 
  freq: number, 
  type: OscillatorType, 
  startTime: number, 
  duration: number, 
  vol: number
) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);
  
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(vol, startTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration);
};

export const playHoverSound = () => {
  const ctx = getCtx();
  if (!ctx) return;
  // Subtle "tick"
  playOscillator(ctx, 400, 'sine', ctx.currentTime, 0.05, 0.02);
};

export const playClickSound = () => {
  const ctx = getCtx();
  if (!ctx) return;
  // Crisp "pop"
  playOscillator(ctx, 600, 'sine', ctx.currentTime, 0.1, 0.05);
};

export const playSuccessSound = () => {
  const ctx = getCtx();
  if (!ctx) return;
  const now = ctx.currentTime;
  // C Major 7 Chord arpeggio (C, E, G, B)
  const notes = [523.25, 659.25, 783.99, 987.77]; 
  
  notes.forEach((freq, i) => {
    playOscillator(ctx, freq, 'sine', now + (i * 0.05), 0.6, 0.1);
  });
};

export const playErrorSound = () => {
  const ctx = getCtx();
  if (!ctx) return;
  const now = ctx.currentTime;
  // Dissonant low thud
  playOscillator(ctx, 150, 'triangle', now, 0.3, 0.2);
  playOscillator(ctx, 140, 'sawtooth', now, 0.3, 0.1);
};
