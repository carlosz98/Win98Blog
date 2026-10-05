import { useContext, useEffect, useState } from 'react';
import UseContext from '../Context';
import Draggable from 'react-draggable';
import guestbookIcon from '../assets/guestbook.png';
import { communityStore, NAME_MAX, MESSAGE_MAX } from './function/communityStore';
import '../css/DevFeed.css';
import '../css/Guestbook.css';

function Guestbook({ show, setShow }) {
  const { themeDragBar } = useContext(UseContext);
  const [entries, setEntries] = useState([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);
  const [expand, setExpand] = useState(false);

  useEffect(() => {
    if (!show) return;
    return communityStore.subscribeGuestbook(
      list => { setEntries(list); setStatus(s => (s.startsWith('Could not load') ? '' : s)); },
      () => setStatus('Could not load the guestbook right now.')
    );
  }, [show]);

  async function handleSign(e) {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setStatus('');
    try {
      await communityStore.signGuestbook(name, message);
      setMessage('');
      setStatus('Thanks for signing! ✍️');
    } catch (err) {
      setStatus(err.message?.startsWith('Please') ? err.message : 'Could not sign right now. Try again later.');
    } finally {
      setSending(false);
    }
  }

  if (!show) return null;

  return (
    <Draggable
      handle=".df-dragbar"
      disabled={expand}
      bounds={{ top: 0 }}
      defaultPosition={{ x: window.innerWidth <= 500 ? 5 : 140, y: window.innerWidth <= 500 ? 60 : 70 }}
    >
      <div
        className="df-window gb-window"
        style={expand
          ? { position: 'fixed', left: 0, top: 0, width: '100%', height: 'calc(100vh - 37px)', zIndex: 9999, resize: 'none' }
          : { zIndex: 9999 }}
      >
        <div className="df-dragbar" style={{ background: themeDragBar }}>
          <div className="df-barname">
            <img src={guestbookIcon} alt="" />
            <span>Guestbook - Notepad</span>
          </div>
          <div className="df-barbtn">
            <div className="df-btn" onClick={() => setShow(false)} onTouchEnd={() => setShow(false)}><span className="df-dash" /></div>
            <div className="df-btn" onClick={() => setExpand(x => !x)}><span className={`df-expand${expand ? ' full' : ''}`} /></div>
            <div className="df-btn" onClick={() => setShow(false)} onTouchEnd={() => setShow(false)}><span className="df-x">×</span></div>
          </div>
        </div>

        <div className="df-menubar">
          <span>File</span><span>Edit</span><span>Search</span><span>Help</span>
        </div>

        <div className="gb-body">
          <form className="gb-form" onSubmit={handleSign}>
            <p className="gb-intro">Thanks for stopping by! Leave your name and a message.</p>
            <label>
              Name:
              <input value={name} maxLength={NAME_MAX} onChange={e => setName(e.target.value)} placeholder="Your name" />
            </label>
            <label>
              Message:
              <textarea value={message} maxLength={MESSAGE_MAX} rows={3} onChange={e => setMessage(e.target.value)} placeholder="Say hi..." />
            </label>
            <div className="gb-actions">
              <span className="gb-count">{message.length}/{MESSAGE_MAX}</span>
              {status && <span className="gb-status">{status}</span>}
              <button type="submit" disabled={sending}>{sending ? 'Signing...' : 'Sign'}</button>
            </div>
          </form>

          <div className="gb-entries">
            {entries.length === 0 && <p className="gb-empty">No signatures yet. Be the first!</p>}
            {entries.map(entry => (
              <div className="gb-entry" key={entry.id}>
                <div className="gb-entry-head">
                  <strong>{entry.name}</strong>
                  <span>{entry.date}</span>
                </div>
                <p>{entry.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Draggable>
  );
}

export default Guestbook;
