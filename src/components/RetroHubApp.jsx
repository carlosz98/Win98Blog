import { useContext, useState } from 'react';
import UseContext from '../Context';
import Draggable from 'react-draggable';
import retrohubIcon from '../assets/retrohub.png';
import '../css/DevFeed.css';
import '../css/RetroHubApp.css';

// RetroHub — Carlos's Android app, streamed live from Appetize (a phone emulator in the cloud).
// Visitors play with the real app in the browser; nothing is downloaded and no source code is shared.
// The phone only boots when someone clicks Start, so the free monthly demo minutes aren't wasted.
const APPETIZE_EMBED = 'https://appetize.io/embed/b_fcm2w5tbohqfojup5hx5wiwju4';
const EMBED_PARAMS = 'scale=auto&centered=both&deviceColor=black&autoplay=true&toast=top&grantPermissions=true';

// Optional shared demo login. Leave both empty and the window tells visitors to sign up inside the app.
const DEMO_LOGIN = { email: '', password: '' };

const FEATURES = [
  ['🔥', 'Campfire + ASCII launch intro'],
  ['📰', 'Community feed, stories and articles'],
  ['💿', 'Albums: game soundtracks with a vinyl player'],
  ['📚', 'Classic gaming magazines, page by page'],
  ['🎮', 'Game database, collection and backlog'],
  ['💬', 'Chat, follows, notifications and XP levels'],
];

const STACK = ['Kotlin', 'Jetpack Compose', 'Firebase', 'Material 3'];

export default function RetroHubApp({ show, setShow }) {
  const { themeDragBar } = useContext(UseContext);
  const [expand, setExpand] = useState(false);
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState('');

  if (!show) return null;

  // Closing the window also ends the emulator session (the iframe unmounts).
  function close() {
    setRunning(false);
    setShow(false);
  }

  function copy(text, which) {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(which);
      setTimeout(() => setCopied(''), 1500);
    }).catch(() => {});
  }

  const hasDemoLogin = DEMO_LOGIN.email && DEMO_LOGIN.password;

  return (
    <Draggable handle=".df-dragbar" disabled={expand} bounds={{ top: 0 }}
      defaultPosition={{ x: window.innerWidth <= 500 ? 0 : 140, y: 20 }}>
      <div className="df-window rh-window"
        style={expand
          ? { position: 'fixed', left: 0, top: 0, width: '100%', height: 'calc(100vh - 37px)', zIndex: 9999, resize: 'none' }
          : { zIndex: 9999 }}>
        <div className="df-dragbar" style={{ background: themeDragBar }}>
          <div className="df-barname">
            <img src={retrohubIcon} alt="" />
            <span>RetroHub.exe</span>
          </div>
          <div className="df-barbtn">
            <div className="df-btn" onClick={close}><span className="df-dash" /></div>
            <div className="df-btn" onClick={() => setExpand(e => !e)}><span className={`df-expand${expand ? ' full' : ''}`} /></div>
            <div className="df-btn" onClick={close}><span className="df-x">×</span></div>
          </div>
        </div>

        <div className="rh-main">
          {/* ── The phone ── */}
          <div className="rh-phone-col">
            <div className="rh-phone">
              {running ? (
                <iframe
                  title="RetroHub live demo"
                  src={`${APPETIZE_EMBED}?${EMBED_PARAMS}`}
                  className="rh-frame"
                  frameBorder="0"
                  scrolling="no"
                  allow="clipboard-read; clipboard-write"
                />
              ) : (
                <div className="rh-boot">
                  <pre className="rh-ascii" aria-hidden="true">{String.raw`  ___ ___ _____ ___  ___
 | _ \ __|_   _| _ \/ _ \
 |   / _|  | | |   / (_) |
 |_|_\___| |_| |_|_\\___/
      _  _ _   _ ___
     | || | | | | _ )
     | __ | |_| | _ \
     |_||_|\___/|___/`}</pre>
                  <p className="rh-boot-line">&gt; ANDROID BUILD LOADED<span className="rh-cursor">█</span></p>
                  <button className="rh-start" onClick={() => setRunning(true)}>▶ START DEMO</button>
                  <p className="rh-boot-note">Boots a real Android phone in your browser.<br />First load can take ~20 seconds.</p>
                </div>
              )}
            </div>
            {running && (
              <button className="rh-stop" onClick={() => setRunning(false)}>■ Stop demo</button>
            )}
          </div>

          {/* ── About the app ── */}
          <div className="rh-info">
            <h2 className="rh-title">RetroHub</h2>
            <p className="rh-tag">A retro gaming social app for Android, by Carlos (doncarlis)</p>
            <div className="rh-stack">
              {STACK.map(s => <span key={s}>{s}</span>)}
            </div>

            <fieldset className="rh-box">
              <legend>What to try</legend>
              <ul className="rh-features">
                {FEATURES.map(([emoji, text]) => <li key={text}><span>{emoji}</span>{text}</li>)}
              </ul>
            </fieldset>

            <fieldset className="rh-box">
              <legend>Logging in</legend>
              {hasDemoLogin ? (
                <div className="rh-login">
                  <div><b>Email:</b> <code>{DEMO_LOGIN.email}</code> <button onClick={() => copy(DEMO_LOGIN.email, 'email')}>{copied === 'email' ? '✓' : 'Copy'}</button></div>
                  <div><b>Password:</b> <code>{DEMO_LOGIN.password}</code> <button onClick={() => copy(DEMO_LOGIN.password, 'pw')}>{copied === 'pw' ? '✓' : 'Copy'}</button></div>
                </div>
              ) : (
                <p>Tap <b>Create account</b> inside the app and sign up with any email. Google sign-in may not work in the browser demo.</p>
              )}
            </fieldset>

            <fieldset className="rh-box rh-note">
              <legend>Heads up</legend>
              <p>Demo sessions last about 3 minutes and there are a limited number each month. If the phone won’t start, the demo minutes are used up. Check back soon!</p>
            </fieldset>
          </div>
        </div>

        <div className="sb-statusbar rh-status">
          <span>{running ? 'Streaming live from the cloud…' : 'Ready'}</span>
          <span>Android · Kotlin · Compose</span>
        </div>
      </div>
    </Draggable>
  );
}
