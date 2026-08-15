// Web Audio API for UI sounds - Enhanced with touchgrass character

const createAudioCtx = () => {
  if (typeof window === 'undefined') return null;
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  return new AudioContext();
};

let ctx: AudioContext | null = null;

const resume = async () => {
  if (!ctx) ctx = createAudioCtx();
  if (ctx && ctx.state === 'suspended') {
    await ctx.resume();
  }
  return ctx;
};

// Subtle "pop" for clicks
export const playClickSound = async () => {
  const audio = await resume();
  if (!audio) return;
  
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  const t = audio.currentTime;
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(150 + Math.random() * 50, t);
  osc.frequency.exponentialRampToValueAtTime(80, t + 0.1);
  
  gain.gain.setValueAtTime(0.08, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
  
  osc.connect(gain).connect(audio.destination);
  osc.start(t);
  osc.stop(t + 0.1);
};

// Soft "brush" sound for marker reveals
export const playBrushSound = async () => {
  const audio = await resume();
  if (!audio) return;
  
  const bufferSize = audio.sampleRate * 0.2; // 0.2 seconds
  const buffer = audio.createBuffer(1, bufferSize, audio.sampleRate);
  const data = buffer.getChannelData(0);
  
  // Create noise
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  
  const noise = audio.createBufferSource();
  noise.buffer = buffer;
  
  const filter = audio.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(1200, audio.currentTime);
  filter.frequency.exponentialRampToValueAtTime(800, audio.currentTime + 0.2);
  
  const gain = audio.createGain();
  gain.gain.setValueAtTime(0, audio.currentTime);
  gain.gain.linearRampToValueAtTime(0.03, audio.currentTime + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.2);
  
  noise.connect(filter).connect(gain).connect(audio.destination);
  noise.start();
};

// "Thwack" for landing elements or big buttons
export const playThwackSound = async () => {
  const audio = await resume();
  if (!audio) return;
  
  const t = audio.currentTime;
  
  // Low frequency thud
  const osc1 = audio.createOscillator();
  const gain1 = audio.createGain();
  osc1.type = 'triangle';
  osc1.frequency.setValueAtTime(80, t);
  osc1.frequency.exponentialRampToValueAtTime(20, t + 0.15);
  gain1.gain.setValueAtTime(0.15, t);
  gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
  osc1.connect(gain1).connect(audio.destination);
  
  // High frequency transient (click)
  const osc2 = audio.createOscillator();
  const gain2 = audio.createGain();
  osc2.type = 'square';
  osc2.frequency.setValueAtTime(1200, t);
  osc2.frequency.exponentialRampToValueAtTime(400, t + 0.02);
  gain2.gain.setValueAtTime(0.05, t);
  gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.02);
  osc2.connect(gain2).connect(audio.destination);
  
  osc1.start(t);
  osc2.start(t);
  osc1.stop(t + 0.15);
  osc2.stop(t + 0.15);
};

export const playHoverSound = async () => {
  const audio = await resume();
  if (!audio) return;
  
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  const t = audio.currentTime;
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(400, t);
  osc.frequency.exponentialRampToValueAtTime(450, t + 0.05);
  
  gain.gain.setValueAtTime(0.02, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
  
  osc.connect(gain).connect(audio.destination);
  osc.start(t);
  osc.stop(t + 0.05);
};

// "Rustle" for grass interactions
export const playRustleSound = async () => {
  const audio = await resume();
  if (!audio) return;
  
  const bufferSize = audio.sampleRate * 0.3;
  const buffer = audio.createBuffer(1, bufferSize, audio.sampleRate);
  const data = buffer.getChannelData(0);
  
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  
  const noise = audio.createBufferSource();
  noise.buffer = buffer;
  
  const filter = audio.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1000, audio.currentTime);
  filter.frequency.exponentialRampToValueAtTime(400, audio.currentTime + 0.3);
  
  const gain = audio.createGain();
  gain.gain.setValueAtTime(0, audio.currentTime);
  gain.gain.linearRampToValueAtTime(0.04, audio.currentTime + 0.1);
  gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.3);
  
  noise.connect(filter).connect(gain).connect(audio.destination);
  noise.start();
};
