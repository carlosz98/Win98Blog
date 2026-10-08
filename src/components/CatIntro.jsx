// Quick intro played when the taskbar cat banner is clicked:
// paw prints walk up from the banner and "Hi, I'm Mochi" bounces in.
const PAWS = Array.from({ length: 8 }, (_, i) => i);
const TEXT = "Hi, I'm Mochi";

function Paw({ style }) {
  return (
    <svg className="mochi-paw" style={style} viewBox="0 0 64 64" aria-hidden="true">
      <ellipse cx="32" cy="42" rx="14" ry="12" />
      <ellipse cx="14" cy="26" rx="6" ry="8" />
      <ellipse cx="25" cy="16" rx="6" ry="8" />
      <ellipse cx="39" cy="16" rx="6" ry="8" />
      <ellipse cx="50" cy="26" rx="6" ry="8" />
    </svg>
  );
}

function CatIntro({ show }) {
  if (!show) return null;
  return (
    <div className="mochi-intro" aria-live="polite">
      {PAWS.map(i => (
        <Paw key={i} style={{
          right: `${70 + i * 6 + (i % 2 ? 26 : 0)}px`,
          bottom: `${48 + i * 62}px`,
          animationDelay: `${i * 0.11}s`,
          transform: `rotate(${-18 + (i % 2 ? 10 : 0)}deg)`,
        }} />
      ))}
      <div className="mochi-hello">
        {TEXT.split('').map((ch, i) => (
          <span key={i} style={{ animationDelay: `${0.35 + i * 0.05}s` }}>{ch === ' ' ? ' ' : ch}</span>
        ))}
      </div>
    </div>
  );
}

export default CatIntro;
