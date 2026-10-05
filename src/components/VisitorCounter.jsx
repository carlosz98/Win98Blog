import { useEffect, useState } from 'react';
import { communityStore } from './function/communityStore';

// Old-school hit counter in the top right of the desktop.
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
  const digits = String(count).padStart(6, '0').split('');

  return (
    <div className="visitor_counter" title="Visitors to this site">
      <span className="visitor_label">Visitors</span>
      <span className="visitor_digits">
        {digits.map((d, i) => <span key={i}>{d}</span>)}
      </span>
    </div>
  );
}

export default VisitorCounter;
