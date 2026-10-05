// A slow, dreamy vaporwave loop made with Web Audio, so no song file (or license) is needed.
// Detuned pads through a lowpass, a mellow electric-piano melody, soft drums, lots of echo.
import { isMuted } from './sounds';

const BPM = 72;
const BEAT = 60 / BPM;
const BAR = BEAT * 4;
// Fmaj7, Em7, Dm7, Cmaj7: the classic "mall at midnight" progression.
const CHORDS = [
  [174.61, 220.0, 261.63, 329.63],
  [164.81, 196.0, 246.94, 293.66],
  [146.83, 174.61, 220.0, 261.63],
  [130.81, 164.81, 196.0, 246.94],
];
const BASS = [87.31, 82.41, 73.42, 65.41];
// Melody per bar as [beat, frequency, length in beats].
const MELODY = [
  [[0, 659.25, 1.5], [1.5, 587.33, 0.5], [2, 523.25, 2]],
  [[0, 493.88, 1], [1, 587.33, 1], [2, 659.25, 2]],
  [[0, 698.46, 1.5], [1.5, 659.25, 0.5], [2, 587.33, 1], [3, 523.25, 1]],
  [[0, 493.88, 3], [3, 392.0, 1]],
];

let ac = null;
let master = null;
let timer = null;
let nextBar = 0;
let barIndex = 0;

function makeReverb(ctx) {
  const len = ctx.sampleRate * 3;
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.5);
  }
  const conv = ctx.createConvolver();
  conv.buffer = buf;
  return conv;
}

function setup() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return false;
  ac = new AC();
  master = ac.createGain();
  master.gain.value = 0;
  const lowpass = ac.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.value = 2400;
  const reverb = makeReverb(ac);
  const wet = ac.createGain();
  wet.gain.value = 0.55;
  const delay = ac.createDelay(2);
  delay.delayTime.value = BEAT * 0.75;
  const feedback = ac.createGain();
  feedback.gain.value = 0.35;
  master.connect(lowpass);
  lowpass.connect(ac.destination);
  lowpass.connect(reverb).connect(wet).connect(ac.destination);
  lowpass.connect(delay);
  delay.connect(feedback).connect(delay);
  delay.connect(wet);
  return true;
}

function tone(freq, start, length, { type = 'sine', volume = 0.1, attack = 0.02, detune = 0 } = {}) {
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  osc.detune.value = detune;
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(volume, start + attack);
  gain.gain.setTargetAtTime(0, start + length * 0.7, length * 0.25);
  osc.connect(gain).connect(master);
  osc.start(start);
  osc.stop(start + length + 1);
}

function noiseHit(start, { volume = 0.08, freq = 1800, length = 0.25 } = {}) {
  const len = Math.floor(ac.sampleRate * length);
  const buf = ac.createBuffer(1, len, ac.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = ac.createBufferSource();
  src.buffer = buf;
  const bp = ac.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = freq;
  const gain = ac.createGain();
  gain.gain.value = volume;
  src.connect(bp).connect(gain).connect(master);
  src.start(start);
}

function kick(start) {
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.frequency.setValueAtTime(120, start);
  osc.frequency.exponentialRampToValueAtTime(40, start + 0.25);
  gain.gain.setValueAtTime(0.35, start);
  gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);
  osc.connect(gain).connect(master);
  osc.start(start);
  osc.stop(start + 0.5);
}

function scheduleBar(t, i) {
  const chord = CHORDS[i % 4];
  // Warm detuned pad.
  chord.forEach(f => {
    tone(f, t, BAR, { type: 'sawtooth', volume: 0.025, attack: 0.6, detune: -12 });
    tone(f, t, BAR, { type: 'sawtooth', volume: 0.025, attack: 0.6, detune: 12 });
  });
  tone(BASS[i % 4], t, BAR * 0.9, { type: 'triangle', volume: 0.16, attack: 0.05 });
  // Electric-piano melody (sine plus a quiet octave for the bell sound).
  MELODY[i % 4].forEach(([beat, f, len]) => {
    const s = t + beat * BEAT;
    tone(f, s, len * BEAT, { volume: 0.07, attack: 0.01 });
    tone(f * 2, s, len * BEAT * 0.5, { volume: 0.015, attack: 0.005 });
  });
  // Lazy drums: kick on 1 and 3, a gated snare on 2 and 4, soft hats.
  [0, 2].forEach(b => kick(t + b * BEAT));
  [1, 3].forEach(b => noiseHit(t + b * BEAT, { volume: 0.12, freq: 1500, length: 0.3 }));
  for (let h = 0; h < 8; h++) noiseHit(t + h * BEAT * 0.5 + BEAT * 0.25, { volume: 0.02, freq: 8000, length: 0.05 });
}

function tick() {
  while (nextBar < ac.currentTime + BAR) {
    scheduleBar(nextBar, barIndex);
    nextBar += BAR;
    barIndex++;
  }
}

export function startVaporwave() {
  if (isMuted()) return false;
  if (!ac && !setup()) return false;
  if (ac.state === 'suspended') ac.resume().catch(() => {});
  if (timer) return true;
  nextBar = ac.currentTime + 0.1;
  barIndex = 0;
  master.gain.cancelScheduledValues(ac.currentTime);
  master.gain.setValueAtTime(master.gain.value, ac.currentTime);
  master.gain.linearRampToValueAtTime(0.9, ac.currentTime + 2);
  tick();
  timer = setInterval(tick, 500);
  return true;
}

export function stopVaporwave() {
  if (!ac || !timer) return;
  clearInterval(timer);
  timer = null;
  const now = ac.currentTime;
  master.gain.cancelScheduledValues(now);
  master.gain.setValueAtTime(master.gain.value, now);
  master.gain.linearRampToValueAtTime(0, now + 1.2);
  // Let the fade finish, then silence everything already scheduled.
  setTimeout(() => {
    if (timer || !ac) return;
    ac.close().catch(() => {});
    ac = null;
    master = null;
  }, 1500);
}
