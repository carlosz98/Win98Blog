import { useContext, useEffect, useState } from 'react';
import Draggable from 'react-draggable';
import UseContext from '../Context';
import { communityStore } from './function/communityStore';
import ie from '../assets/ie.png';

const HIDE_KEY = 'visitorCounterHidden';

// A small Windows 98 window in the top right that greets each visitor
// with their visitor number. Closing it hides it for this visit.
function VisitorCounter() {
  const { themeDragBar } = useContext(UseContext);
  const [stats, setStats] = useState(null);
  const [hidden, setHidden] = useState(() => {
    try { return sessionStorage.getItem(HIDE_KEY) === '1'; } catch { return false; }
  });

  useEffect(() => {
    let alive = true;
    communityStore.visit()
      .then(s => { if (alive) setStats(s); })
      .catch(() => {}); // stays hidden if the counter can't be reached
    communityStore.recordCountry().catch(() => {}); // for the Visitor Map
    return () => { alive = false; };
  }, []);

  if (!stats || hidden) return null;

  function close(e) {
    e.stopPropagation();
    setHidden(true);
    try { sessionStorage.setItem(HIDE_KEY, '1'); } catch {}
  }

  return (
    <Draggable handle=".visitor_bar" bounds="parent">
      <div className="visitor_window">
        <div className="visitor_bar" style={{ background: `linear-gradient(90deg, ${themeDragBar}, #1084d0)` }}>
          <span><img src={ie} alt="" />Visitor Counter</span>
          <button onClick={close} onTouchEnd={close} aria-label="Close">×</button>
        </div>
        <div className="visitor_body">
          <span>You are visitor</span>
          <span className="visitor_number">#{stats.number.toLocaleString()}</span>
        </div>
        <div className="visitor_status">
          {stats.total.toLocaleString()} {stats.total === 1 ? 'visit' : 'visits'} since 2026
        </div>
      </div>
    </Draggable>
  );
}

export default VisitorCounter;
