import { useContext, useEffect, useRef, useState } from 'react';
import UseContext from '../Context';
import Draggable from 'react-draggable';
import notesIcon from '../assets/classnotes.png';
import folderIcon from '../assets/folder.png';
import folderOpenIcon from '../assets/folderopen.png';
import '../css/DevFeed.css';
import '../css/ClassNotes.css';

const BASE = import.meta.env.BASE_URL;
const pageCache = {};

async function loadPage(classId, slug) {
  const key = `${classId}/${slug}`;
  if (!pageCache[key]) {
    const res = await fetch(`${BASE}class-notes/${key}.html`);
    if (!res.ok) throw new Error(res.status);
    pageCache[key] = (await res.text()).replaceAll('__BASE__', BASE);
  }
  return pageCache[key];
}

export default function ClassNotes({ show, setShow }) {
  const { themeDragBar } = useContext(UseContext);
  const [index, setIndex] = useState(null);
  const [open, setOpen] = useState({ mac272: true });
  const [current, setCurrent] = useState({ classId: 'mac272', slug: 'overview', anchor: null });
  const [html, setHtml] = useState('');
  const [status, setStatus] = useState('loading');
  const [expand, setExpand] = useState(false);
  const bodyRef = useRef(null);

  useEffect(() => {
    if (!show || index) return;
    fetch(`${BASE}class-notes/index.json`)
      .then(r => r.json())
      .then(setIndex)
      .catch(() => setStatus('error'));
  }, [show, index]);

  useEffect(() => {
    if (!show) return;
    let cancelled = false;
    setStatus('loading');
    loadPage(current.classId, current.slug)
      .then(text => { if (!cancelled) { setHtml(text); setStatus('ready'); } })
      .catch(() => { if (!cancelled) setStatus('error'); });
    return () => { cancelled = true; };
  }, [show, current.classId, current.slug]);

  // After the page renders, scroll to the chosen topic (or back to the top).
  useEffect(() => {
    if (status !== 'ready' || !bodyRef.current) return;
    const el = current.anchor ? bodyRef.current.querySelector(`[id="${current.anchor}"]`) : null;
    const top = el ? el.offsetTop - bodyRef.current.offsetTop - 8 : 0;
    const calm = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    // Brand-new page: jump. Topic on the same page: glide there and flash the heading.
    bodyRef.current.scrollTo({ top, behavior: el && !calm ? 'smooth' : 'auto' });
    if (el) {
      el.classList.remove('cn-flash');
      void el.offsetWidth;
      el.classList.add('cn-flash');
    }
  }, [status, html, current.anchor]);

  if (!show) return null;

  const toggle = id => setOpen(o => ({ ...o, [id]: !o[id] }));
  const go = (classId, slug, anchor = null) => setCurrent({ classId, slug, anchor });

  const currentClass = index?.classes.find(c => c.id === current.classId);
  const currentPage = currentClass?.folders.flatMap(f => f.pages).find(p => p.slug === current.slug);

  return (
    <Draggable handle=".df-dragbar" disabled={expand} bounds={{ top: 0 }}
      defaultPosition={{ x: window.innerWidth <= 500 ? 0 : 90, y: 24 }}>
      <div className="df-window cn-window"
        style={expand
          ? { position: 'fixed', left: 0, top: 0, width: '100%', height: 'calc(100vh - 37px)', zIndex: 9999, resize: 'none' }
          : { zIndex: 9999 }}>
        <div className="df-dragbar" style={{ background: themeDragBar }}>
          <div className="df-barname">
            <img src={notesIcon} alt="" />
            <span>Class Notes</span>
          </div>
          <div className="df-barbtn">
            <div className="df-btn" onClick={() => setShow(false)}><span className="df-dash" /></div>
            <div className="df-btn" onClick={() => setExpand(e => !e)}><span className={`df-expand${expand ? ' full' : ''}`} /></div>
            <div className="df-btn" onClick={() => setShow(false)}><span className="df-x">×</span></div>
          </div>
        </div>

        <div className="cn-toolbar">
          <button onClick={() => go(current.classId, currentClass?.folders[0].pages[0].slug ?? 'overview')}>Home</button>
          <button onClick={() => setOpen(Object.fromEntries((index?.classes ?? []).flatMap(c => [[c.id, true], ...c.folders.map(f => [`${c.id}/${f.title}`, true])])))}>Expand all</button>
          <button onClick={() => setOpen({})}>Collapse all</button>
        </div>

        <div className="cn-main">
          <nav className="cn-tree" aria-label="Contents">
            {!index && status !== 'error' && <p className="cn-hint">Loading…</p>}
            {index?.classes.map(c => (
              <div key={c.id}>
                <button className="cn-row cn-class" onClick={() => toggle(c.id)}>
                  <img src={open[c.id] ? folderOpenIcon : folderIcon} alt="" />
                  <span>{c.title}</span>
                </button>
                {open[c.id] && c.folders.map(f => {
                  const fid = `${c.id}/${f.title}`;
                  const single = f.pages.length === 1 && f.title === 'Overview';
                  if (single) {
                    const p = f.pages[0];
                    return (
                      <button key={fid} className={`cn-row cn-l1${current.classId === c.id && current.slug === p.slug ? ' active' : ''}`} onClick={() => go(c.id, p.slug)}>
                        <span className="cn-doc">?</span><span>{p.title}</span>
                      </button>
                    );
                  }
                  return (
                    <div key={fid}>
                      <button className="cn-row cn-l1" onClick={() => toggle(fid)}>
                        <img src={open[fid] ? folderOpenIcon : folderIcon} alt="" />
                        <span>{f.title}</span>
                      </button>
                      {open[fid] && f.pages.map(p => (
                        <div key={p.slug}>
                          <button className={`cn-row cn-l2${current.classId === c.id && current.slug === p.slug && !current.anchor ? ' active' : ''}`} onClick={() => go(c.id, p.slug)}>
                            <span className="cn-doc">?</span><span>{p.title}</span>
                          </button>
                          {current.classId === c.id && current.slug === p.slug && p.topics.map(t => (
                            <button key={t.id} className={`cn-row cn-l3${current.anchor === t.id ? ' active' : ''}`} onClick={() => go(c.id, p.slug, t.id)}>
                              <span className="cn-dot">•</span><span>{t.title}</span>
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </nav>

          <div className="cn-content" ref={bodyRef}>
            {currentPage && <p className="cn-crumb">{currentClass.title} › {currentPage.title}<span className="cn-cursor">_</span></p>}
            {status === 'error' && <p className="cn-hint">Couldn’t load this page. Try again in a moment.</p>}
            {status === 'loading' && index && <p className="cn-hint cn-loading">Loading<span>.</span><span>.</span><span>.</span></p>}
            {status === 'ready' && <article className="cn-article" key={`${current.classId}/${current.slug}`} dangerouslySetInnerHTML={{ __html: html }} />}
          </div>
        </div>

        <div className="cn-status">
          <span>{currentPage ? currentPage.title : 'Class Notes'}</span>
          <span>{index ? `${index.classes.length} ${index.classes.length === 1 ? "class" : "classes"}` : ''}</span>
        </div>
      </div>
    </Draggable>
  );
}
