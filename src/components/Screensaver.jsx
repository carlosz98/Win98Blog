import { useEffect, useRef, useState } from 'react';

// Classic screensavers. Starts after the visitor is idle for IDLE_MS,
// or right away when "screensaver" is typed in Run. Any input exits.
const IDLE_MS = 2 * 60 * 1000;
const MODES = ['starfield', 'pipes', 'flyingWindows'];

function drawFlag(ctx, x, y, s, alpha) {
  // A small four-color waving flag in the style of the old Windows logo.
  const colors = ['#f25022', '#7fba00', '#00a4ef', '#ffb900'];
  ctx.globalAlpha = alpha;
  const w = s / 2 - s * 0.04;
  [[0, 0], [1, 0], [0, 1], [1, 1]].forEach(([cx, cy], i) => {
    ctx.fillStyle = colors[i];
    const ox = x - s / 2 + cx * (s / 2) + cy * s * 0.04;
    const oy = y - s / 2 + cy * (s / 2) - cx * s * 0.06;
    ctx.fillRect(ox, oy, w, w);
  });
  ctx.globalAlpha = 1;
}

function startStarfield(ctx, W, H) {
  const stars = Array.from({ length: 400 }, () => ({ x: (Math.random() - 0.5) * W, y: (Math.random() - 0.5) * H, z: Math.random() * W }));
  return () => {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);
    stars.forEach(st => {
      st.z -= 6;
      if (st.z <= 1) { st.x = (Math.random() - 0.5) * W; st.y = (Math.random() - 0.5) * H; st.z = W; }
      const k = 160 / st.z;
      const px = st.x * k + W / 2, py = st.y * k + H / 2;
      if (px < 0 || px > W || py < 0 || py > H) return;
      const r = Math.max(0.5, (1 - st.z / W) * 2.6);
      const c = Math.floor(255 * (1 - st.z / W) + 60);
      ctx.fillStyle = `rgb(${c},${c},${c})`;
      ctx.fillRect(px, py, r, r);
    });
  };
}

function startFlyingWindows(ctx, W, H) {
  const flags = Array.from({ length: 40 }, () => ({ x: (Math.random() - 0.5) * W, y: (Math.random() - 0.5) * H, z: Math.random() * W }));
  return () => {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);
    flags.sort((a, b) => b.z - a.z).forEach(f => {
      f.z -= 4;
      if (f.z <= 1) { f.x = (Math.random() - 0.5) * W; f.y = (Math.random() - 0.5) * H; f.z = W; }
      const k = 200 / f.z;
      drawFlag(ctx, f.x * k + W / 2, f.y * k + H / 2, 22 * k * 3, Math.min(1, (1 - f.z / W) * 2));
    });
  };
}

