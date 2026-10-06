import { useContext, useEffect, useRef, useState } from 'react';
import UseContext from '../Context';
import Draggable from 'react-draggable';
import magIcon from '../assets/magazine.png';
import deskScene from '../assets/magazine_desk.png';
import { isMuted } from './function/sounds';
import '../css/DevFeed.css';
import '../css/Magazine.css';

// A 3D page-flip magazine of the retro game x soda posters Carlos collected.
const BASE = import.meta.env.BASE_URL;
const POSTERS = Array.from({ length: 24 }, (_, i) => `${BASE}magazine/${String(i + 1).padStart(2, '0')}.jpg`);
const CREDIT = 'Art: @mamonoworld';

// Every face of the magazine, in reading order. Two faces make one leaf.
const FACES = [
  { kind: 'cover' },
  { kind: 'letter' },
  ...POSTERS.map((src, i) => ({ kind: 'poster', src, n: i + 1 })),
  { kind: 'credits' },
  { kind: 'back' },
];
const LEAVES = FACES.length / 2;
const FLIP_MS = 950;
const RIFFLE_FLIP_MS = 460;
const RIFFLE_GAP = 85;
const STRIPS = 12; // a turning page is drawn as 12 hinged strips so it can bend like paper

// The desk picture is 438x244; the magazine lying on it sits around this point.
const IMG_W = 438, IMG_H = 244;
const SPOT = { x: 148, y: 213, w: 78 };

// Scene size and where the desk magazine lands inside it (background is "cover" fitted).
function layout() {
  const vw = window.innerWidth, vh = window.innerHeight;
  const mobile = vw <= 500;
  const W = mobile ? vw - 8 : Math.min(880, vw - 8);
  const H = mobile ? Math.min(560, Math.round(vh * 0.72)) : Math.round(W / (IMG_W / IMG_H));
  const posX = mobile ? 0.3 : 0.5;
  const sc = Math.max(W / IMG_W, H / IMG_H);
  const ox = (W - IMG_W * sc) * posX, oy = H - IMG_H * sc;
  const pw = Math.floor(Math.min((W - 24) / 2, (H - 70) * 0.762));
  return {
    mobile, W, H, pw, bgPos: `${posX * 100}% 100%`,
    spotX: ox + SPOT.x * sc, spotY: oy + SPOT.y * sc, spotW: SPOT.w * sc,
  };
}


function pageTurnSound() {
  if (isMuted()) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const len = Math.floor(ctx.sampleRate * 0.35);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      const t = i / len;
      d[i] = (Math.random() * 2 - 1) * Math.sin(Math.PI * t) * (0.6 + 0.4 * Math.sin(t * 40));
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 2400;
    bp.Q.value = 0.7;
    const g = ctx.createGain();
    g.gain.value = 0.25;
    src.connect(bp).connect(g).connect(ctx.destination);
    src.start();
    src.onended = () => ctx.close();
  } catch { /* no audio */ }
}

const HEADLINE = 'SODA WARS! GAMES x DRINKS';

