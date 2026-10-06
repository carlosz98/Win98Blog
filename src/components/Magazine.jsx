import { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import UseContext from '../Context';
import Draggable from 'react-draggable';
import magazineIcon from '../assets/magazine.png';
import desk from '../assets/magazine/desk.webp';
import '../css/DevFeed.css';
import '../css/Magazine.css';

// Pages are page01.webp, page02.webp, ... in src/assets/magazine. Add more files to add pages.
const PAGES = Object.entries(import.meta.glob('../assets/magazine/page*.webp', { eager: true, import: 'default' }))
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, src]) => src);

// A leaf is one sheet of paper: a page on its front and the next page on its back.
const LEAVES = Array.from({ length: Math.ceil(PAGES.length / 2) }, (_, i) => [PAGES[2 * i], PAGES[2 * i + 1]]);

const DESK_W = 438;
const DESK_H = 244;
// Corners of the magazine lying on the desk in desk.webp (pixels): top-left, top-right, bottom-right, bottom-left.
const DESK_QUAD = [[95, 202], [165, 199.5], [199, 222.5], [120, 236]];
const PAGE_RATIO = 1536 / 2016;
const FLY_MS = 900;
const RIFFLE_MS = 110;

// CSS matrix3d that maps a w x h box (transform-origin 0 0) onto the four corner points.
function quadMatrix(w, h, [[x0, y0], [x1, y1], [x2, y2], [x3, y3]]) {
  const dx1 = x1 - x2, dx2 = x3 - x2, dy1 = y1 - y2, dy2 = y3 - y2;
  const sx = x0 - x1 + x2 - x3, sy = y0 - y1 + y2 - y3;
  const det = dx1 * dy2 - dx2 * dy1;
  const g = (sx * dy2 - dx2 * sy) / det;
  const hh = (dx1 * sy - sx * dy1) / det;
  const a = x1 - x0 + g * x1, b = x3 - x0 + hh * x3;
  const d = y1 - y0 + g * y1, e = y3 - y0 + hh * y3;
  const m = [a / w, d / w, 0, g / w, b / h, e / h, 0, hh / h, 0, 0, 1, 0, x0, y0, 0, 1];
  return `matrix3d(${m.join(',')})`;
}

