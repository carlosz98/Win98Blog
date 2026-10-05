// Draws a classic 88x31 web button on a canvas. Used by Cool Sites and to make
// public/carlos88x31.png (the button other sites copy to link back here).
export function drawButton88(ctx, { bg = ['#000080', '#008080'], fg = '#ffffff', accent = '#ffff00', text = '', sub = '', flag = false }) {
  const W = 88, H = 31;
  ctx.clearRect(0, 0, W, H);
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, bg[0]);
  grad.addColorStop(1, bg[1] || bg[0]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
  // Bevel: light top-left, dark bottom-right, black outline.
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.fillRect(1, 1, W - 2, 1);
  ctx.fillRect(1, 1, 1, H - 2);
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.fillRect(1, H - 2, W - 2, 1);
  ctx.fillRect(W - 2, 1, 1, H - 2);
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1;
  ctx.strokeRect(0.5, 0.5, W - 1, H - 1);

  let left = 5;
  if (flag) {
    // Little four-color window flag.
    const x = 5, y = 8, s = 6;
    [['#ff3b30', 0, 0], ['#34c759', s + 1, 0], ['#007aff', 0, s + 1], ['#ffcc00', s + 1, s + 1]].forEach(([c, dx, dy]) => {
      ctx.fillStyle = c;
      ctx.fillRect(x + dx, y + dy, s, s);
    });
    left = 21;
  }
  const mid = left + (W - left - 3) / 2;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.font = `bold ${sub ? 11 : 12}px Tahoma, Verdana, Arial, sans-serif`;
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillText(text, mid + 1, sub ? 15 : 20);
  ctx.fillStyle = fg;
  ctx.fillText(text, mid, sub ? 14 : 19);
  if (sub) {
    ctx.font = '9px Verdana, Tahoma, Arial, sans-serif';
    ctx.fillStyle = accent;
    ctx.fillText(sub, mid, 25);
  }
}
