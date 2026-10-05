import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import UseContext from '../Context';
import mapIcon from '../assets/worldmap.png';
import grid from './function/worldGrid.json';
import { communityStore } from './function/communityStore';
import '../css/DevFeed.css';
import '../css/VisitorMap.css';

// Pixel world map that lights up the countries visitors come from.
// Only a two-letter country code is ever stored, never anything more precise.
const CELL = 4;

const flag = code => code.replace(/./g, c => String.fromCodePoint(127397 + c.charCodeAt(0)));
let regionNames;
try { regionNames = new Intl.DisplayNames(['en'], { type: 'region' }); } catch { regionNames = null; }
const countryName = code => { try { return regionNames?.of(code) || code; } catch { return code; } };

function VisitorMap({ show, setShow }) {
  const { themeDragBar } = useContext(UseContext);
  const canvasRef = useRef(null);
  const [counts, setCounts] = useState({});
  const [hover, setHover] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!show) return;
    return communityStore.subscribeCountries(setCounts, () => setError('Could not load the map data right now.'));
  }, [show]);

  const max = useMemo(() => Math.max(1, ...Object.values(counts)), [counts]);
  const top = useMemo(() => Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8), [counts]);
  const total = useMemo(() => Object.values(counts).reduce((a, b) => a + b, 0), [counts]);

  useEffect(() => {
    if (!show || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx.fillStyle = '#000080';
    ctx.fillRect(0, 0, grid.w * CELL, grid.h * CELL);
    grid.rows.forEach((row, y) => row.forEach((i, x) => {
      if (!i) return;
      const code = grid.codes[i];
      const n = counts[code] || 0;
      if (n) {
        const t = Math.min(1, 0.35 + 0.65 * (n / max));
        ctx.fillStyle = `rgb(255, ${Math.round(255 - 140 * t)}, 0)`;
      } else {
        ctx.fillStyle = code === hover ? '#e0e0e0' : '#7fb2b0';
      }
      ctx.fillRect(x * CELL, y * CELL, CELL - 1, CELL - 1);
    }));
  }, [show, counts, max, hover]);

  if (!show) return null;

  function onMove(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) * grid.w / rect.width);
    const y = Math.floor((e.clientY - rect.top) * grid.h / rect.height);
    const code = grid.codes[grid.rows[y]?.[x]] || '';
    setHover(/^[A-Z]{2}$/.test(code) ? code : '');
  }

  return (
    <Draggable handle=".df-dragbar" bounds={{ top: 0 }}
      defaultPosition={{ x: window.innerWidth <= 500 ? 5 : 160, y: window.innerWidth <= 500 ? 60 : 80 }}>
      <div className="df-window vm-window" style={{ zIndex: 9999 }}>
        <div className="df-dragbar" style={{ background: themeDragBar }}>
          <div className="df-barname">
            <img src={mapIcon} alt="" />
            <span>Visitor Map</span>
          </div>
          <div className="df-barbtn">
            <div className="df-btn" onClick={() => setShow(false)} onTouchEnd={() => setShow(false)}><span className="df-x">×</span></div>
          </div>
        </div>
        <div className="vm-body">
          <div className="vm-map">
            <canvas ref={canvasRef} width={grid.w * CELL} height={grid.h * CELL}
              onMouseMove={onMove} onMouseLeave={() => setHover('')} />
          </div>
          <div className="vm-status">
            {hover
              ? `${flag(hover)} ${countryName(hover)}: ${counts[hover] || 0} ${counts[hover] === 1 ? 'visitor' : 'visitors'}`
              : `${total} ${total === 1 ? 'visitor' : 'visitors'} from ${Object.keys(counts).length} ${Object.keys(counts).length === 1 ? 'country' : 'countries'}`}
          </div>
          <div className="vm-list">
            {error && <p>{error}</p>}
            {!error && top.length === 0 && <p>No visitors on the map yet.</p>}
            {top.map(([code, n]) => (
              <div key={code}><span>{flag(code)} {countryName(code)}</span><span>{n}</span></div>
            ))}
          </div>
          <p className="vm-note">Only the country is recorded, nothing more.</p>
        </div>
      </div>
    </Draggable>
  );
}

export default VisitorMap;
