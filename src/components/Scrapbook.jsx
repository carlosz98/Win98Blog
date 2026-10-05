import { useContext, useEffect, useState } from 'react';
import UseContext from '../Context';
import Draggable from 'react-draggable';
import scrapbookIcon from '../assets/scrapbook.png';
import photoIcon from '../assets/jpeg.png';
import notepadIcon from '../assets/notepad.png';
import demoTurtle from '../assets/007.jpg';
import demoDog from '../assets/004.jpg';
import demoCat from '../assets/cat.gif';
import demoVideo from '../assets/catvideo.mp4';
import { communityStore, CAPTION_MAX, SCRAP_SRC_MAX } from './function/communityStore';
import { devfeedStore, isShared } from './function/devfeedStore';
import '../css/DevFeed.css';
import '../css/Scrapbook.css';

// Shown only while the scrapbook has no real posts, so the layout can be previewed.
const DEMO_POSTS = [
  { id: 'demo1', kind: 'image', src: demoTurtle, caption: 'Weekend snorkeling trip. This guy swam right past me.', tag: 'travel', date: 'Oct 5, 2026' },
  { id: 'demo2', kind: 'text', src: '', caption: 'Note to self: finish the Win98 site, then start the RetroHub update. Coffee first.', tag: 'notes', date: 'Oct 4, 2026' },
  { id: 'demo3', kind: 'image', src: demoCat, caption: 'Office supervisor approves this commit.', tag: 'cats', date: 'Oct 3, 2026' },
  { id: 'demo4', kind: 'video', src: demoVideo, caption: 'Short clip test. Videos play right in the window.', tag: 'video', date: 'Oct 2, 2026' },
  { id: 'demo5', kind: 'image', src: demoDog, caption: 'Found this guy at the park.', tag: 'life', date: 'Oct 1, 2026' },
];


// Turns a pasted link into a post: YouTube becomes an embed, .mp4/.webm a video,
// anything else (JPG, PNG, GIF) a picture.
function postFromLink(link) {
  const url = link.trim();
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return { kind: 'youtube', src: yt[1] };
  if (/\.(mp4|webm)(\?.*)?$/i.test(url)) return { kind: 'video', src: url };
  return { kind: 'image', src: url };
}

// Fake file name for the window title, based on the caption and media type.
function fileName(post) {
  const base = (post.caption || post.tag || 'post')
    .toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 18).replace(/^_+|_+$/g, '') || 'post';
  if (post.kind === 'text') return `${base}.txt`;
  if (post.kind === 'video' || post.kind === 'youtube') return `${base}.mp4`;
  return /\.gif(\?|$)/i.test(post.src) || post.src.startsWith('data:image/gif') ? `${base}.gif` : `${base}.jpg`;
}

// Shrinks an uploaded photo to a JPEG small enough to store in the database.
function shrinkImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, 900 / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(img.src);
      for (const quality of [0.85, 0.7, 0.55, 0.4]) {
        const data = canvas.toDataURL('image/jpeg', quality);
        if (data.length <= SCRAP_SRC_MAX) return resolve(data);
      }
      reject(new Error('That picture is too big.'));
    };
    img.onerror = () => reject(new Error('Could not read that picture.'));
    img.src = URL.createObjectURL(file);
  });
}

function PostMedia({ post }) {
  if (post.kind === 'text') return null;
  if (post.kind === 'youtube') {
    return (
      <div className="sb-video-frame">
        <iframe src={`https://www.youtube-nocookie.com/embed/${post.src}`} title={post.caption || 'Video'}
          allow="encrypted-media; picture-in-picture" allowFullScreen />
      </div>
    );
  }
  if (post.kind === 'video') {
    return <video className="sb-media" src={post.src} controls muted loop playsInline preload="metadata" />;
  }
  return <img className="sb-media" src={post.src} alt={post.caption} loading="lazy" draggable={false} />;
}

