// Lightweight Web Audio chiptune SFX. No assets, no network.

let ctx: AudioContext | null = null;
function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  return ctx;
}

function isMuted(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem("pixelquest-muted") === "1";
}

export function setMuted(muted: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem("pixelquest-muted", muted ? "1" : "0");
}

export function getMuted(): boolean {
  return isMuted();
}

interface ToneOpts {
  freq: number;
  duration: number;
  type?: OscillatorType;
  volume?: number;
  delay?: number;
}

function tone({ freq, duration, type = "square", volume = 0.08, delay = 0 }: ToneOpts) {
  const c = getCtx();
  if (!c || isMuted()) return;
  const t0 = c.currentTime + delay;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(volume, t0 + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(gain).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

function sweep(from: number, to: number, duration: number, volume = 0.08) {
  const c = getCtx();
  if (!c || isMuted()) return;
  const t0 = c.currentTime;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(from, t0);
  osc.frequency.exponentialRampToValueAtTime(to, t0 + duration);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(volume, t0 + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(gain).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

export const sfx = {
  taskComplete() {
    tone({ freq: 660, duration: 0.08 });
    tone({ freq: 880, duration: 0.1, delay: 0.08 });
    tone({ freq: 1320, duration: 0.14, delay: 0.18 });
  },
  levelUp() {
    [523, 659, 784, 1046].forEach((f, i) => tone({ freq: f, duration: 0.16, delay: i * 0.1, volume: 0.1 }));
    sweep(1046, 1568, 0.5, 0.07);
  },
  badge() {
    tone({ freq: 988, duration: 0.1, type: "triangle" });
    tone({ freq: 1318, duration: 0.18, delay: 0.1, type: "triangle" });
  },
  pomodoroStart() {
    tone({ freq: 440, duration: 0.08 });
    tone({ freq: 660, duration: 0.1, delay: 0.08 });
  },
  pomodoroEnd() {
    tone({ freq: 880, duration: 0.12 });
    tone({ freq: 660, duration: 0.12, delay: 0.13 });
    tone({ freq: 880, duration: 0.18, delay: 0.26 });
  },
  click() {
    tone({ freq: 1200, duration: 0.04, volume: 0.04 });
  },
};
