import { useContext, useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import UseContext from '../Context';
import galleryIcon from '../assets/gallery.png';
import { communityStore, NAME_MAX } from './function/communityStore';
import { devfeedStore } from './function/devfeedStore';
import '../css/DevFeed.css';
import '../css/PaintGallery.css';

// A tiny MS Paint where visitors draw something and post it to a shared gallery.
const CANVAS_W = 240;
const CANVAS_H = 160;
const PALETTE = [
  '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080',
  '#ffffff', '#c0c0c0', '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff',
  '#ff8000', '#804000', '#ff80c0', '#80ffff',
];
const TOOLS = [
  { id: 'pencil', label: '✏️', title: 'Pencil' },
  { id: 'brush', label: '🖌️', title: 'Brush' },
  { id: 'fill', label: '🪣', title: 'Fill' },
  { id: 'eraser', label: '🧽', title: 'Eraser' },
];

function floodFill(ctx, x, y, hex) {
  const { width, height } = ctx.canvas;
  const img = ctx.getImageData(0, 0, width, height);
  const d = img.data;
  const at = (px, py) => (py * width + px) * 4;
  const start = at(x, y);
  const target = [d[start], d[start + 1], d[start + 2], d[start + 3]];
  const fill = [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16), 255];
  if (target.every((v, i) => v === fill[i])) return;
  const same = i => d[i] === target[0] && d[i + 1] === target[1] && d[i + 2] === target[2] && d[i + 3] === target[3];
  const stack = [[x, y]];
  while (stack.length) {
    const [px, py] = stack.pop();
    if (px < 0 || py < 0 || px >= width || py >= height) continue;
    const i = at(px, py);
    if (!same(i)) continue;
    d[i] = fill[0]; d[i + 1] = fill[1]; d[i + 2] = fill[2]; d[i + 3] = 255;
    stack.push([px + 1, py], [px - 1, py], [px, py + 1], [px, py - 1]);
  }
  ctx.putImageData(img, 0, 0);
}

