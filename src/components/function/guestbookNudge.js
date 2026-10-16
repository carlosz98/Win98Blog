import { useEffect, useState } from 'react';

// Remembers (in this browser) whether the visitor already signed the guestbook.
const KEY = 'guestbook_signed';
const EVENT = 'guestbook-signed';

export function hasSigned() {
  try { return localStorage.getItem(KEY) === '1'; } catch { return false; }
}

export function markSigned() {
  try { localStorage.setItem(KEY, '1'); } catch { /* private mode: ignore */ }
  window.dispatchEvent(new Event(EVENT));
}

export function useGuestbookSigned() {
  const [signed, setSigned] = useState(hasSigned);
  useEffect(() => {
    const update = () => setSigned(hasSigned());
    window.addEventListener(EVENT, update);
    return () => window.removeEventListener(EVENT, update);
  }, []);
  return signed;
}
