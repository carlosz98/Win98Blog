import { useEffect, useState } from 'react';
import { communityStore } from './function/communityStore';

// Flip-clock style visitor counter in the top right of the desktop.
function VisitorCounter() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    let alive = true;
    communityStore.visit()
      .then(n => { if (alive) setCount(n); })
      .catch(() => {}); // stays hidden if the counter can't be reached
    return () => { alive = false; };
  }, []);

  if (count === null) return null;
  const digits = String(count).padStart(5, '0').split('');

  return (
    <div className="visitor_counter" title="Visitors since 2026">
      <span className="visitor_label">VISITORS</span>
      <span className="visitor_digits">
        {digits.map((d, i) => <span key={i}>{d}</span>)}
      </span>
    </div>
  );
}

export default VisitorCounter;
