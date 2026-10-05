import { useContext, useEffect, useState } from 'react';
import UseContext from '../Context';
import Draggable from 'react-draggable';
import iconInfo from '../icon.json';
import cdIcon from '../assets/rom.png';
import { startVaporwave, stopVaporwave } from './function/vaporwave';
import { isMuted } from './function/sounds';
import '../css/DevFeed.css';
import '../css/Autorun.css';

// What happens when you double-click the CD-ROM drive: the disc spins up and a
// 90s autorun menu opens with Carlos's projects, plus a vaporwave tune.
const PROJECTS = iconInfo.filter(i => i.folderId === 'Project');
const PORTFOLIO = 'https://carlosz98.github.io/MyPortFolio/';

export default function Autorun({ show, setShow }) {
  const { themeDragBar, openInIE, handleShow } = useContext(UseContext);
  const [phase, setPhase] = useState('reading');
  const [view, setView] = useState('menu');
  const [music, setMusic] = useState(false);

  useEffect(() => {
    if (!show) return;
    setPhase('reading');
    setView('menu');
    const t = setTimeout(() => {
      setPhase('ready');
      setMusic(startVaporwave());
    }, 1800);
    return () => { clearTimeout(t); stopVaporwave(); };
  }, [show]);

  if (!show) return null;

  function close() {
    stopVaporwave();
    setShow(false);
  }
  function toggleMusic() {
    if (music) { stopVaporwave(); setMusic(false); }
    else setMusic(startVaporwave());
  }

  return (
    <Draggable handle=".df-dragbar" bounds={{ top: 0 }}
      defaultPosition={{ x: window.innerWidth <= 500 ? 4 : 200, y: window.innerWidth <= 500 ? 50 : 70 }}>
      <div className="df-window ar-window" style={{ zIndex: 9999 }}>
        <div className="df-dragbar" style={{ background: themeDragBar }}>
          <div className="df-barname">
            <img src={cdIcon} alt="" />
            <span>{phase === 'reading' ? 'CD-ROM (E:)' : 'CARLOS_98 - Autorun'}</span>
          </div>
          <div className="df-barbtn">
            <div className="df-btn" onClick={close}><span className="df-x">×</span></div>
          </div>
        </div>

        {phase === 'reading' ? (
          <div className="ar-reading">
            <div className="ar-drive">
              <div className="ar-tray"><div className="ar-disc spin-fast" /></div>
              <span className="ar-led" />
            </div>
            <p>Reading CD-ROM (E:)<span className="ar-dots" /></p>
          </div>
        ) : (
          <div className="ar-stage">
            <div className="ar-sky" aria-hidden="true">
              <div className="ar-sun" />
              <div className="ar-grid" />
            </div>
            <div className="ar-disc ar-corner-disc" aria-hidden="true" />

            <div className="ar-content">
              <h1 className="ar-title">CARLOS ZABALA</h1>
              <p className="ar-sub">ｐｏｒｔｆｏｌｉｏ　ＣＤ－ＲＯＭ　９８</p>

              {view === 'menu' ? (
                <div className="ar-menu">
                  <button onClick={() => setView('projects')}><span>💾</span> Projects</button>
                  <button onClick={() => openInIE(PORTFOLIO)}><span>🌐</span> Portfolio</button>
                  <button onClick={() => handleShow('Resume')}><span>📄</span> Resume</button>
                  <button onClick={toggleMusic} disabled={isMuted()} data-tip={isMuted() ? 'Sounds are muted in the taskbar' : undefined}>
                    <span>{music ? '🔊' : '🔈'}</span> Music {music ? 'On' : 'Off'}
                  </button>
                  <button onClick={close}><span>⏏</span> Exit</button>
                </div>
              ) : (
                <div className="ar-projects">
                  <div className="ar-list">
                    {PROJECTS.map(p => (
                      <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" data-tip={p.description}>
                        <b>{p.name}</b>
                        <span>{(p.description || '').split(/[.—]/)[0]}</span>
                      </a>
                    ))}
                  </div>
                  <button className="ar-back" onClick={() => setView('menu')}>◀ Back</button>
                </div>
              )}
            </div>
            <p className="ar-footer">© 1998 Carlos Software · Insert disc 1 of 1</p>
          </div>
        )}
      </div>
    </Draggable>
  );
}
