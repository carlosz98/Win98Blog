import { useEffect, useRef, useState } from 'react';

// Easter egg: type "matrix" in Run. Any key or click exits.
const CHARS = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉ0123456789CARLOSZ98WIN98';

function MatrixRain() {
  const [active, setActive] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    const start = () => setActive(true);
    window.addEventListener('win98:matrix', start);
    return () => window.removeEventListener('win98:matrix', start);
  }, []);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const size = 16;
    let columns = [];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Array.from({ length: Math.ceil(canvas.width / size) }, () => Math.random() * -50);
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    resize();

    let frame;
    let last = 0;
    function draw(t) {
      frame = requestAnimationFrame(draw);
      if (t - last < 50) return; // ~20fps feels more 1999
      last = t;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${size}px monospace`;
      columns.forEach((y, i) => {
        const ch = CHARS[Math.floor(Math.random() * CHARS.length)];
        ctx.fillStyle = Math.random() > 0.95 ? '#d6ffd6' : '#00ff41';
        ctx.fillText(ch, i * size, y * size);
        columns[i] = y * size > canvas.height && Math.random() > 0.975 ? 0 : y + 1;
      });
    }
    frame = requestAnimationFrame(draw);

    const stop = () => setActive(false);
    // Ignore the Enter that launched it from Run.
    const arm = setTimeout(() => {
      window.addEventListener('keydown', stop);
      window.addEventListener('pointerdown', stop);
    }, 400);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(arm);
      window.removeEventListener('keydown', stop);
      window.removeEventListener('pointerdown', stop);
      window.removeEventListener('resize', resize);
    };
  }, [active]);

  if (!active) return null;
  return (
    <div className="matrix_rain">
      <canvas ref={canvasRef} />
      <p>Wake up, visitor... &nbsp;(press any key)</p>
    </div>
  );
}

export default MatrixRain;
