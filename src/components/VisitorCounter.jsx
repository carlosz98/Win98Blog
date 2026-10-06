import { useContext, useEffect, useState } from 'react';
import UseContext from '../Context';
import { communityStore } from './function/communityStore';
import { playCounter } from './function/sounds';
import ie from '../assets/ie.png';

const SHOW_DELAY_MS = 700;  // after the desktop appears
const ROLL_DELAY_MS = 900;  // number ticks up this long after the window fades in
const STAY_MS = 4500;       // then it waits this long before leaving
const EXIT_MS = 450;

// Waits for the BIOS boot animation (first visit of a session) to finish.
function whenBooted(cb) {
  const booted = () => { try { return sessionStorage.getItem('booted') === 'true'; } catch { return true; } };
  if (booted()) { cb(); return () => {}; }
  const id = setInterval(() => { if (booted()) { clearInterval(id); cb(); } }, 300);
  return () => clearInterval(id);
}

// One digit that rolls up from its old value to its new one, like an odometer.
function Digit({ from, to, rolling }) {
  if (from === to || !rolling) return <span className="visitor_digit"><span>{rolling ? to : from}</span></span>;
  return (
    <span className="visitor_digit">
      <span className="visitor_digit_roll">
        <span>{from}</span>
        <span>{to}</span>
      </span>
    </span>
  );
}

// A small Windows 98 window that fades into the top right corner on every
// visit, rolls the counter up to this visit's number, then fades away.
function VisitorCounter() {
  const { themeDragBar } = useContext(UseContext);
  const [stats, setStats] = useState(null);
  const [stage, setStage] = useState('hidden'); // hidden -> in -> rolled -> out

  useEffect(() => {
    let alive = true;
    communityStore.visit()
      .then(s => { if (alive) setStats(s); })
      .catch(() => {}); // stays hidden if the counter can't be reached
    communityStore.recordCountry().catch(() => {}); // for the Visitor Map
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (!stats) return;
    const timers = [];
    const stop = whenBooted(() => {
      timers.push(setTimeout(() => setStage('in'), SHOW_DELAY_MS));
      timers.push(setTimeout(() => { setStage('rolled'); playCounter(); }, SHOW_DELAY_MS + ROLL_DELAY_MS));
      timers.push(setTimeout(() => setStage('out'), SHOW_DELAY_MS + ROLL_DELAY_MS + STAY_MS));
      timers.push(setTimeout(() => setStage('done'), SHOW_DELAY_MS + ROLL_DELAY_MS + STAY_MS + EXIT_MS));
    });
    return () => { stop(); timers.forEach(clearTimeout); };
  }, [stats]);

  if (!stats || stage === 'hidden' || stage === 'done') return null;

  const to = stats.number;
  const from = Math.max(0, to - 1);
  const width = String(to).length;
  const fromDigits = String(from).padStart(width, ' ').split('');
  const toDigits = String(to).split('');
  const rolling = stage !== 'in';

  function close(e) {
    e.stopPropagation();
    setStage('out');
    setTimeout(() => setStage('done'), EXIT_MS);
  }

  return (
    <div className={`visitor_window visitor_${stage === 'out' ? 'out' : 'in'}`} role="status">
      <div className="visitor_bar" style={{ background: `linear-gradient(90deg, ${themeDragBar}, #1084d0)` }}>
        <span><img src={ie} alt="" />Visitor Counter</span>
        <button onClick={close} onTouchEnd={close} aria-label="Close">×</button>
      </div>
      <div className="visitor_body">
        <span>You are visitor</span>
        <span className={`visitor_number ${rolling ? 'visitor_bump' : ''}`}>
          #{toDigits.map((d, i) => <Digit key={i} from={fromDigits[i]} to={d} rolling={rolling} />)}
        </span>
      </div>
      <div className="visitor_status">
        {rolling ? `${stats.total.toLocaleString()} ${stats.total === 1 ? 'visit' : 'visits'} since 2026` : 'Counting your visit...'}
      </div>
    </div>
  );
}

export default VisitorCounter;
