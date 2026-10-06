import { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import UseContext from '../Context';
import Draggable from 'react-draggable';
import { PageFlip } from 'page-flip';
import 'page-flip/src/Style/stPageFlip.css';
import magazineIcon from '../assets/magazine.png';
import desk from '../assets/magazine/desk.webp';
import '../css/DevFeed.css';
import '../css/Magazine.css';

// Pages are page01.webp, page02.webp, ... in src/assets/magazine. Add more files to add pages.
const PAGES = Object.entries(import.meta.glob('../assets/magazine/page*.webp', { eager: true, import: 'default' }))
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, src]) => src);
const LAST = PAGES.length - 1;

const DESK_W = 438;
const DESK_H = 244;
// Corners of the magazine lying on the desk in desk.webp (pixels): top-left, top-right, bottom-right, bottom-left.
const DESK_QUAD = [[95, 202], [165, 199.5], [199, 222.5], [120, 236]];
const PAGE_RATIO = 1536 / 2016;
const FLY_MS = 900;
const READ_FLIP_MS = 800;
const RIFFLE_FLIP_MS = 260;

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

// The open magazine. StPageFlip bends soft paper pages as they turn.
function Book({ width, height, pageW, pageH, riffle, onPage, onReady, flipRef }) {
  const hostRef = useRef(null);

  useEffect(() => {
    const block = document.createElement('div');
    hostRef.current.appendChild(block);
    const pages = PAGES.map((src, i) => {
      const page = document.createElement('div');
      page.className = 'mz-page-sheet';
      page.dataset.density = 'soft';
      const img = document.createElement('img');
      img.src = src;
      img.alt = `Page ${i + 1}`;
      img.draggable = false;
      page.appendChild(img);
      return page;
    });

    const pf = new PageFlip(block, {
      width: pageW,
      height: pageH,
      size: 'fixed',
      autoSize: false,
      showCover: true,
      usePortrait: true,
      startPage: riffle ? LAST : 0,
      flippingTime: READ_FLIP_MS,
      maxShadowOpacity: 0.6,
      mobileScrollSupport: false,
    });
    pf.loadFromHTML(pages);
    pf.on('flip', e => onPage(e.data));
    flipRef.current = pf;
    onPage(pf.getCurrentPageIndex());

    // Riffle from the back cover to the front cover, one fast page at a time.
    let riffleTimer = null;
    if (riffle) {
      pf.getSettings().flippingTime = RIFFLE_FLIP_MS;
      riffleTimer = setInterval(() => {
        if (pf.getState() !== 'read') return;
        if (pf.getCurrentPageIndex() <= 0) {
          clearInterval(riffleTimer);
          pf.getSettings().flippingTime = READ_FLIP_MS;
          onReady();
          return;
        }
        pf.flipPrev('bottom');
      }, RIFFLE_FLIP_MS + 60);
    } else {
      onReady();
    }

    return () => {
      clearInterval(riffleTimer);
      flipRef.current = null;
      pf.destroy();
    };
    // Rebuilt only when the page size changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageW, pageH]);

  return <div className="mz-book" ref={hostRef} style={{ width, height }} />;
}

export default function Magazine({ show, setShow }) {
  const { themeDragBar } = useContext(UseContext);
  const [expand, setExpand] = useState(false);
  // desk: lying on the table. flyIn/flyOut: moving between the table and the center.
  // riffle: pages flipping from the back cover to the front. read: the visitor turns pages.
  const [phase, setPhase] = useState('desk');
  const [flyAtDesk, setFlyAtDesk] = useState(true);
  const [page, setPage] = useState(LAST);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const sceneRef = useRef(null);
  const flipRef = useRef(null);
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
  }, [show]);

  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));

  // The desk photo fills the scene like background-size: cover, anchored low-left so the magazine stays in view.
  const scale = Math.max(size.w / DESK_W, size.h / DESK_H) || 1;
  const bgX = (size.w - DESK_W * scale) * 0.3;
  const bgY = size.h - DESK_H * scale;
  const quad = DESK_QUAD.map(([x, y]) => [bgX + x * scale, bgY + y * scale]);

  // Two pages side by side on wide screens; one big page at a time on phones.
  const portrait = size.w < 500;
  const pageH = Math.round(Math.max(80, Math.min(size.h * 0.86, (size.w * (portrait ? 0.86 : 0.47)) / PAGE_RATIO)));
  const pageW = Math.round(pageH * PAGE_RATIO);
  const pageTop = (size.h - pageH) / 2;
  // A closed magazine (front or back cover) shows one page in the middle.
  const coverX = size.w / 2 - pageW / 2;
  const closed = page === 0 || page === LAST;
  // In landscape, the cover sits on the right half and the back cover on the left; slide them to the middle.
  const shift = portrait || !closed ? 0 : page === 0 ? -pageW / 2 : pageW / 2;

  const onDesk = quadMatrix(pageW, pageH, quad);
  const fromDesk = quadMatrix(pageW, pageH, quad.map(([x, y]) => [x - coverX, y - pageTop]));

  function pickUp() {
    if (phase !== 'desk') return;
    setPage(LAST);
    setPhase('flyIn');
    setFlyAtDesk(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setFlyAtDesk(false)));
    later(() => setPhase('riffle'), FLY_MS);
  }

  function putDown() {
    if (phase !== 'read') return;
    flipRef.current?.turnToPage(LAST);
    setPage(LAST);
    setPhase('flyOut');
    setFlyAtDesk(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setFlyAtDesk(true)));
    later(() => setPhase('desk'), FLY_MS);
  }

  function turn(dir) {
    if (phase !== 'read') return;
    if (dir > 0) flipRef.current?.flipNext('bottom');
    else flipRef.current?.flipPrev('bottom');
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
  const pageLabel = page === 0 ? 'Cover'
    : page === LAST ? 'Back cover'
    : portrait ? `Page ${page + 1} of ${PAGES.length}`
    : `Pages ${page % 2 ? page + 1 : page}-${page % 2 ? page + 2 : page + 1} of ${PAGES.length}`;

  return (
    <Draggable handle=".df-dragbar" disabled={expand} bounds={{ top: 0 }}
      defaultPosition={{ x: window.innerWidth <= 500 ? 0 : 70, y: 30 }}>
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
          <div className={`mz-dim${bookVisible || phase === 'flyIn' ? ' on' : ''}`} onClick={putDown} />

          {phase === 'desk' && size.w > 0 && (
            <>
              <button className="mz-on-desk" onClick={pickUp} aria-label="Pick up the magazine"
                style={{ width: pageW, height: pageH, transform: onDesk }}>
                <img src={PAGES[LAST]} alt="" draggable={false} />
              </button>
              <div className="mz-hint" style={{ left: quad[0][0], top: Math.max(4, quad[0][1] - 26) }}>Click to read</div>
            </>
          )}

          {flying && (
            <div className="mz-fly"
              style={{ left: coverX, top: pageTop, width: pageW, height: pageH, transform: flyAtDesk ? fromDesk : 'none' }}>
              <img src={PAGES[LAST]} alt="" draggable={false} />
            </div>
          )}

          {bookVisible && size.w > 0 && (
            <div className="mz-book-shift" style={{ transform: `translateX(${shift}px)` }}>
              <Book key={`${pageW}x${pageH}`} width={size.w} height={size.h} pageW={pageW} pageH={pageH}
                riffle={phase === 'riffle'} flipRef={flipRef} onPage={setPage}
                onReady={() => setPhase('read')} />
            </div>
          )}
        </div>

        <div className="mz-toolbar">
          <button onClick={() => turn(-1)} disabled={phase !== 'read' || page === 0}>◄ Prev</button>
          <span className="mz-page">{phase === 'read' ? pageLabel : phase === 'desk' ? 'Click the magazine on the desk' : 'Loading…'}</span>
          <button onClick={() => turn(1)} disabled={phase !== 'read' || page === LAST}>Next ►</button>
          <button onClick={putDown} disabled={phase !== 'read'}>Put down</button>
        </div>
      </div>
    </Draggable>
  );
}
