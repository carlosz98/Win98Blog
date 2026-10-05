import { useEffect, useRef } from 'react';
import { PALETTE } from './function/consoleSprites';

// Draws one console from its pixel rows (see consoleSprites.js).
export default function ConsoleSprite({ rows, scale = 3 }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    rows.forEach((row, y) => [...row].forEach((c, x) => {
      if (!PALETTE[c]) return;
      ctx.fillStyle = PALETTE[c];
      ctx.fillRect(x * scale, y * scale, scale, scale);
    }));
  }, [rows, scale]);
  const width = Math.max(...rows.map(r => r.length));
  return <canvas ref={ref} width={width * scale} height={rows.length * scale} aria-hidden="true" />;
}