function PostWindow({ post, themeDragBar, onClose, onDelete, isAdmin, focused, onFocus }) {
  const text = post.kind === 'text';
  return (
    <div className={`sb-post${text ? ' sb-post-text' : ''}`} onMouseDown={onFocus} onTouchStart={onFocus}>
      <div className="sb-post-bar" style={{ background: focused ? themeDragBar : '#808080' }}>
        <span className="sb-post-title">
          <img src={text ? notepadIcon : photoIcon} alt="" />
          {fileName(post)}
        </span>
        <span className="sb-post-btns">
          {isAdmin && !post.id.startsWith('demo') && (
            <button onClick={onDelete} title="Delete post" aria-label="Delete post">🗑</button>
          )}
          <button onClick={onClose} aria-label="Close">×</button>
        </span>
      </div>
      <div className="sb-post-body">
        <PostMedia post={post} />
        {post.caption && <p className="sb-caption">{post.caption}</p>}
      </div>
      <div className="sb-post-status">
        <span>{post.date}</span>
        {post.tag && <span>#{post.tag}</span>}
      </div>
    </div>
  );
}

export default function Scrapbook({ show, setShow }) {
  const { themeDragBar } = useContext(UseContext);
  const [posts, setPosts] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [closed, setClosed] = useState([]);
  const [expand, setExpand] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [composer, setComposer] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!show) return;
    return communityStore.subscribeScrapbook(
      list => { setPosts(list); setLoaded(true); },
      () => { setLoaded(true); setStatus('Could not load the scrapbook right now.'); },
    );
  }, [show]);
  useEffect(() => devfeedStore.onAdminChange(setIsAdmin), []);

  const demo = loaded && posts.length === 0;
  const shown = (demo ? DEMO_POSTS : posts).filter(p => !closed.includes(p.id));

  async function handleNewPost() {
    if (isAdmin) { setComposer(c => !c); return; }
    try {
      await devfeedStore.login(isShared ? undefined : window.prompt('Admin password'));
      setComposer(true);
    } catch (err) {
      setStatus(err.message || 'Only Carlos can post here.');
    }
  }

  async function handleDelete(post) {
    if (!window.confirm('Delete this post?')) return;
    try { await communityStore.deleteScrapbookPost(post.id); }
    catch { setStatus('Could not delete that post.'); }
  }

  if (!show) return null;

  return (
    <Draggable handle=".df-dragbar" disabled={expand} bounds={{ top: 0 }}
      defaultPosition={{ x: window.innerWidth <= 500 ? 0 : 90, y: window.innerWidth <= 500 ? 40 : 40 }}>
      <div className="df-window sb-window"
        style={expand
          ? { position: 'fixed', left: 0, top: 0, width: '100%', height: 'calc(100vh - 37px)', zIndex: 9999, resize: 'none' }
          : { zIndex: 9999 }}>
        <div className="df-dragbar" style={{ background: themeDragBar }}>
          <div className="df-barname">
            <img src={scrapbookIcon} alt="" />
            <span>Scrapbook</span>
          </div>
          <div className="df-barbtn">
            <div className="df-btn" onClick={() => setShow(false)}><span className="df-dash" /></div>
            <div className="df-btn" onClick={() => setExpand(e => !e)}><span className={`df-expand${expand ? ' full' : ''}`} /></div>
            <div className="df-btn" onClick={() => setShow(false)}><span className="df-x">×</span></div>
          </div>
        </div>

        <div className="sb-toolbar">
          <button onClick={() => setClosed([])} disabled={!closed.length}>↺ Show all</button>
          <button onClick={handleNewPost}>{isAdmin ? '📝 New post' : '🔒 Post'}</button>
          {isAdmin && <button onClick={() => devfeedStore.logout()}>Log out</button>}
        </div>

        {composer && isAdmin && (
          <Composer onDone={() => setComposer(false)} setStatus={setStatus} />
        )}

        <div className="sb-area sb-grid">
          {shown.map(post => (
              <div key={post.id} className="sb-grid-item">
                <PostWindow post={post} themeDragBar={themeDragBar} isAdmin={isAdmin} focused
                  onFocus={() => {}}
                  onClose={() => setClosed(c => [...c, post.id])}
                  onDelete={() => handleDelete(post)} />
              </div>
            ))}
          {loaded && !shown.length && <p className="sb-empty">All windows closed. Click “Show all”.</p>}
        </div>

        <div className="sb-statusbar">
          <span>{loaded ? `${demo ? DEMO_POSTS.length : posts.length} post(s)${demo ? ' (demo)' : ''}` : 'Loading…'}</span>
          <span>{status || 'Grid view'}</span>
        </div>
      </div>
    </Draggable>
  );
}

function Composer({ onDone, setStatus }) {
  const [link, setLink] = useState('');
  const [upload, setUpload] = useState(null);
  const [caption, setCaption] = useState('');
  const [tag, setTag] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      // GIFs keep their animation, so they are stored as-is when small enough.
      if (file.type === 'image/gif' && file.size * 1.37 <= SCRAP_SRC_MAX) {
        const reader = new FileReader();
        reader.onload = () => setUpload(reader.result);
        reader.readAsDataURL(file);
      } else {
        setUpload(await shrinkImage(file));
      }
      setLink('');
    } catch (err) {
      setStatus(err.message);
    }
  }

  async function handlePost(e) {
    e.preventDefault();
    if (busy) return;
    const media = upload ? { kind: 'image', src: upload } : link.trim() ? postFromLink(link) : { kind: 'text', src: '' };
    setBusy(true);
    try {
      await communityStore.addScrapbookPost({ ...media, caption, tag });
      setStatus('Posted!');
      onDone();
    } catch (err) {
      setStatus(err.message?.startsWith('Please') || err.message?.startsWith('That') ? err.message : 'Could not post right now.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="sb-composer" onSubmit={handlePost}>
      <label>Picture
        <input type="file" accept="image/*" onChange={handleFile} />
      </label>
      <label>or link
        <input type="url" placeholder="GIF, image, .mp4 or YouTube link" value={link}
          onChange={e => { setLink(e.target.value); setUpload(null); }} />
      </label>
      <label>Caption
        <input type="text" maxLength={CAPTION_MAX} value={caption} onChange={e => setCaption(e.target.value)} />
      </label>
      <label>Tag
        <input type="text" maxLength={20} placeholder="tech" value={tag} onChange={e => setTag(e.target.value)} />
      </label>
      {upload && <img className="sb-preview" src={upload} alt="Preview" />}
      <div className="sb-composer-btns">
        <button type="submit" disabled={busy}>{busy ? 'Posting…' : 'Post'}</button>
        <button type="button" onClick={onDone}>Cancel</button>
      </div>
    </form>
  );
}
