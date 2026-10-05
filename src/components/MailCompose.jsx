import { useState } from 'react';
import { playError, playOpen } from './function/sounds';

// Outlook Express style "New Message" form. Messages are delivered to
// Carlos's inbox through FormSubmit (no account or API key needed).
const ENDPOINT = 'https://formsubmit.co/ajax/czabala98@gmail.com';

function MailCompose() {
  const [from, setFrom] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [honey, setHoney] = useState('');
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);

  async function send(e) {
    e.preventDefault();
    if (sending || honey) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(from.trim())) { setStatus('Please enter your email so Carlos can reply.'); playError(); return; }
    if (!message.trim()) { setStatus('Please write a message.'); playError(); return; }
    setSending(true);
    setStatus('Connecting to mail server...');
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          email: from.trim(),
          _replyto: from.trim(),
          _subject: `[Win98 site] ${subject.trim() || 'New message'}`,
          message: message.trim(),
          _template: 'table',
          _captcha: 'false',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || String(data.success) === 'false') throw new Error(data.message || 'failed');
      setSubject('');
      setMessage('');
      setStatus('✉️ Message sent! Carlos will get back to you soon.');
      playOpen();
    } catch {
      setStatus('Could not send right now. You can email czabala98@gmail.com directly.');
      playError();
    } finally {
      setSending(false);
    }
  }

  return (
    <form className="oe-compose" onSubmit={send}>
      <div className="oe-toolbar">
        <button type="submit" disabled={sending}>📨<span>{sending ? 'Sending' : 'Send'}</span></button>
        <button type="button" onClick={() => { setSubject(''); setMessage(''); setStatus(''); }}>🗑️<span>Clear</span></button>
      </div>
      <div className="oe-fields">
        <label><span>To:</span><input value="Carlos Zabala" readOnly /></label>
        <label><span>From:</span><input type="email" value={from} onChange={e => setFrom(e.target.value)} placeholder="your@email.com" maxLength={100} /></label>
        <label><span>Subject:</span><input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Hi Carlos!" maxLength={120} /></label>
        <input className="oe-honey" tabIndex={-1} autoComplete="off" value={honey} onChange={e => setHoney(e.target.value)} aria-hidden="true" />
      </div>
      <textarea value={message} onChange={e => setMessage(e.target.value)} rows={6} maxLength={3000}
        placeholder="Write your message here..." />
      {status && <p className="oe-status">{status}</p>}
    </form>
  );
}

export default MailCompose;
