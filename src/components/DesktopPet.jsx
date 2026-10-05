import { useEffect, useRef, useState } from 'react';
import { PET_FRAMES, PET_PALETTE } from './function/petSprites';
import { playBark } from './function/sounds';

// A little dog that wanders along the taskbar, in the spirit of the old
// Windows search dog. Click it to say hi, double-click to send it home,
// type "dog" in Run to bring it back.
const SCALE = 3;
const W = 24 * SCALE;
const H = 16 * SCALE;
const SPEED = 45; // px per second
const HIDE_KEY = 'petHidden';

function drawFrame(canvas, name) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const rows = PET_FRAMES[name];
  const offset = 16 - rows.length; // align feet to the bottom
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const color = PET_PALETTE[row[x]];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(x * SCALE, (y + offset) * SCALE, SCALE, SCALE);
    }
  });
}

function DesktopPet() {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const state = useRef({ x: 120, dir: 1, mode: 'walk', target: 400, until: 0, frame: 0, lastFrame: 0, naps: 0 });
  const [hidden, setHidden] = useState(() => {
    try { return localStorage.getItem(HIDE_KEY) === '1'; } catch { return false; }
  });
  const [bubble, setBubble] = useState('');

  useEffect(() => {
    const toggle = () => setHidden(h => {
      const next = !h;
      try { localStorage.setItem(HIDE_KEY, next ? '1' : '0'); } catch {}
      return next;
    });
    window.addEventListener('win98:dog', toggle);
    return () => window.removeEventListener('win98:dog', toggle);
  }, []);

  useEffect(() => {
    if (hidden) return;
    const s = state.current;
    const still = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const maxX = () => Math.max(0, window.innerWidth - W - 10);
    s.x = Math.min(s.x, maxX());
    let last = performance.now();
    let raf;

    const pickNext = now => {
      const r = Math.random();
      if (still) { s.mode = 'sit'; s.until = now + 60000; return; }
      if (s.mode === 'walk' && r < 0.45) {
        s.mode = 'sit'; s.until = now + 2500 + Math.random() * 3500;
      } else if (s.mode === 'sit' && (s.naps++ > 2 || r < 0.2)) {
        s.mode = 'sleep'; s.naps = 0; s.until = now + 9000 + Math.random() * 8000;
      } else {
        s.mode = 'walk';
        s.target = Math.random() * maxX();
        s.dir = s.target > s.x ? 1 : -1;
      }
    };

    const tick = now => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      let frame = s.mode === 'walk' ? (s.frame ? 'walk2' : 'walk1') : s.mode === 'bark' ? 'sit' : s.mode;
      if (s.mode === 'walk') {
        s.x += s.dir * SPEED * dt;
        if (now - s.lastFrame > 160) { s.frame ^= 1; s.lastFrame = now; }
        if ((s.dir > 0 && s.x >= s.target) || (s.dir < 0 && s.x <= s.target)) pickNext(now);
      } else if (now > s.until) {
        pickNext(now);
      }
      if (canvasRef.current) drawFrame(canvasRef.current, frame);
      if (wrapRef.current) {
        const hop = s.mode === 'bark' ? Math.abs(Math.sin((s.until - now) / 120)) * 10 : 0;
        wrapRef.current.style.transform = `translate(${Math.round(s.x)}px, ${-hop}px)`;
        canvasRef.current.style.transform = `scaleX(${s.dir})`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const onResize = () => { s.x = Math.min(s.x, maxX()); s.target = Math.min(s.target, maxX()); };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, [hidden]);

  useEffect(() => {
    if (!bubble) return;
    const t = setTimeout(() => setBubble(''), 1600);
    return () => clearTimeout(t);
  }, [bubble]);

  if (hidden) return null;

  function pet(e) {
    e.stopPropagation();
    const s = state.current;
    const wasSleeping = s.mode === 'sleep';
    s.mode = 'bark';
    s.until = performance.now() + 1200;
    setBubble(wasSleeping ? 'Huh? Woof!' : ['Woof!', 'Arf arf!', 'Hi there!', '🦴?'][Math.floor(Math.random() * 4)]);
    playBark();
  }

  function sendHome(e) {
    e.stopPropagation();
    setBubble('');
    setHidden(true);
    try { localStorage.setItem(HIDE_KEY, '1'); } catch {}
  }

  return (
    <div className="desktop_pet" ref={wrapRef} onClick={pet} onDoubleClick={sendHome}
      title='Click to say hi. Double-click to send me home (type "dog" in Run to bring me back).'>
      {bubble && <span className="desktop_pet_bubble">{bubble}</span>}
      <canvas ref={canvasRef} width={W} height={H} />
    </div>
  );
}

export default DesktopPet;