function startPipes(ctx, W, H) {
  const CELL = 26;
  const cols = Math.ceil(W / CELL), rows = Math.ceil(H / CELL);
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  let pipes = [], used = new Set(), steps = 0;
  const newPipe = () => ({
    x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows),
    d: dirs[Math.floor(Math.random() * 4)],
    hue: Math.floor(Math.random() * 360),
  });
  function reset() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);
    pipes = [newPipe(), newPipe()];
    used = new Set();
    steps = 0;
  }
  function segment(p, x2, y2) {
    const x1 = p.x * CELL + CELL / 2, y1 = p.y * CELL + CELL / 2;
    const ex = x2 * CELL + CELL / 2, ey = y2 * CELL + CELL / 2;
    const horiz = y1 === ey;
    const g = horiz ? ctx.createLinearGradient(0, y1 - 8, 0, y1 + 8) : ctx.createLinearGradient(x1 - 8, 0, x1 + 8, 0);
    g.addColorStop(0, `hsl(${p.hue},70%,22%)`);
    g.addColorStop(0.4, `hsl(${p.hue},80%,70%)`);
    g.addColorStop(1, `hsl(${p.hue},70%,18%)`);
    ctx.strokeStyle = g;
    ctx.lineWidth = 14;
    ctx.lineCap = 'butt';
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(ex, ey); ctx.stroke();
  }
  function joint(p) {
    const cx = p.x * CELL + CELL / 2, cy = p.y * CELL + CELL / 2;
    const g = ctx.createRadialGradient(cx - 3, cy - 3, 1, cx, cy, 10);
    g.addColorStop(0, `hsl(${p.hue},80%,80%)`);
    g.addColorStop(1, `hsl(${p.hue},70%,20%)`);
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(cx, cy, 9, 0, Math.PI * 2); ctx.fill();
  }
  reset();
  let tick = 0;
  return () => {
    if (++tick % 2) return;
    if (steps > 900) reset();
    pipes.forEach((p, i) => {
      steps++;
      if (Math.random() < 0.2) { p.d = dirs[Math.floor(Math.random() * 4)]; joint(p); }
      const nx = p.x + p.d[0], ny = p.y + p.d[1];
      if (nx < 0 || ny < 0 || nx >= cols || ny >= rows || used.has(nx + ',' + ny)) {
        joint(p);
        const free = dirs.filter(d => {
          const fx = p.x + d[0], fy = p.y + d[1];
          return fx >= 0 && fy >= 0 && fx < cols && fy < rows && !used.has(fx + ',' + fy);
        });
        if (free.length) p.d = free[Math.floor(Math.random() * free.length)];
        else pipes[i] = newPipe();
        return;
      }
      segment(p, nx, ny);
      used.add(nx + ',' + ny);
      p.x = nx; p.y = ny;
    });
    if (pipes.length < 4 && Math.random() < 0.004) pipes.push(newPipe());
  };
}

const STARTERS = { starfield: startStarfield, pipes: startPipes, flyingWindows: startFlyingWindows };

function Screensaver() {
  const [mode, setMode] = useState(null);
  const canvasRef = useRef(null);
  const lastModeRef = useRef(null);

  // Idle timer.
  useEffect(() => {
    let timer;
    const pick = () => {
      const options = MODES.filter(m => m !== lastModeRef.current);
      const next = options[Math.floor(Math.random() * options.length)];
      lastModeRef.current = next;
      setMode(next);
    };
    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(function check() {
        // Someone reading a site inside the IE window sends no events to this page.
        if (document.activeElement?.tagName === 'IFRAME' || document.hidden) {
          timer = setTimeout(check, IDLE_MS);
          return;
        }
        pick();
      }, IDLE_MS);
    };
    const now = () => pick();
    const events = ['pointermove', 'pointerdown', 'keydown', 'wheel', 'touchstart'];
    events.forEach(ev => window.addEventListener(ev, reset, { passive: true }));
    window.addEventListener('win98:screensaver', now);
    reset();
    return () => {
      clearTimeout(timer);
      events.forEach(ev => window.removeEventListener(ev, reset));
      window.removeEventListener('win98:screensaver', now);
    };
  }, []);

  // Animation and exit.
  useEffect(() => {
    if (!mode) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const step = STARTERS[mode](ctx, canvas.width, canvas.height);
    let frame;
    const loop = () => { step(); frame = requestAnimationFrame(loop); };
    frame = requestAnimationFrame(loop);

    let origin = null;
    const stop = () => setMode(null);
    const onMove = e => {
      // Ignore tiny jitters, like real screensavers do.
      if (!origin) { origin = [e.clientX, e.clientY]; return; }
      if (Math.abs(e.clientX - origin[0]) + Math.abs(e.clientY - origin[1]) > 12) stop();
    };
    const arm = setTimeout(() => {
      window.addEventListener('keydown', stop);
      window.addEventListener('pointerdown', stop);
      window.addEventListener('touchstart', stop);
      window.addEventListener('pointermove', onMove);
    }, 500);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(arm);
      window.removeEventListener('keydown', stop);
      window.removeEventListener('pointerdown', stop);
      window.removeEventListener('touchstart', stop);
      window.removeEventListener('pointermove', onMove);
    };
  }, [mode]);

  if (!mode) return null;
  return (
    <div className="screensaver" data-mode={mode}>
      <canvas ref={canvasRef} />
    </div>
  );
}

export default Screensaver;
