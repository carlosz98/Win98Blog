import { useContext, useEffect, useRef, useState } from 'react';
import UseContext from '../Context';
import Draggable from 'react-draggable';
import specsIcon from '../assets/myspecs.png';
import bioPC from '../assets/bio_pc.png';
import '../css/DevFeed.css';
import '../css/SystemSpecs.css';

// Carlos's real PC, shown as a Windows 98 System Properties dialog.
const DEVICES = [
  { group: 'Processors', icon: '🔲', name: 'AMD Ryzen 5 5600X', details: ['6 cores, 12 threads', 'Up to 4.6 GHz boost clock'] },
  { group: 'Display adapters', icon: '🖼️', name: 'Gigabyte NVIDIA GeForce RTX 3080', details: ['Ray tracing: supported', 'Runs Doom (1993) at about a million FPS'] },
  { group: 'Memory', icon: '🧠', name: '32 GB DDR4 3200 MHz', details: ['Enough RAM for 2,000 Windows 98 PCs'] },
  { group: 'Disk drives', icon: '💽', name: '3 TB NVMe SSD', details: ['Holds about 2 million floppy disks'] },
  { group: 'System devices', icon: '🧩', name: 'ASUS ROG STRIX B550-F', details: ['Motherboard'] },
  { group: 'Monitors', icon: '🖥️', name: 'Samsung 49" Odyssey G9 Super Ultra Wide', details: ['1000R curved, 144 Hz', 'About as wide as two monitors side by side'] },
];
const CPU = DEVICES[0].name;

const BENCH = [
  { name: 'CPU', score: 9820 },
  { name: 'Graphics', score: 9960 },
  { name: 'Memory', score: 9410 },
  { name: 'Disk', score: 9700 },
];

function General() {
  return (
    <div className="ss-general">
      <img src={bioPC} alt="" className="ss-pc" />
      <div className="ss-general-text">
        <p className="ss-label">System:</p>
        <p>Microsoft Windows 98</p>
        <p>Carlos Edition</p>
        <p className="ss-label">Registered to:</p>
        <p>Carlos Zabala</p>
        <p>CARLOS-PC</p>
        <p className="ss-label">Computer:</p>
        <p>{CPU}</p>
        <p>32.0 GB RAM</p>
        <p>GeForce RTX 3080</p>
      </div>
    </div>
  );
}

function DeviceManager() {
  const [open, setOpen] = useState(() => DEVICES.map(d => d.group));
  const [selected, setSelected] = useState(null);
  const toggle = g => setOpen(o => (o.includes(g) ? o.filter(x => x !== g) : [...o, g]));
  const device = DEVICES.find(d => d.group === selected);
  return (
    <div className="ss-devices">
      <div className="ss-tree">
        <div className="ss-node ss-root">🖥️ CARLOS-PC</div>
        {DEVICES.map(d => (
          <div key={d.group}>
            <div className="ss-node ss-group" onClick={() => toggle(d.group)}>
              <span className="ss-plus">{open.includes(d.group) ? '−' : '+'}</span>
              <span>{d.icon} {d.group}</span>
            </div>
            {open.includes(d.group) && (
              <div className={`ss-node ss-leaf${selected === d.group ? ' sel' : ''}`} onClick={() => setSelected(d.group)}>
                {d.icon} <span>{d.name}</span>
              </div>
            )}
          </div>
        ))}
      </div>
      <fieldset className="ss-status">
        <legend>Device status</legend>
        {device ? (
          <>
            <p><b>{device.name}</b></p>
            {device.details.map(t => <p key={t}>{t}</p>)}
            <p className="ss-ok">This device is working properly.</p>
          </>
        ) : <p>Click a device to see its details.</p>}
      </fieldset>
    </div>
  );
}

