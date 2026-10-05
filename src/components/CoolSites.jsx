import { useContext, useEffect, useRef, useState } from 'react';
import UseContext from '../Context';
import Draggable from 'react-draggable';
import coolIcon from '../assets/coolsites.png';
import folderIcon from '../assets/folder.png';
import folderOpenIcon from '../assets/folderopen.png';
import ConsoleSprite from './ConsoleSprite';
import { CONSOLES } from './function/consoleSprites';
import { drawButton88 } from './function/button88';
import { BOOKMARK_FOLDERS, SHRINES, BLOGROLL, NEIGHBORS, MY_BUTTON, SITE_URL } from './function/coolSites';
import '../css/DevFeed.css';
import '../css/CoolSites.css';

const SECTIONS = [
  { id: 'bookmarks', label: 'Bookmarks' },
  { id: 'shrines', label: 'Shrines' },
  { id: 'blogroll', label: 'What I read' },
  { id: 'neighbors', label: 'Neighbors' },
  { id: 'linkme', label: 'Link to me' },
];

const MARQUEE = {
  bookmarks: '*~* Welcome to Carlos’s Cool Sites *~* Click a button to surf *~* Best viewed in 800x600 *~*',
  shrines: '*~* The Shrines *~* Dedicated to the machines that raised me *~*',
  blogroll: '*~* What I read *~* Blogs and channels I keep coming back to *~*',
  neighbors: '*~* Neighbors *~* Friends of this site *~* Want your button here? Send it through Mail! *~*',
  linkme: '*~* Link to me! *~* Copy my button onto your own site *~*',
};

const MY_BUTTON_URL = `${SITE_URL}carlos88x31.png`;
const LINK_CODE = `<a href="${SITE_URL}" target="_blank"><img src="${MY_BUTTON_URL}" width="88" height="31" alt="Carlos's Win98 blog"></a>`;

function Button88({ button, scale = 1 }) {
  const ref = useRef(null);
  useEffect(() => { drawButton88(ref.current.getContext('2d'), button); }, [button]);
  return <canvas ref={ref} width={88} height={31} className="cs-btn88" style={{ width: 88 * scale, height: 31 * scale }} aria-hidden="true" />;
}

function SiteButton({ site, onOpen }) {
  return (
    <button className="cs-site" onClick={() => onOpen(site.url)} data-tip={site.note}>
      <span className="cs-site-btn"><Button88 button={site.button} /><span className="cs-shine" /></span>
      <span className="cs-site-name">{site.name}</span>
    </button>
  );
}

function Bookmarks({ onOpen }) {
  return BOOKMARK_FOLDERS.map(folder => (
    <fieldset key={folder.name} className="cs-group">
      <legend><img src={folderOpenIcon} alt="" /> {folder.name}</legend>
      <div className="cs-site-grid">
        {folder.sites.map(site => <SiteButton key={site.url} site={site} onOpen={onOpen} />)}
      </div>
    </fieldset>
  ));
}

function Shrines() {
  const [index, setIndex] = useState(0);
  const shrine = SHRINES[index];
  const sprite = CONSOLES.find(c => c.id === shrine.console);
  return (
    <div className="cs-shrine">
      <div className="cs-stars" aria-hidden="true" />
      <div className="cs-shrine-tabs">
        {SHRINES.map((s, i) => (
          <button key={s.id} className={i === index ? 'active' : ''} onClick={() => setIndex(i)}>{CONSOLES.find(c => c.id === s.console)?.name}</button>
        ))}
      </div>
      <h2 className="cs-rainbow" key={shrine.id}>{shrine.title}</h2>
      <div className="cs-rainbow-bar" />
      <div className="cs-shrine-body" key={`b-${shrine.id}`}>
        <div className="cs-altar">
          <span className="cs-sparkle s1">✦</span>
          <span className="cs-sparkle s2">✧</span>
          <span className="cs-sparkle s3">✦</span>
          <span className="cs-sparkle s4">✧</span>
          <div className="cs-bob">{sprite && <ConsoleSprite rows={sprite.rows} scale={6} />}</div>
          <div className="cs-pedestal" />
          {sprite && <p className="cs-year">~ {sprite.year} ~</p>}
        </div>
        <div className="cs-facts">
          <p className="cs-facts-title"><span className="cs-blink">★</span> Did you know? <span className="cs-blink">★</span></p>
          <ul>{shrine.facts.map(f => <li key={f}>{f}</li>)}</ul>
          <p className="cs-why"><b>Why it&apos;s here:</b> {shrine.why}</p>
        </div>
      </div>
    </div>
  );
}