function PaintGallery({ show, setShow }) {
  const { themeDragBar } = useContext(UseContext);
  const canvasRef = useRef(null);
  const drawing = useRef(null);
  const [tab, setTab] = useState('draw');
  const [tool, setTool] = useState('pencil');
  const [color, setColor] = useState('#000000');
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);
  const [pictures, setPictures] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [expand, setExpand] = useState(false);

  useEffect(() => devfeedStore.onAdminChange?.(setIsAdmin), []);

  useEffect(() => {
    if (!show) return;
    return communityStore.subscribeGallery(setPictures, () => setStatus('Could not load the gallery right now.'));
  }, [show]);

  useEffect(() => {
    if (!show) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
      drawing.current = {};
    }
  }, [show]);

  if (!show) return null;

  function point(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    const t = e.touches?.[0] || e;
    return [
      Math.floor((t.clientX - rect.left) * CANVAS_W / rect.width),
      Math.floor((t.clientY - rect.top) * CANVAS_H / rect.height),
    ];
  }

  function stroke(from, to) {
    const ctx = canvasRef.current.getContext('2d');
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.lineWidth = tool === 'pencil' ? 1 : tool === 'brush' ? 4 : 10;
    ctx.lineCap = tool === 'pencil' ? 'square' : 'round';
    ctx.beginPath();
    ctx.moveTo(from[0] + 0.5, from[1] + 0.5);
    ctx.lineTo(to[0] + 0.5, to[1] + 0.5);
    ctx.stroke();
  }

  function down(e) {
    e.preventDefault();
    const p = point(e);
    if (tool === 'fill') {
      floodFill(canvasRef.current.getContext('2d'), p[0], p[1], color);
      return;
    }
    drawing.current.last = p;
    drawing.current.active = true;
    stroke(p, p);
  }
  function move(e) {
    if (!drawing.current?.active) return;
    e.preventDefault();
    const p = point(e);
    stroke(drawing.current.last, p);
    drawing.current.last = p;
  }
  function up() { if (drawing.current) drawing.current.active = false; }

  function clear() {
    const ctx = canvasRef.current.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  }

  async function post() {
    if (sending) return;
    setSending(true);
    setStatus('');
    try {
      await communityStore.postPicture(name, canvasRef.current.toDataURL('image/png'));
      clear();
      setStatus('Posted! 🎨');
      setTab('gallery');
    } catch (err) {
      setStatus(err.message?.startsWith('Please') || err.message?.startsWith('That') ? err.message : 'Could not post right now. Try again later.');
    } finally {
      setSending(false);
    }
  }

  async function remove(id) {
    if (!window.confirm('Delete this drawing?')) return;
    try { await communityStore.deletePicture(id); } catch { setStatus('Could not delete it.'); }
  }

  return (
    <Draggable handle=".df-dragbar" disabled={expand} bounds={{ top: 0 }}
      defaultPosition={{ x: window.innerWidth <= 500 ? 5 : 200, y: window.innerWidth <= 500 ? 50 : 60 }}>
      <div className="df-window pg-window"
        style={expand ? { position: 'fixed', left: 0, top: 0, width: '100%', height: 'calc(100vh - 37px)', zIndex: 9999, resize: 'none' } : { zIndex: 9999 }}>
        <div className="df-dragbar" style={{ background: themeDragBar }}>
          <div className="df-barname">
            <img src={galleryIcon} alt="" />
            <span>Paint Gallery</span>
          </div>
          <div className="df-barbtn">
            <div className="df-btn" onClick={() => setShow(false)} onTouchEnd={() => setShow(false)}><span className="df-dash" /></div>
            <div className="df-btn" onClick={() => setExpand(x => !x)}><span className={`df-expand${expand ? ' full' : ''}`} /></div>
            <div className="df-btn" onClick={() => setShow(false)} onTouchEnd={() => setShow(false)}><span className="df-x">×</span></div>
          </div>
        </div>

        <div className="pg-tabs">
          <button className={tab === 'draw' ? 'active' : ''} onClick={() => setTab('draw')}>Draw</button>
          <button className={tab === 'gallery' ? 'active' : ''} onClick={() => setTab('gallery')}>Gallery ({pictures.length})</button>
        </div>

        <div className="pg-body">
          <div className="pg-draw" style={tab === 'draw' ? {} : { display: 'none' }}>
              <div className="pg-tools">
                {TOOLS.map(t => (
                  <button key={t.id} title={t.title} className={tool === t.id ? 'active' : ''} onClick={() => setTool(t.id)}>{t.label}</button>
                ))}
                <button title="Clear" onClick={clear}>🗑️</button>
              </div>
              <div className="pg-canvas-wrap">
                <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H}
                  onMouseDown={down} onMouseMove={move} onMouseUp={up} onMouseLeave={up}
                  onTouchStart={down} onTouchMove={move} onTouchEnd={up} />
              </div>
              <div className="pg-palette">
                <span className="pg-current" style={{ background: color }} />
                {PALETTE.map(c => (
                  <button key={c} style={{ background: c }} title={c} onClick={() => { setColor(c); if (tool === 'eraser') setTool('pencil'); }} />
                ))}
              </div>
              <div className="pg-post">
                <input value={name} maxLength={NAME_MAX} placeholder="Sign your drawing" onChange={e => setName(e.target.value)} />
                <button onClick={post} disabled={sending}>{sending ? 'Posting...' : 'Post to gallery'}</button>
              </div>
          </div>
          {tab === 'gallery' && (
            <div className="pg-gallery">
              {pictures.length === 0 && <p className="pg-empty">No drawings yet. Be the first!</p>}
              {pictures.map(p => (
                <figure key={p.id}>
                  <img src={p.image} alt={`Drawing by ${p.name}`} />
                  <figcaption>
                    <strong>{p.name}</strong>
                    <span>{p.date}</span>
                    {isAdmin && <button className="pg-delete" onClick={() => remove(p.id)}>Delete</button>}
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
          {status && <p className="pg-status">{status}</p>}
        </div>
      </div>
    </Draggable>
  );
}

export default PaintGallery;
