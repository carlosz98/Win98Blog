// 16x14 pixel-art Mochi (grey tabby, green eyes) drawn as SVG squares.
const ROWS = [
  '..K..........K..',
  '.KGK........KGK.',
  '.KPGK......KGPK.',
  '.KGGGKKKKKKGGGK.',
  'KGGDGGDGGDGGDGGK',
  'KGGGGGGGGGGGGGGK',
  'KGGEEGGGGGGEEGGK',
  'KGGEKGGGGGGKEGGK',
  'KDGGGGGLLGGGGGDK',
  'KGGGGGLPPLGGGGGK',
  'KDGGGLLKKLLGGGDK',
  '.KGGGGLLLLGGGGK.',
  '..KKGGGGGGGGKK..',
  '....KKKKKKKK....',
];
const COLORS = { K: '#1e1d1d', G: '#8c8c8c', D: '#5c5c5c', L: '#d4d4d4', E: '#7fc93a', P: '#e98ca2' };

export default function PixelMochi({ size = 22, className }) {
  return (
    <svg className={className} width={size * 16 / 14} height={size} viewBox="0 0 16 14"
      shapeRendering="crispEdges" aria-hidden="true">
      {ROWS.flatMap((row, y) => row.split('').map((c, x) =>
        COLORS[c] ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={COLORS[c]} /> : null
      ))}
    </svg>
  );
}
