import { useContext, useEffect, useRef, useState } from 'react';
import UseContext from '../Context';
import { communityStore } from './function/communityStore';
import { playVisit } from './function/sounds';
import ie from '../assets/ie.png';

const SHOW_MS = 5500;
const TICK_DELAY_MS = 900;
const EXIT_MS = 450;

// Runs cb once the BIOS boot animation (first load of a session) has finished.
function afterBoot(cb) {
  const booted = () => { try { return sessionStorage.getItem('booted') === 'true'; } catch { return true; } };
  let timer = null;
  if (booted()) {
    timer = setTimeout(cb, 1200);
    return () => clearTimeout(timer);
  }
  const poll = setInterval(() => {
    if (!booted()) return;
    clearInterval(poll);
    timer = setTimeout(cb, 1500);
  }, 300);
  return () => { clearInterval(poll); clearTimeout(timer); };
}

// A small Windows 98 window that pops into the top right on every visit, ticks the
// visit total up by one with a ding, then slides away on its own.
function VisitorCounter() {
  const { themeDragBar } = useContext(UseContext);
  const [stats, setStats] = useState(null);
  const [phase, setPhase] = useState('hidden'); // hidden, in, out, gone
  const [shown, setShown] = useState(0);
  const timers = useRef([]);
  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));

  useEffect(() => {
    let alive = true;
    communityStore.visit()
      .then(s => { if (alive) setStats(s); })
      .catch(() => {}); // stays hidden if the counter can't be reached
    communityStore.recordCountry().catch(() => {}); // for the Visitor Map
    return () => { alive = false; timers.current.forEach(clearTimeout); };
  }, []);

  useEffect(() => {
    if (!stats) return;
    return afterBoot(() => {
      // This visit was just added: start one below and tick up.
      setShown(stats.isNew ? stats.total - 1 : stats.total);
      setPhase('in');
      if (stats.isNew) {
        later(() => { setShown(stats.total); playVisit(); }, TICK_DELAY_MS);
      }
      later(() => setPhase('out'), SHOW_MS);
      later(() => setPhase('gone'), SHOW_MS + EXIT_MS);
    });
  }, [stats]);

  if (!stats || phase === 'hidden' || phase === 'gone') return null;

  function close(e) {
    e.stopPropagation();
    timers.current.forEach(clearTimeout);
    setPhase('out');
    later(() => setPhase('gone'), EXIT_MS);
  }

  return (
    <div className={`visitor_window visitor_${phase}`}>
      <div className="visitor_bar" style={{ background: `linear-gradient(90deg, ${themeDragBar}, #1084d0)` }}>
        <span><img src={ie} alt="" />Visitor Counter</span>
        <button onClick={close} onTouchEnd={close} aria-label="Close">×</button>
      </div>
      <div className="visitor_body">
        <span>Visits</span>
        <span className="visitor_number">
          {/* Keyed by value so each new number rolls in from below. */}
          <span key={shown} className="visitor_digits">{shown.toLocaleString()}</span>
        </span>
      </div>
      <div className="visitor_status">
        You are visitor #{stats.number.toLocaleString()}
      </div>
    </div>
  );
}

export default VisitorCounter;
