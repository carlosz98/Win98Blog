import { useEffect, useRef, useState } from 'react';

const DELAY_MS = 600;

// Windows 98 style tooltips for the whole site. Shows `data-tip` text, and
// borrows any `title` attribute so the browser's own tooltip doesn't appear.
export default function Tooltip() {
  const [tip, setTip] = useState(null);
  const timer = useRef(null);
  const target = useRef(null);

  useEffect(() => {
    // Touch screens have no hover, so tooltips would only get in the way.
    if (window.matchMedia('(hover: none)').matches) return;

    function restoreTitle(el) {
      if (el && el.dataset.tipTitle !== undefined) {
        el.setAttribute('title', el.dataset.tipTitle);
        delete el.dataset.tipTitle;
      }
    }
    function hide() {
      clearTimeout(timer.current);
      restoreTitle(target.current);
      target.current = null;
      setTip(null);
    }
    function onOver(e) {
      const el = e.target.closest?.('[data-tip], [title]');
      if (el === target.current) return;
      hide();
      if (!el) return;
      const title = el.getAttribute('title');
      if (title) {
        el.dataset.tipTitle = title;
        el.removeAttribute('title');
      }
      const text = el.dataset.tip || title;
      if (!text) return;
      target.current = el;
      const { clientX, clientY } = e;
      timer.current = setTimeout(() => {
        const x = Math.min(clientX + 2, window.innerWidth - 260);
        const y = clientY + 20 > window.innerHeight - 40 ? clientY - 28 : clientY + 20;
        setTip({ text, x, y });
      }, DELAY_MS);
    }
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mousedown', hide);
    window.addEventListener('blur', hide);
    return () => {
      hide();
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mousedown', hide);
      window.removeEventListener('blur', hide);
    };
  }, []);

  if (!tip) return null;
  return (
    <div className="win_tooltip" role="tooltip" style={{ left: tip.x, top: tip.y }}>
      {tip.text}
    </div>
  );
}
