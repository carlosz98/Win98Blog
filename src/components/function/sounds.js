// Retro system sounds, synthesized with Web Audio so no audio files are needed.
// The mute choice is remembered per browser.
const MUTE_KEY = 'soundMuted';
let ctx = null;
let muted = (() => { try { return localStorage.getItem(MUTE_KEY) === '1'; } catch { return false; } })();

export function isMuted() { return muted; }

export function setMuted(value) {
  muted = value;
  try { localStorage.setItem(MUTE_KEY, value ? '1' : '0'); } catch {}
  window.dispatchEvent(new CustomEvent('win98:mute', { detail: value }));
}

function audio() {
  if (muted) return null;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

// One soft bell-like note.
function note(ac, freq, start, length, volume = 0.12, type = 'sine') {
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(volume, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + length);
  osc.connect(gain).connect(ac.destination);
  osc.start(start);
  osc.stop(start + length + 0.05);
}

export function playStartup() {
  const ac = audio();
  if (!ac) return;
  const t = ac.currentTime + 0.05;
  // A rising major arpeggio that settles on a warm chord.
  [[392, 0], [523.25, 0.18], [659.25, 0.36], [783.99, 0.54]].forEach(([f, d]) => note(ac, f, t + d, 1.6, 0.09));
  [261.63, 392, 523.25, 659.25].forEach(f => note(ac, f, t + 0.8, 2.6, 0.06, 'triangle'));
}

export function playClick() {
  const ac = audio();
  if (!ac) return;
  note(ac, 1800, ac.currentTime, 0.04, 0.05, 'square');
}

export function playOpen() {
  const ac = audio();
  if (!ac) return;
  const t = ac.currentTime;
  note(ac, 880, t, 0.12, 0.06, 'triangle');
  note(ac, 1318.5, t + 0.06, 0.18, 0.05, 'triangle');
}

export function playError() {
  const ac = audio();
  if (!ac) return;
  const t = ac.currentTime;
  note(ac, 659.25, t, 0.5, 0.1, 'triangle');
  note(ac, 523.25, t + 0.12, 0.6, 0.1, 'triangle');
}

export function playShutdown() {
  const ac = audio();
  if (!ac) return;
  const t = ac.currentTime + 0.05;
  [[783.99, 0], [659.25, 0.22], [523.25, 0.44], [392, 0.66]].forEach(([f, d]) => note(ac, f, t + d, 1.4, 0.08));
}

// Plays the startup sound once per visit. Browsers block audio until the
// first click or key press, so if it can't play yet, wait for one.
export function startupOnFirstGesture() {
  let done = false;
  const tryPlay = async () => {
    if (done || muted) return;
    const ac = audio();
    if (!ac) return;
    try { await ac.resume(); } catch {}
    if (ac.state === 'running' && !done) {
      done = true;
      cleanup();
      playStartup();
    }
  };
  const cleanup = () => {
    window.removeEventListener('pointerdown', tryPlay);
    window.removeEventListener('keydown', tryPlay);
  };
  window.addEventListener('pointerdown', tryPlay);
  window.addEventListener('keydown', tryPlay);
  tryPlay();
  return cleanup;
}
