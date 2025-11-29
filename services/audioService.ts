
// Simple synthesizer for game sound effects
let audioCtx: AudioContext | null = null;

const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

type SoundType = 'flip' | 'match' | 'mismatch' | 'win';

export const playSound = (type: SoundType, isMuted: boolean = false) => {
  if (isMuted) return;

  const ctx = initAudio();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  const now = ctx.currentTime;

  switch (type) {
    case 'flip':
      // Short high tick
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, now);
      oscillator.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
      gainNode.gain.setValueAtTime(0.3, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      oscillator.start(now);
      oscillator.stop(now + 0.1);
      break;

    case 'match':
      // Pleasant chime (Ding-Dong)
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(523.25, now); // C5
      oscillator.frequency.setValueAtTime(659.25, now + 0.1); // E5
      
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.3, now + 0.05);
      gainNode.gain.linearRampToValueAtTime(0.3, now + 0.2);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
      
      oscillator.start(now);
      oscillator.stop(now + 0.6);

      // Harmonics
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1046.50, now); // C6
      gain2.gain.setValueAtTime(0.05, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc2.start(now);
      osc2.stop(now + 0.4);
      break;

    case 'mismatch':
      // Low thud/buzz
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(150, now);
      oscillator.frequency.linearRampToValueAtTime(100, now + 0.15);
      
      gainNode.gain.setValueAtTime(0.2, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      
      oscillator.start(now);
      oscillator.stop(now + 0.2);
      break;

    case 'win':
      // Victory Fanfare (Arpeggio)
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C Major Arpeggio
      const duration = 0.15;
      
      notes.forEach((freq, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        
        o.type = 'square';
        o.frequency.value = freq;
        
        const startTime = now + i * duration;
        g.gain.setValueAtTime(0, startTime);
        g.gain.linearRampToValueAtTime(0.15, startTime + 0.05);
        g.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);
        
        o.start(startTime);
        o.stop(startTime + 0.5);
      });
      break;
  }
};