function Defrag({ onClose }) {
  const COUNT = 210;
  const [blocks, setBlocks] = useState(() => Array.from({ length: COUNT }, () => {
    const r = Math.random();
    return r < 0.35 ? 'frag' : r < 0.8 ? 'used' : 'free';
  }));
  const [pos, setPos] = useState(0);
  useEffect(() => {
    if (pos >= COUNT) return;
    const t = setTimeout(() => {
      setBlocks(b => {
        const next = [...b];
        for (let i = pos; i < Math.min(pos + 6, COUNT); i++) if (next[i] !== 'free') next[i] = 'done';
        return next;
      });
      setPos(p => p + 6);
    }, 90);
    return () => clearTimeout(t);
  }, [pos]);
  const pct = Math.min(100, Math.round((pos / COUNT) * 100));
  return (
    <div className="ss-defrag">
      <p>Defragmenting Drive C</p>
      <div className="ss-blocks">
        {blocks.map((b, i) => <span key={i} className={`ss-block ${b}${i >= pos && i < pos + 6 ? ' reading' : ''}`} />)}
      </div>
      <div className="ss-progress"><div style={{ width: `${pct}%` }} /></div>
      <p>{pct < 100 ? `${pct}% complete` : 'Defragmentation is complete.'}</p>
      <button onClick={onClose}>{pct < 100 ? 'Stop' : 'Close'}</button>
    </div>
  );
}

function Performance() {
  const [bench, setBench] = useState(null); // null, a number (progress), or 'done'
  const [defrag, setDefrag] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearInterval(timer.current), []);
  function runBench() {
    setBench(0);
    clearInterval(timer.current);
    timer.current = setInterval(() => {
      setBench(p => {
        if (p >= 100) { clearInterval(timer.current); return 'done'; }
        return p + 5;
      });
    }, 110);
  }
  if (defrag) return <Defrag onClose={() => setDefrag(false)} />;
  return (
    <div className="ss-perf">
      <fieldset>
        <legend>Performance status</legend>
        <div className="ss-row"><span>Memory:</span><span>32,768 MB of RAM</span></div>
        <div className="ss-row"><span>System Resources:</span><span>99% free</span></div>
        <div className="ss-row"><span>File System:</span><span>NVMe, very fast</span></div>
        <div className="ss-row"><span>Virtual Memory:</span><span>Not needed</span></div>
        <p className="ss-ok">Your system is configured for optimal performance.</p>
      </fieldset>
      <fieldset>
        <legend>Benchmark</legend>
        {bench === null && <p>Compare this PC to a 1998 Pentium II.</p>}
        {typeof bench === 'number' && (
          <>
            <p>Running tests<span className="ss-dots" /></p>
            <div className="ss-progress"><div style={{ width: `${bench}%` }} /></div>
          </>
        )}
        {bench === 'done' && (
          <div className="ss-bench">
            {BENCH.map(b => (
              <div key={b.name} className="ss-bench-row">
                <span>{b.name}</span>
                <div className="ss-bar"><div style={{ width: `${b.score / 100}%` }} /></div>
                <span>{b.score}</span>
              </div>
            ))}
            <p className="ss-ok">About 500x faster than a 1998 Pentium II (rough guess).</p>
          </div>
        )}
      </fieldset>
      <div className="ss-perf-btns">
        <button onClick={runBench} disabled={typeof bench === 'number'}>Run benchmark</button>
        <button onClick={() => setDefrag(true)}>Defragment C:</button>
      </div>
    </div>
  );
}

const TABS = [
  { id: 'general', label: 'General' },
  { id: 'devices', label: 'Device Manager' },
  { id: 'perf', label: 'Performance' },
];

export default function SystemSpecs({ show, setShow }) {
  const { themeDragBar } = useContext(UseContext);
  const [tab, setTab] = useState('general');
  if (!show) return null;
  return (
    <Draggable handle=".df-dragbar" bounds={{ top: 0 }}
      defaultPosition={{ x: window.innerWidth <= 500 ? 4 : 180, y: window.innerWidth <= 500 ? 40 : 50 }}>
      <div className="df-window ss-window" style={{ zIndex: 9999 }}>
        <div className="df-dragbar" style={{ background: themeDragBar }}>
          <div className="df-barname">
            <img src={specsIcon} alt="" />
            <span>System Properties</span>
          </div>
          <div className="df-barbtn">
            <div className="df-btn" onClick={() => setShow(false)}><span className="df-x">×</span></div>
          </div>
        </div>
        <div className="ss-tabs">
          {TABS.map(t => (
            <button key={t.id} className={tab === t.id ? 'active' : ''} onClick={() => setTab(t.id)}>{t.label}</button>
          ))}
        </div>
        <div className="ss-body" key={tab}>
          {tab === 'general' && <General />}
          {tab === 'devices' && <DeviceManager />}
          {tab === 'perf' && <Performance />}
        </div>
        <div className="ss-footer">
          <button onClick={() => setShow(false)}>OK</button>
          <button onClick={() => setShow(false)}>Cancel</button>
        </div>
      </div>
    </Draggable>
  );
}
