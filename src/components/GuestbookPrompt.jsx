import { useEffect, useState } from 'react';
import guestbookIcon from '../assets/guestbook.png';
import { useGuestbookSigned } from './function/guestbookNudge';
import '../css/GuestbookPrompt.css';

// Win98 message box asking visitors to sign the guestbook. Shows a few seconds after arrival,
// once more later if dismissed, and never again once they have signed.
const FIRST_DELAY = 6000;
const REMINDER_DELAY = 90000;
const SHOWN_KEY = 'guestbook_prompts';

function promptsShown() {
  try { return Number(sessionStorage.getItem(SHOWN_KEY) || 0); } catch { return 0; }
}
function bumpPrompts() {
  try { sessionStorage.setItem(SHOWN_KEY, String(promptsShown() + 1)); } catch { /* ignore */ }
}

export default function GuestbookPrompt({ openGuestbook, guestbookOpen }) {
  const signed = useGuestbookSigned();
  const [visible, setVisible] = useState(false);

  // Blink the desktop Guestbook icon until the visitor signs.
  useEffect(() => {
    document.body.classList.toggle('gb-unsigned', !signed);
    return () => document.body.classList.remove('gb-unsigned');
  }, [signed]);

  useEffect(() => {
    if (signed || guestbookOpen) { setVisible(false); return; }
    const shown = promptsShown();
    if (shown >= 2) return;
    const t = setTimeout(() => { bumpPrompts(); setVisible(true); }, shown === 0 ? FIRST_DELAY : REMINDER_DELAY);
    return () => clearTimeout(t);
  }, [signed, guestbookOpen, visible]);

  if (!visible || signed) return null;

  const sign = () => { setVisible(false); openGuestbook(); };

  return (
    <div className="gp-overlay" role="dialog" aria-label="Sign the guestbook">
      <div className="gp-box">
        <div className="gp-title"><img src={guestbookIcon} alt="" /><span>Guestbook</span>
          <button className="gp-x" onClick={() => setVisible(false)} aria-label="Close">×</button>
        </div>
        <div className="gp-body">
          <img className="gp-icon" src={guestbookIcon} alt="" />
          <div>
            <p><b>Hey, thanks for visiting!</b></p>
            <p>Please sign my guestbook before you go. It only takes a few seconds and it really means a lot to me.</p>
          </div>
        </div>
        <div className="gp-actions">
          <button className="gp-default" onClick={sign}>Sign now</button>
          <button onClick={() => setVisible(false)}>Maybe later</button>
        </div>
      </div>
    </div>
  );
}