function Blogroll({ onOpen }) {
  return (
    <table className="cs-table">
      <thead><tr><th>Site</th><th>Why I read it</th></tr></thead>
      <tbody>
        {BLOGROLL.map((b, i) => (
          <tr key={b.url} onClick={() => onOpen(b.url)}>
            <td><span className="cs-arrow">►</span> <u>{b.name}</u>{i === 0 && <span className="cs-new">NEW!</span>}</td>
            <td>{b.why}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Neighbors({ onOpen }) {
  const random = () => onOpen(NEIGHBORS[Math.floor(Math.random() * NEIGHBORS.length)].url);
  return (
    <>
      <div className="cs-site-grid cs-neighbors">
        {NEIGHBORS.map(site => <SiteButton key={site.url} site={site} onOpen={onOpen} />)}
        <div className="cs-slot" data-tip="Send me your 88x31 button through Mail">
          <span>YOUR BUTTON<br />HERE<span className="cs-cursor">_</span></span>
        </div>
      </div>
      <div className="cs-ring">
        <span className="cs-ring-title">~ The Carlos Ring ~</span>
        <div>
          <button onClick={() => onOpen(NEIGHBORS[NEIGHBORS.length - 1].url)}>« Prev</button>
          <button onClick={random}>Random</button>
          <button onClick={() => onOpen(NEIGHBORS[0].url)}>Next »</button>
        </div>
      </div>
    </>
  );
}

function LinkToMe() {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try { await navigator.clipboard.writeText(LINK_CODE); }
    catch {
      const t = document.createElement('textarea');
      t.value = LINK_CODE; document.body.appendChild(t); t.select();
      document.execCommand('copy'); t.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }
  return (
    <div className="cs-linkme">
      <p>Got a site? Put my button on it and link back here!</p>
      <div className="cs-linkme-preview">
        <span className="cs-sparkle s1">✦</span>
        <span className="cs-sparkle s3">✧</span>
        <span className="cs-site-btn big"><Button88 button={MY_BUTTON} scale={2} /><span className="cs-shine" /></span>
        <span className="cs-site-btn"><Button88 button={MY_BUTTON} /><span className="cs-shine" /></span>
      </div>
      <textarea readOnly value={LINK_CODE} onFocus={e => e.target.select()} rows={4} />
      <div className="cs-linkme-btns">
        <button onClick={copy}>📋 Copy code</button>
        <a href={MY_BUTTON_URL} download="carlos88x31.png">💾 Save button</a>
        {copied && <span className="cs-copied">Copied to clipboard!</span>}
      </div>
    </div>
  );
}

export default function CoolSites({ show, setShow }) {
  const { themeDragBar, openInIE } = useContext(UseContext);
  const [section, setSection] = useState('bookmarks');
  const [expand, setExpand] = useState(false);
  const [behind, setBehind] = useState(false);

  if (!show) return null;

  // Sites open in the site's Internet Explorer window, which comes to the front.
  function open(url) {
    openInIE(url);
    setBehind(true);
  }

  return (
    <Draggable handle=".df-dragbar" disabled={expand} bounds={{ top: 0 }}
      defaultPosition={{ x: window.innerWidth <= 500 ? 0 : 110, y: 30 }}>
      <div className="df-window cs-window" onMouseDown={() => setBehind(false)} onTouchStart={() => setBehind(false)}
        style={expand
          ? { position: 'fixed', left: 0, top: 0, width: '100%', height: 'calc(100vh - 37px)', zIndex: behind ? 5 : 9999, resize: 'none' }
          : { zIndex: behind ? 5 : 9999 }}>
        <div className="df-dragbar" style={{ background: themeDragBar }}>
          <div className="df-barname">
            <img src={coolIcon} alt="" />
            <span>Cool Sites</span>
          </div>
          <div className="df-barbtn">
            <div className="df-btn" onClick={() => setShow(false)}><span className="df-dash" /></div>
            <div className="df-btn" onClick={() => setExpand(e => !e)}><span className={`df-expand${expand ? ' full' : ''}`} /></div>
            <div className="df-btn" onClick={() => setShow(false)}><span className="df-x">×</span></div>
          </div>
        </div>

        <div className="cs-top">
          <div className="cs-marquee"><span key={section}>{MARQUEE[section]}</span></div>
          <img className="cs-globe" src={coolIcon} alt="" />
        </div>

        <div className="cs-main">
          <nav className="cs-side">
            <p className="cs-side-title">Cool Sites</p>
            {SECTIONS.map(s => (
              <button key={s.id} className={section === s.id ? 'active' : ''} onClick={() => setSection(s.id)}>
                <img src={section === s.id ? folderOpenIcon : folderIcon} alt="" />
                <span>{s.label}</span>
              </button>
            ))}
          </nav>
          <div className={`cs-content cs-content-${section}`} key={section}>
            {section === 'bookmarks' && <Bookmarks onOpen={open} />}
            {section === 'shrines' && <Shrines />}
            {section === 'blogroll' && <Blogroll onOpen={open} />}
            {section === 'neighbors' && <Neighbors onOpen={open} />}
            {section === 'linkme' && <LinkToMe />}
          </div>
        </div>

        <div className="sb-statusbar cs-status">
          <span>{SECTIONS.find(s => s.id === section).label}</span>
          <span>Document: Done</span>
        </div>
      </div>
    </Draggable>
  );
}