export default function Magazine({ show, setShow }) {
  const { themeDragBar } = useContext(UseContext);
  const [expand, setExpand] = useState(false);
  // desk: lying on the table. flyIn/flyOut: moving between the table and the center.
  // riffle: pages flipping from the last one back to the cover. read: the visitor turns pages.
  const [phase, setPhase] = useState('desk');
  const [flyAtDesk, setFlyAtDesk] = useState(true);
  const [flipped, setFlipped] = useState(LEAVES.length);
  const [turning, setTurning] = useState(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const sceneRef = useRef(null);
  const timers = useRef([]);

  useLayoutEffect(() => {
    if (!show || !sceneRef.current) return;
    const el = sceneRef.current;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [show]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    if (show) return;
    timers.current.forEach(clearTimeout);
    setPhase('desk');
    setFlyAtDesk(true);
    setFlipped(LEAVES.length);
  }, [show]);

  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));

  // The desk photo fills the scene like background-size: cover, anchored low-left so the magazine stays in view.
  const scale = Math.max(size.w / DESK_W, size.h / DESK_H) || 1;
  const bgX = (size.w - DESK_W * scale) * 0.3;
  const bgY = size.h - DESK_H * scale;
  const quad = DESK_QUAD.map(([x, y]) => [bgX + x * scale, bgY + y * scale]);

  // One page, sized so a full spread fits the scene.
  const pageH = Math.max(80, Math.min(size.h * 0.86, (size.w * 0.94) / 2 / PAGE_RATIO));
  const pageW = pageH * PAGE_RATIO;
  const bookLeft = size.w / 2 - pageW;
  const bookTop = (size.h - pageH) / 2;

  // Closed on the cover, the book sits right of center; closed on the back cover, left of center.
  const shift = flipped === 0 ? -pageW / 2 : flipped === LEAVES.length ? pageW / 2 : 0;
  // The back cover sits on the left half of the spread, so that is where the flight starts and ends.
  const coverX = bookLeft + shift;
  const fromDesk = quadMatrix(pageW, pageH, quad.map(([x, y]) => [x - coverX, y - bookTop]));
  const onDesk = quadMatrix(pageW, pageH, quad);

  function pickUp() {
    if (phase !== 'desk') return;
    setFlipped(LEAVES.length);
    setPhase('flyIn');
    setFlyAtDesk(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setFlyAtDesk(false)));
    later(() => {
      setPhase('riffle');
      // Flip from the last page back to the cover, one leaf at a time.
      for (let i = 0; i < LEAVES.length; i++) {
        later(() => { setTurning(LEAVES.length - 1 - i); setFlipped(LEAVES.length - 1 - i); }, 250 + i * RIFFLE_MS);
      }
      later(() => setPhase('read'), 250 + LEAVES.length * RIFFLE_MS + 500);
    }, FLY_MS);
  }

  function putDown() {
    if (phase !== 'read') return;
    setTurning(null);
    setFlipped(LEAVES.length);
    later(() => {
      setPhase('flyOut');
      setFlyAtDesk(false);
      requestAnimationFrame(() => requestAnimationFrame(() => setFlyAtDesk(true)));
      later(() => setPhase('desk'), FLY_MS);
    }, 650);
  }

  function turn(dir) {
    if (phase !== 'read') return;
    const next = flipped + dir;
    if (next < 0 || next > LEAVES.length) return;
    setTurning(dir > 0 ? flipped : next);
    setFlipped(next);
  }

  useEffect(() => {
    if (!show || phase !== 'read') return;
    const onKey = e => {
      if (e.key === 'ArrowRight') turn(1);
      else if (e.key === 'ArrowLeft') turn(-1);
      else if (e.key === 'Escape') putDown();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!show) return null;

  const flying = phase === 'flyIn' || phase === 'flyOut';
  const bookVisible = phase === 'riffle' || phase === 'read';
  const pageLabel = flipped === 0 ? 'Cover'
    : flipped === LEAVES.length ? 'Back cover'
    : `Pages ${2 * flipped}-${2 * flipped + 1} of ${PAGES.length}`;

  return (
    <Draggable handle=".df-dragbar" disabled={expand} bounds={{ top: 0 }}
      defaultPosition={{ x: window.innerWidth <= 500 ? 0 : 70, y: window.innerWidth <= 500 ? 30 : 30 }}>
      <div className="df-window mz-window"
        style={expand
          ? { position: 'fixed', left: 0, top: 0, width: '100%', height: 'calc(100vh - 37px)', zIndex: 9999, resize: 'none' }
          : { zIndex: 9999 }}>
        <div className="df-dragbar" style={{ background: themeDragBar }}>
          <div className="df-barname">
            <img src={magazineIcon} alt="" />
            <span>Magazine</span>
          </div>
          <div className="df-barbtn">
            <div className="df-btn" onClick={() => setShow(false)}><span className="df-dash" /></div>
            <div className="df-btn" onClick={() => setExpand(e => !e)}><span className={`df-expand${expand ? ' full' : ''}`} /></div>
            <div className="df-btn" onClick={() => setShow(false)}><span className="df-x">×</span></div>
          </div>
        </div>

        <div className="mz-scene" ref={sceneRef}>
          <img className="mz-desk" src={desk} alt="" draggable={false}
            style={{ left: bgX, top: bgY, width: DESK_W * scale, height: DESK_H * scale }} />
          <div className={`mz-dim${bookVisible ? ' on' : ''}`} onClick={putDown} />

          {phase === 'desk' && size.w > 0 && (
            <button className="mz-on-desk" onClick={pickUp} aria-label="Pick up the magazine"
              style={{ width: pageW, height: pageH, transform: onDesk }}>
              <img src={PAGES[PAGES.length - 1]} alt="" draggable={false} />
            </button>
          )}
          {phase === 'desk' && size.w > 0 && (
            <div className="mz-hint" style={{ left: quad[0][0], top: Math.max(4, quad[0][1] - 26) }}>Click to read</div>
          )}

          {flying && (
            <div className="mz-fly"
              style={{ left: coverX, top: bookTop, width: pageW, height: pageH, transform: flyAtDesk ? fromDesk : 'none' }}>
              <img src={PAGES[PAGES.length - 1]} alt="" draggable={false} />
            </div>
          )}

          {bookVisible && (
            <div className={`mz-book${phase === 'riffle' ? ' riffle' : ''}`}
              style={{ left: bookLeft, top: bookTop, width: pageW * 2, height: pageH, transform: `translateX(${shift}px)` }}>
              {LEAVES.map(([front, back], i) => {
                const isFlipped = flipped > i;
                const z = turning === i ? 1000 : isFlipped ? i + 1 : LEAVES.length - i;
                return (
                  <div key={i} className={`mz-leaf${isFlipped ? ' flipped' : ''}`} style={{ zIndex: z }}
                    onTransitionEnd={() => turning === i && setTurning(null)}
                    onClick={() => turn(isFlipped ? -1 : 1)}>
                    <div className="mz-face mz-front"><img src={front} alt={`Page ${2 * i + 1}`} draggable={false} /></div>
                    <div className="mz-face mz-back">{back && <img src={back} alt={`Page ${2 * i + 2}`} draggable={false} />}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mz-toolbar">
          <button onClick={() => turn(-1)} disabled={phase !== 'read' || flipped === 0}>◄ Prev</button>
          <span className="mz-page">{phase === 'read' ? pageLabel : phase === 'desk' ? 'Click the magazine on the desk' : 'Loading…'}</span>
          <button onClick={() => turn(1)} disabled={phase !== 'read' || flipped === LEAVES.length}>Next ►</button>
          <button onClick={putDown} disabled={phase !== 'read'}>Put down</button>
        </div>
      </div>
    </Draggable>
  );
}