function Face({ face, side, flat, onZoom }) {
  const cls = `mag-face mag-side-${side} mag-kind-${face.kind}${flat ? ' mag-flat' : ''}`;
  if (face.kind === 'cover') {
    return (
      <div className={cls}>
        <img className="mag-cover-art" src={POSTERS[15]} alt="" draggable="false" />
        <div className="mag-platforms">PLAYSTATION 2 · XBOX · GAMECUBE · PC</div>
        <div className="mag-masthead"><i>CARLOS</i><b>MONTHLY</b></div>
        <div className="mag-issue">VOL. 1 · ISSUE 01 · OCT 2026 · $5.99</div>
        <div className="mag-headline">{HEADLINE}</div>
        <div className="mag-burst"><span>24<br />POSTERS<br />INSIDE!</span></div>
        <div className="mag-disc"><span>FREE<br />DEMO<br />DISC</span></div>
        <div className="mag-cover-lines">
          <p><b>EXCLUSIVE</b> Darkstalkers special</p>
          <p><b>REVIEWED</b> Crash Team Racing</p>
          <p><b>+ CHEATS</b> &amp; secret codes</p>
        </div>
        <div className="mag-barcode" />
      </div>
    );
  }
  if (face.kind === 'letter') {
    return (
      <div className={cls}>
        <div className="mag-press">PRESS START</div>
        <h2>EDITOR'S LETTER</h2>
        <div className="mag-cols">
          <p>Welcome to the very first issue of <b>Carlos Monthly</b>!</p>
          <p>This one is all about the posters I love: classic game heroes teamed up with the sodas and snacks of the era.</p>
          <p>Click or swipe a page to turn it. Hit the 🔍 to see a poster up close.</p>
          <p className="mag-sign">– Carlos, Editor in Chief</p>
        </div>
        <div className="mag-toc">
          <h3>IN THIS ISSUE</h3>
          <span className="t1">Fighters</span><span>Tekken, Capcom</span>
          <span className="t2">Legends</span><span>Crash, Banjo, Pikachu</span>
          <span className="t3">After dark</span><span>Darkstalkers</span>
          <span className="t4">Credits</span><span>back page</span>
        </div>
        <div className="mag-thumbs">
          {[2, 6, 11, 21].map(n => <img key={n} src={POSTERS[n]} alt="" draggable="false" />)}
        </div>
      </div>
    );
  }
  if (face.kind === 'credits') {
    return (
      <div className={cls}>
        <div className="mag-press">GAME OVER?</div>
        <h2>CREDITS</h2>
        <p>All poster art in this issue is by <b>@mamonoworld</b> on TikTok. Go follow them!</p>
        <p>Game characters and drink brands belong to their owners. This is a fan magazine, not an ad.</p>
        <div className="mag-continue">CONTINUE? <span>9</span></div>
        <p className="mag-sign">See you next issue.</p>
      </div>
    );
  }
  if (face.kind === 'back') {
    return (
      <div className={cls}>
        <div className="mag-ad-top">COMING SOON</div>
        <div className="mag-back-logo">CARLOS<span>98</span></div>
        <p>The portfolio you can play.</p>
        <p className="mag-back-small">Available now on the World Wide Web</p>
        <div className="mag-rating"><b>C</b><span>RATED C<br />FOR CARLOS</span></div>
        <div className="mag-barcode" />
      </div>
    );
  }
  return (
    <div className={cls}>
      <img src={face.src} alt={`Poster ${face.n}`} draggable="false" />
      <span className="mag-credit">{CREDIT}</span>
      <span className="mag-num">{face.n}</span>
      <button className="mag-zoom" title="View big"
        onClick={(e) => { e.stopPropagation(); onZoom(face.src); }}>🔍</button>
    </div>
  );
}

// A page in mid-turn: hinged strips, each bent a little more, so the paper curls.
function BendyLeaf({ i, angle, curl, dir, pw, z, onZoom }) {
  const w = pw / STRIPS;
  const d = dir * curl / STRIPS;
  const base = angle - dir * curl / 2;
  let child = null;
  for (let k = STRIPS - 1; k >= 0; k--) {
    const shade = Math.min(0.5, Math.abs(Math.sin((k * d) * Math.PI / 180)) * 0.9);
    child = (
      <div className="mag-strip" key={k}
        style={{ left: k === 0 ? 0 : w, width: w, transform: k === 0 ? 'none' : `rotateY(${d}deg)` }}>
        <div className="mag-slice">
          <div className="mag-slice-inner" style={{ left: -k * w, width: pw }}>
            <Face face={FACES[i * 2]} side="front" flat onZoom={onZoom} />
          </div>
          <div className="mag-slice-shade" style={{ opacity: shade }} />
        </div>
        <div className="mag-slice mag-slice-back">
          <div className="mag-slice-inner" style={{ left: -(pw - (k + 1) * w), width: pw }}>
            <Face face={FACES[i * 2 + 1]} side="back" flat onZoom={onZoom} />
          </div>
          <div className="mag-slice-shade" style={{ opacity: shade }} />
        </div>
        {child}
      </div>
    );
  }
  return (
    <div className="mag-leaf mag-leaf-bendy" style={{ zIndex: z, transform: `rotateY(${base}deg)` }}>
      {child}
    </div>
  );
}

const ease = t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

export default function Magazine({ show, setShow }) {
  const { themeDragBar } = useContext(UseContext);
  const [flipped, setFlipped] = useState(0);
  const [zoom, setZoom] = useState(null);
  // desk → flying → riffle → open → (closing → landing → desk)
  const [stage, setStage] = useState('desk');
  const [L, setL] = useState(layout);
  const [, setFrame] = useState(0);
  const anims = useRef(new Map()); // leaf → { from, to, start, dur, curl, order }
  const raf = useRef(0);
  const order = useRef(0);
  const touch = useRef(null);
  const timers = useRef([]);

  const later = (fn, ms) => { timers.current.push(setTimeout(fn, ms)); };
  const clearAll = () => {
    timers.current.forEach(clearTimeout); timers.current = [];
    anims.current.clear(); cancelAnimationFrame(raf.current); raf.current = 0;
  };

  function loop() {
    const now = performance.now();
    for (const [i, a] of anims.current) if (now - a.start >= a.dur) anims.current.delete(i);
    setFrame(f => f + 1);
    raf.current = anims.current.size ? requestAnimationFrame(loop) : 0;
  }
  function turn(i, forward, dur, curl) {
    anims.current.set(i, { from: forward ? 0 : -180, to: forward ? -180 : 0, start: performance.now(), dur, curl, order: ++order.current });
    if (!raf.current) raf.current = requestAnimationFrame(loop);
  }

  useEffect(() => {
    const onResize = () => setL(layout());
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('resize', onResize); clearAll(); };
  }, []);

  useEffect(() => {
    if (show) return;
    clearAll();
    setStage('desk'); setFlipped(0); setZoom(null);
  }, [show]);

  function go(dir) {
    if (stage !== 'open') return;
    const next = flipped + dir;
    if (next < 0 || next > LEAVES) return;
    turn(dir > 0 ? flipped : next, dir > 0, FLIP_MS, 95);
    setFlipped(next);
    pageTurnSound();
  }

  // Pick it up: fly to the center, riffle to the back, then riffle from the last page to the first.
  function pickUp() {
    if (stage !== 'desk') return;
    clearAll();
    setStage('flying');
    let t = 1000;
    later(() => setStage('riffle'), t);
    for (let i = 0; i < LEAVES; i++) {
      later(() => { turn(i, true, RIFFLE_FLIP_MS, 70); setFlipped(i + 1); if (i % 4 === 0) pageTurnSound(); }, t + i * RIFFLE_GAP);
    }
    t += LEAVES * RIFFLE_GAP + RIFFLE_FLIP_MS + 150;
    for (let i = LEAVES - 1; i >= 1; i--) {
      const k = LEAVES - 1 - i;
      later(() => { turn(i, false, RIFFLE_FLIP_MS, 70); setFlipped(i); if (k % 4 === 0) pageTurnSound(); }, t + k * RIFFLE_GAP);
    }
    t += (LEAVES - 1) * RIFFLE_GAP + RIFFLE_FLIP_MS + 100;
    later(() => setStage('open'), t);
  }

  // Close it and put it back where it was on the desk.
  function putBack() {
    if (stage !== 'open') return;
    clearAll();
    setStage('closing');
    const n = flipped;
    for (let i = n - 1; i >= 0; i--) {
      const k = n - 1 - i;
      later(() => { turn(i, false, RIFFLE_FLIP_MS, 70); setFlipped(i); if (k % 4 === 0) pageTurnSound(); }, k * RIFFLE_GAP);
    }
    const t = n * RIFFLE_GAP + RIFFLE_FLIP_MS;
    later(() => setStage('landing'), t);
    later(() => setStage('desk'), t + 1000);
  }

  useEffect(() => {
    if (!show) return;
    function onKey(e) {
      if (zoom) { if (e.key === 'Escape') setZoom(null); return; }
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'Escape') putBack();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!show) return null;

  const onDesk = stage === 'desk' || stage === 'landing';
  const closed = flipped === 0 ? 'closed-front' : flipped === LEAVES ? 'closed-back' : '';
  const nums = [FACES[flipped * 2 - 1], FACES[flipped * 2]].filter(f => f && f.n).map(f => f.n);
  const pageLabel = flipped === 0 ? 'Cover'
    : flipped === LEAVES ? 'Back cover'
      : nums.length ? `Page ${nums.join('–')} of 24` : flipped === 1 ? "Editor's letter" : 'Credits';

  // The holder sits at the scene's center; on the desk it is moved, laid flat and shrunk onto the spot.
  const k = L.spotW / L.pw;
  const deskTf = `translate(${L.spotX - L.W / 2}px, ${L.spotY - L.H / 2}px) rotateX(74deg) rotateZ(-22deg) scale(${k})`;
  const now = performance.now();

  return (
    <Draggable handle=".df-dragbar" bounds={{ top: 0 }}
      defaultPosition={{ x: L.mobile ? 4 : Math.max(4, (window.innerWidth - L.W) / 2 - 40), y: L.mobile ? 40 : 30 }}>
      <div className="df-window mag-window" style={{ zIndex: 9999, '--pw': `${L.pw}px`, width: L.W + 8 }}>
        <div className="df-dragbar" style={{ background: themeDragBar }}>
          <div className="df-barname">
            <img src={magIcon} alt="" />
            <span>Carlos Monthly - Issue #1</span>
          </div>
          <div className="df-barbtn">
            <div className="df-btn" onClick={() => setShow(false)}><span className="df-x">×</span></div>
          </div>
        </div>

        <div className={`mag-scene stage-${stage}`}
          style={{ width: L.W, height: L.H, backgroundImage: `url(${deskScene})`, backgroundPosition: L.bgPos }}
          onTouchStart={(e) => { touch.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            if (touch.current == null) return;
            const dx = e.changedTouches[0].clientX - touch.current;
            touch.current = null;
            if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
          }}>
          <div className="mag-dim" />
          <div className="mag-holder" style={{ transform: onDesk ? deskTf : 'none' }}>
            <div className={`mag-book ${closed}`}>
              {Array.from({ length: LEAVES }, (_, i) => {
                const a = anims.current.get(i);
                if (a) {
                  const t = Math.min(1, (now - a.start) / a.dur);
                  const angle = a.from + (a.to - a.from) * ease(t);
                  return <BendyLeaf key={i} i={i} angle={angle} curl={a.curl * Math.sin(Math.PI * t)}
                    dir={a.to < a.from ? -1 : 1} pw={L.pw} z={LEAVES + 2 + a.order} onZoom={setZoom} />;
                }
                const isFlipped = i < flipped;
                return (
                  <div key={i}
                    className={`mag-leaf ${isFlipped ? 'flipped' : ''}`}
                    style={{ zIndex: isFlipped ? i + 1 : LEAVES - i }}
                    onClick={() => (stage === 'desk' ? pickUp() : go(isFlipped ? -1 : 1))}>
                    <Face face={FACES[i * 2]} side="front" onZoom={setZoom} />
                    <Face face={FACES[i * 2 + 1]} side="back" onZoom={setZoom} />
                  </div>
                );
              })}
            </div>
          </div>
          {stage === 'desk' && (
            <button className="mag-hint" onClick={pickUp}
              style={{ left: L.spotX, top: L.spotY - L.spotW * 0.75 }}>
              Click the magazine!
            </button>
          )}
          {stage === 'open' && (
            <div className="mag-controls">
              <button onClick={() => go(-1)} disabled={flipped === 0}>◀ Prev</button>
              <span>{pageLabel}</span>
              <button onClick={() => go(1)} disabled={flipped === LEAVES}>Next ▶</button>
              <button onClick={putBack} title="Put it back on the desk">Put down</button>
            </div>
          )}
        </div>

        {zoom && (
          <div className="mag-lightbox" onClick={() => setZoom(null)}>
            <img src={zoom} alt="" />
            <span>Click anywhere to close</span>
          </div>
        )}
      </div>
    </Draggable>
  );
}
