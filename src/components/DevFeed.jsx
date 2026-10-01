import { useContext, useState, useEffect, useRef } from 'react';
import UseContext from '../Context';
import Draggable from 'react-draggable';
import { motion, AnimatePresence } from 'framer-motion';
import { FcLeft, FcRight, FcRefresh, FcHome, FcSearch, FcBookmark, FcClock, FcVideoCall, FcStackOfPhotos, FcCollaboration, FcNews, FcGallery, FcPortraitMode } from 'react-icons/fc';
import newsIcon from '../assets/news.png';
import { devfeedStore, isShared } from './function/devfeedStore';
import '../css/DevFeed.css';

const PROJECTS = [
  { name: 'RetroHub',     color: '#1a47a8', emoji: '📱' },
  { name: 'FlappyBird',  color: '#2a8a2a', emoji: '🐦' },
  { name: 'Gunbound2D',  color: '#a83220', emoji: '💥' },
  { name: 'LibraryMgmt', color: '#7a3a9a', emoji: '📚' },
  { name: 'Win98Blog',   color: '#1a7a6a', emoji: '💻' },
  { name: 'GPACalc',     color: '#8a6a10', emoji: '🎓' },
  { name: 'NetflixDB',   color: '#a82020', emoji: '🎬' },
  { name: 'WarmRain',    color: '#1a5a8a', emoji: '🌧️' },
  { name: 'PixelCity',   color: '#4a2a8a', emoji: '🏙️' },
];

const SHARE_URL = 'https://github.com/carlosz98';
const PROFILE_IMG = 'https://www.image2url.com/r2/default/images/1779668696401-898704a7-949a-4304-bd28-dc369d0df131.jpg';

const SEED_POSTS = [
  {
    id: 1,
    title: 'RetroHub — Android App Launched',
    body: 'Finally pushed the final build. Built with Kotlin and Jetpack Compose, added Firebase auth and a full WebView browser. The retro UI theme came out exactly how I imagined it.',
    tags: ['#Android', '#Kotlin', '#Firebase', '#JetpackCompose'],
    media: 'https://media.giphy.com/media/3oKIPnAiaMCws8nOsE/giphy.gif',
    project: 'RetroHub',
    time: '2h ago',
    likes: 0,
    likedBy: [],
    comments: [],
  },
  {
    id: 2,
    title: 'FlappyBird Unity — OOP Deep Dive',
    body: 'Rebuilt the collision system from scratch using proper OOP patterns. C# scripting is genuinely fun once you get the Unity lifecycle.',
    tags: ['#Unity', '#CSharp', '#GameDev', '#OOP'],
    media: null,
    project: 'FlappyBird',
    time: '1d ago',
    likes: 0,
    likedBy: [],
    comments: [],
  },
  {
    id: 3,
    title: 'WarmRain UE5 — Game Doc Complete',
    body: '50 pages of game documentation done. Story arcs, level design sketches, mechanic breakdowns. Now moving into Blueprints and C++ implementation.',
    tags: ['#UnrealEngine5', '#GameDev', '#CPlusPlus'],
    media: 'https://media.giphy.com/media/l0HlNQ03J5JxX6lva/giphy.gif',
    project: 'WarmRain',
    time: '3d ago',
    likes: 0,
    likedBy: [],
    comments: [],
  },
];

function getProject(name) {
  return PROJECTS.find(p => p.name === name) || { color: '#555', emoji: '📁' };
}

// ── Get a per-browser user ID so likes persist per visitor ──
function getUserId() {
  let id = localStorage.getItem('df_user_id');
  if (!id) {
    id = 'user_' + Math.random().toString(36).slice(2, 9);
    localStorage.setItem('df_user_id', id);
  }
  return id;
}

export default function DevFeed({ show, setShow }) {
  const { themeDragBar } = useContext(UseContext);

  const [expand, setExpand]           = useState(false);
  const [focus, setFocus]             = useState(true);
  const [posts, setPosts]             = useState([]);
  const [feedError, setFeedError]     = useState('');
  const [activeStory, setActiveStory] = useState(null);
  const [tab, setTab]                 = useState('feed'); // feed | photos
  const mainRef                       = useRef(null);
  const storiesRef                    = useRef(null);
  const userId                        = getUserId();

  // ── Auth ──
  const [isAdmin, setIsAdmin]         = useState(false);
  const [showLogin, setShowLogin]     = useState(false);
  const [pwInput, setPwInput]         = useState('');
  const [pwError, setPwError]         = useState('');

  // ── Composer ──
  const [composerOpen, setComposerOpen] = useState(false);
  const [title, setTitle]             = useState('');
  const [body, setBody]               = useState('');
  const [tagInput, setTagInput]       = useState('');
  const [tags, setTags]               = useState([]);
  const [mediaUrl, setMediaUrl]       = useState('');
  const [selProject, setSelProject]   = useState(PROJECTS[0].name);

  // ── Comments UI ──
  const [openComments, setOpenComments] = useState({}); // postId → bool
  const [commentInputs, setCommentInputs] = useState({}); // postId → string
  const [commentNames, setCommentNames]   = useState({}); // postId → string
  const [copiedId, setCopiedId]         = useState(null);

  // ── Load posts and admin state from the store ──
  useEffect(() => devfeedStore.subscribe(
    next => { setPosts(next); setFeedError(''); },
    err => { console.error('DevFeed load failed', err); setFeedError('Could not load posts.'); },
    SEED_POSTS,
  ), []);
  useEffect(() => devfeedStore.onAdminChange(setIsAdmin), []);

  function run(promise) {
    promise.catch(err => {
      console.error('DevFeed save failed', err);
      setFeedError('Could not save that change. Please try again.');
    });
  }

  // ── Admin ──
  async function handleLogin(e) {
    e?.preventDefault();
    try {
      await devfeedStore.login(pwInput);
      setIsAdmin(true);
      setShowLogin(false); setPwInput(''); setPwError('');
      setComposerOpen(true);
      run(devfeedStore.seedIfEmpty(SEED_POSTS));
    } catch (err) {
      setPwError(err.message); setPwInput('');
    }
  }
  function handleLogout() {
    setIsAdmin(false); setComposerOpen(false);
    run(devfeedStore.logout());
  }
  function handleNewPostClick() {
    if (isAdmin) setComposerOpen(o => !o);
    else setShowLogin(true);
  }

  // ── Post ──
  function handlePost() {
    if (!title.trim() && !body.trim()) return;
    run(devfeedStore.addPost({
      title: title.trim(), body: body.trim(),
      tags, media: mediaUrl.trim() || null,
      project: selProject,
    }));
    setTitle(''); setBody(''); setTags([]); setTagInput(''); setMediaUrl('');
    setComposerOpen(false);
  }

  function handleDeletePost(post) {
    run(devfeedStore.deletePost(post));
  }

  function handleTagKey(e) {
    if ((e.key === 'Enter' || e.key === ' ') && tagInput.trim()) {
      const t = tagInput.trim().startsWith('#') ? tagInput.trim() : '#' + tagInput.trim();
      setTags(prev => [...prev, t]);
      setTagInput(''); e.preventDefault();
    }
  }

  // ── Like ──
  function toggleLike(post) {
    run(devfeedStore.toggleLike(post, userId));
  }

  // ── Comment ──
  function toggleComments(postId) {
    setOpenComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  }

  function submitComment(post) {
    const postId = post.id;
    const text = (commentInputs[postId] || '').trim();
    const name = (commentNames[postId] || '').trim() || 'Anonymous';
    if (!text) return;
    const comment = {
      id: Date.now(),
      name,
      text,
      time: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };
    run(devfeedStore.addComment(post, comment));
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    setCommentNames(prev => ({ ...prev, [postId]: '' }));
  }

  function deleteComment(post, comment) {
    run(devfeedStore.deleteComment(post, comment));
  }

  // ── Share ──
  function handleShare(postId) {
    navigator.clipboard.writeText(SHARE_URL).then(() => {
      setCopiedId(postId);
      setTimeout(() => setCopiedId(null), 2000);
    });
  }

  function goHome() {
    setActiveStory(null); setTab('feed');
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function scrollStories() {
    storiesRef.current?.scrollBy({ left: 180, behavior: 'smooth' });
  }

  const visiblePosts = posts.filter(p =>
    (!activeStory || p.project === activeStory) && (tab !== 'photos' || p.media)
  );

  if (!show) return null;

  return (
    <Draggable
      handle=".df-dragbar"
      grid={[1,1]}
      disabled={expand}
      bounds={{ top: 0 }}
      defaultPosition={{ x: 80, y: 60 }}
      onStart={() => setFocus(true)}
    >
      <div
        className="df-window"
        style={expand
          ? { position:'fixed',left:0,top:0,width:'100%',height:'calc(100vh - 37px)',zIndex:9999,resize:'none',display:'flex',flexDirection:'column' }
          : { zIndex:9999, display:'flex', flexDirection:'column' }}
        onClick={() => setFocus(true)}
      >
        {/* TITLE BAR */}
        <div className="df-dragbar" style={{ background: focus ? themeDragBar : '#757579' }}>
          <div className="df-barname">
            <img src={newsIcon} alt="" />
            <span>DevFeed — Carlos Zabala</span>
          </div>
          <div className="df-barbtn">
            <div className="df-btn" onClick={() => setShow(false)}><span className="df-dash"/></div>
            <div className="df-btn" onClick={() => setExpand(e => !e)}><span className={`df-expand${expand?' full':''}`}/></div>
            <div className="df-btn" onClick={() => setShow(false)}><span className="df-x">×</span></div>
          </div>
        </div>

        {/* MENU BAR */}
        <div className="df-menubar">
          <span>File</span><span>Edit</span><span>View</span>
          {isAdmin && <span className="df-admin-badge" onClick={handleLogout} title="Click to logout">🔑 Admin</span>}
        </div>

        {/* IE-STYLE TOOLBAR */}
        <div className="df-toolbar-ie">
          <button className="df-ie-btn" disabled><FcLeft /><span>Back</span></button>
          <button className="df-ie-btn" disabled><FcRight /><span>Forward</span></button>
          <div className="df-ie-sep" />
          <button className="df-ie-btn" onClick={goHome} title="Refresh"><FcRefresh /><span>Refresh</span></button>
          <button className="df-ie-btn" onClick={goHome} title="Home"><FcHome /><span>Home</span></button>
          <div className="df-ie-sep" />
          <button className="df-ie-btn" onClick={() => setTab('photos')} title="Photos"><FcSearch /><span>Photos</span></button>
          <button className="df-ie-btn" onClick={() => window.open(SHARE_URL, '_blank')} title="GitHub"><FcBookmark /><span>Favorites</span></button>
          <button className="df-ie-btn" disabled><FcClock /><span>History</span></button>
        </div>

        {/* TABS */}
        <div className="df-tabs">
          <button className={`df-tab${tab==='feed'?' active':''}`} onClick={() => setTab('feed')} title="Feed"><FcNews /></button>
          <button className={`df-tab${tab==='photos'?' active':''}`} onClick={() => setTab('photos')} title="Photos"><FcGallery /></button>
          <button className="df-tab" onClick={() => window.open(SHARE_URL, '_blank')} title="Projects on GitHub"><FcCollaboration /></button>
          <button className="df-tab" onClick={handleNewPostClick} title={isAdmin ? 'New post' : 'Admin login'}><FcPortraitMode /></button>
        </div>

        <div className="df-body" style={expand ? { height:'calc(100vh - 150px)' } : {}}>
        <div className="df-main" ref={mainRef}>

          {/* ── LOGIN MODAL ── */}
          <AnimatePresence>
            {showLogin && (
              <motion.div className="df-login-overlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                onClick={() => { setShowLogin(false); setPwError(''); }}>
                <motion.div className="df-login-box" initial={{scale:0.9,y:-10}} animate={{scale:1,y:0}} exit={{scale:0.9}}
                  onClick={e => e.stopPropagation()}>
                  <div className="df-login-title" style={{ background: themeDragBar }}>
                    <span>🔒 Admin Login</span>
                    <button onClick={() => { setShowLogin(false); setPwError(''); }}>×</button>
                  </div>
                  <form className="df-login-form" onSubmit={handleLogin}>
                    {isShared ? (
                      <p>Sign in with the admin Google account to post.</p>
                    ) : (
                      <>
                        <p>Enter admin password to post:</p>
                        <input type="password" value={pwInput} onChange={e => setPwInput(e.target.value)} placeholder="Password" autoFocus />
                      </>
                    )}
                    {pwError && <span className="df-login-error">{pwError}</span>}
                    <div className="df-login-btns">
                      <button type="submit" className="df-post-btn">{isShared ? 'Sign in with Google' : 'Login'}</button>
                      <button type="button" className="df-cancel-btn" onClick={() => { setShowLogin(false); setPwError(''); }}>Cancel</button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── STORIES ── */}
          <div className="df-panel df-stories-wrap">
            <div className="df-stories" ref={storiesRef}>
              {/* Create post card */}
              <div className="df-story df-story-create" onClick={handleNewPostClick}>
                <div className="df-story-create-photo">
                  <img src={PROFILE_IMG} alt="Carlos" />
                  <span className="df-story-check">{isAdmin ? '✓' : '+'}</span>
                </div>
                <div className="df-story-create-bottom">{isAdmin ? 'Create post' : 'Admin'}</div>
              </div>
              {/* One story card per post */}
              {posts.slice(0,10).map(p => {
                const proj = getProject(p.project);
                return (
                  <div key={p.id}
                    className={`df-story${activeStory===p.project?' selected':''}`}
                    style={{ background: proj.color }}
                    onClick={() => setActiveStory(activeStory===p.project ? null : p.project)}
                  >
                    {p.media
                      ? <img className="df-story-bg" src={p.media} alt="" />
                      : <span className="df-story-emoji">{proj.emoji}</span>}
                    <img className="df-story-avatar" src={PROFILE_IMG} alt="" />
                    <span className="df-story-name">{p.title ? p.title : p.project}</span>
                  </div>
                );
              })}
            </div>
            <button className="df-arrow-btn" onClick={scrollStories} title="More">▶</button>
          </div>

          {/* ── STATUS BAR ── */}
          <div className="df-panel df-status-bar">
            <div className="df-status-input-row">
              <img className="df-avatar-img" src={PROFILE_IMG} alt="Carlos"/>
              <div className="df-status-input" onClick={handleNewPostClick}>
                {isAdmin ? "What's on your mind, Carlos?" : "What's new with Carlos?"}
              </div>
            </div>
            <div className="df-status-btns">
              <button className="df-status-btn" onClick={handleNewPostClick}><FcVideoCall /> Live video</button>
              <button className="df-status-btn" onClick={handleNewPostClick}><FcStackOfPhotos /> Photo/video</button>
              <button className="df-status-btn" onClick={handleNewPostClick}><span className="df-feel">😊</span> Feeling/activity</button>
            </div>
          </div>

          {/* ── ROOM ROW ── */}
          <div className="df-panel df-room-row">
            <button className="df-room-btn" onClick={handleNewPostClick}><FcCollaboration /> {isAdmin ? 'Create post' : 'Projects'}</button>
            <div className="df-room-avatars">
              {PROJECTS.map(p => (
                <div key={p.name}
                  className={`df-mini-avatar${activeStory===p.name?' selected':''}`}
                  style={{background:p.color}} title={p.name}
                  onClick={() => setActiveStory(activeStory===p.name ? null : p.name)}
                >
                  {p.emoji}<span className="df-online-dot" />
                </div>
              ))}
            </div>
          </div>

          {/* ── FILTER ── */}
          {activeStory && (
            <div className="df-filter-bar">
              <span>📌 <strong>{activeStory}</strong></span>
              <button onClick={() => setActiveStory(null)}>✕ Clear</button>
            </div>
          )}

          {/* ── COMPOSER ── */}
          <AnimatePresence>
            {composerOpen && isAdmin && (
              <motion.div className="df-composer"
                initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.15}}>
                <div className="df-composer-header">
                  <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                    <img src={PROFILE_IMG}
                      style={{width:'28px',height:'28px',objectFit:'cover',border:'1px solid #fff',borderRightColor:'#808080',borderBottomColor:'#808080',flexShrink:0}}
                      alt="Carlos"
                    />
                    <span>📝 Create Post</span>
                  </div>
                  <button onClick={() => setComposerOpen(false)}>✕</button>
                </div>
                <div className="df-field">
                  <label>Project</label>
                  <select value={selProject} onChange={e => setSelProject(e.target.value)}>
                    {PROJECTS.map(p => <option key={p.name} value={p.name}>{p.emoji} {p.name}</option>)}
                  </select>
                </div>
                <div className="df-field">
                  <label>Title</label>
                  <input type="text" placeholder="Update title..." value={title} onChange={e => setTitle(e.target.value)} />
                </div>
                <div className="df-field">
                  <label>What's the update?</label>
                  {/* ── Text formatting toolbar ── */}
                  <div className="df-toolbar">
                    <button type="button" className="df-tool-btn" title="Bold"
                      onClick={() => {
                        const sel = window.getSelection();
                        const ta = document.getElementById('df-body-input');
                        if (!ta) return;
                        const start = ta.selectionStart;
                        const end = ta.selectionEnd;
                        if (start === end) {
                          const newBody = body.slice(0,start) + '**bold text**' + body.slice(end);
                          setBody(newBody);
                        } else {
                          const selected = body.slice(start, end);
                          const newBody = body.slice(0,start) + '**' + selected + '**' + body.slice(end);
                          setBody(newBody);
                        }
                      }}
                    ><b>B</b></button>
                    <button type="button" className="df-tool-btn" title="Italic"
                      onClick={() => {
                        const ta = document.getElementById('df-body-input');
                        if (!ta) return;
                        const start = ta.selectionStart;
                        const end = ta.selectionEnd;
                        if (start === end) {
                          setBody(b => b.slice(0,start) + '*italic text*' + b.slice(end));
                        } else {
                          const selected = body.slice(start, end);
                          setBody(body.slice(0,start) + '*' + selected + '*' + body.slice(end));
                        }
                      }}
                    ><i>I</i></button>
                    <button type="button" className="df-tool-btn" title="Underline"
                      onClick={() => {
                        const ta = document.getElementById('df-body-input');
                        if (!ta) return;
                        const start = ta.selectionStart;
                        const end = ta.selectionEnd;
                        if (start === end) {
                          setBody(b => b.slice(0,start) + '__underline__' + b.slice(end));
                        } else {
                          const selected = body.slice(start, end);
                          setBody(body.slice(0,start) + '__' + selected + '__' + body.slice(end));
                        }
                      }}
                    ><u>U</u></button>
                    <div className="df-toolbar-sep"/>
                    <button type="button" className="df-tool-btn" title="Bullet point"
                      onClick={() => setBody(b => b + '\n• ')}
                    >•</button>
                    <button type="button" className="df-tool-btn" title="Code"
                      onClick={() => {
                        const ta = document.getElementById('df-body-input');
                        if (!ta) return;
                        const start = ta.selectionStart;
                        const end = ta.selectionEnd;
                        const selected = body.slice(start, end);
                        setBody(body.slice(0,start) + '`' + (selected || 'code') + '`' + body.slice(end));
                      }}
                    >{'{}'}</button>
                  </div>
                  <textarea
                    id="df-body-input"
                    rows={4}
                    placeholder="Describe what you built, fixed, or learned..."
                    value={body}
                    onChange={e => setBody(e.target.value)}
                    style={{marginTop:0}}
                  />
                </div>
                <div className="df-field">
                  <label>Tags (Enter or Space)</label>
                  <div className="df-tags-input">
                    {tags.map((t,i) => (
                      <span key={i} className="df-tag" onClick={() => setTags(prev => prev.filter((_,idx) => idx!==i))}>{t} ✕</span>
                    ))}
                    <input type="text" placeholder="#C++ #Unity..." value={tagInput}
                      onChange={e => setTagInput(e.target.value)} onKeyDown={handleTagKey} />
                  </div>
                </div>
                <div className="df-field">
                  <label>Image / GIF URL (optional)</label>
                  <input type="text" placeholder="https://media.giphy.com/..." value={mediaUrl} onChange={e => setMediaUrl(e.target.value)} />
                </div>
                {mediaUrl && <div className="df-media-preview"><img src={mediaUrl} alt="preview" /></div>}
                <div className="df-composer-footer">
                  <button className="df-cancel-btn" onClick={() => setComposerOpen(false)}>Cancel</button>
                  <button className="df-post-btn" onClick={handlePost}>Post</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── FEED ── */}
          <div className="df-feed">
            {feedError && <div className="df-empty">{feedError}</div>}
            {visiblePosts.map(post => {
                const proj    = getProject(post.project);
                const liked   = post.likedBy.includes(userId);
                const showCmt = openComments[post.id];
                return (
                  <motion.div key={post.id} className="df-post"
                    initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.2}}>

                    {/* Header */}
                    <div className="df-post-header">
                      <img className="df-post-avatar" src={PROFILE_IMG} alt="Carlos" />
                      <div className="df-post-meta">
                        <strong>Carlos Zabala</strong>
                        <span className="df-post-time">
                          {post.time} · <span className="df-post-project" style={{color:proj.color}}>{proj.emoji} {post.project}</span>
                        </span>
                      </div>
                      {isAdmin && (
                        <button className="df-delete-btn" onClick={() => handleDeletePost(post)} title="Delete">🗑</button>
                      )}
                    </div>

                    {post.title && <div className="df-post-title">{post.title}</div>}
                    {post.body && (
                      <p className="df-post-body" dangerouslySetInnerHTML={{
                        __html: post.body
                          .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
                          .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
                          .replace(/\*(.+?)\*/g,'<em>$1</em>')
                          .replace(/__(.+?)__/g,'<u>$1</u>')
                          .replace(/`(.+?)`/g,'<code style="background:#d4d0c8;padding:1px 4px;font-family:monospace;font-size:10px;">$1</code>')
                          .replace(/\n/g,'<br/>')
                      }}/>
                    )}

                    {post.tags.length > 0 && (
                      <div className="df-post-tags">
                        {post.tags.map((t,i) => <span key={i} className="df-tag">{t}</span>)}
                      </div>
                    )}

                    {post.media && (
                      <div className="df-post-media">
                        <img src={post.media} alt={post.title || ''} />
                      </div>
                    )}

                    {/* Stats */}
                    <div className="df-post-stats">
                      <span>{post.likes > 0 ? `👍 ${post.likes}` : ''}</span>
                      <span
                        className="df-comments-count"
                        onClick={() => toggleComments(post.id)}
                      >
                        {post.comments.length > 0 ? `${post.comments.length} comment${post.comments.length!==1?'s':''}` : ''}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="df-post-actions">
                      <button
                        onClick={() => toggleLike(post)}
                        style={{ color: liked ? '#000080' : '#65676b', fontWeight: liked ? 'bold' : 'normal' }}
                      >👍 Like</button>
                      <button onClick={() => toggleComments(post.id)}>💬 Comment</button>
                      <button onClick={() => handleShare(post.id)}>
                        {copiedId === post.id ? '✅ Copied!' : '↗ Share'}
                      </button>
                    </div>

                    {/* Comments section */}
                    <AnimatePresence>
                      {showCmt && (
                        <motion.div className="df-comments-section"
                          initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}}
                          exit={{opacity:0,height:0}} transition={{duration:0.2}}>

                          {/* Existing comments */}
                          {post.comments.map(c => (
                            <div key={c.id} className="df-comment">
                              <div className="df-comment-avatar">{c.name.charAt(0).toUpperCase()}</div>
                              <div className="df-comment-body">
                                <strong>{c.name}</strong>
                                <span>{c.text}</span>
                                <span className="df-comment-time">{c.time}</span>
                              </div>
                              {isAdmin && (
                                <button className="df-delete-btn" onClick={() => deleteComment(post, c)}>🗑</button>
                              )}
                            </div>
                          ))}

                          {/* Comment input */}
                          <div className="df-comment-input-row">
                            <div className="df-comment-avatar df-avatar-sm" style={{background:'#888',fontSize:'11px'}}>?</div>
                            <div className="df-comment-input-wrap">
                              <input
                                className="df-comment-name"
                                type="text"
                                placeholder="Your name (optional)"
                                value={commentNames[post.id] || ''}
                                onChange={e => setCommentNames(prev => ({...prev,[post.id]:e.target.value}))}
                              />
                              <div className="df-comment-row">
                                <input
                                  className="df-comment-text"
                                  type="text"
                                  placeholder="Write a comment..."
                                  value={commentInputs[post.id] || ''}
                                  onChange={e => setCommentInputs(prev => ({...prev,[post.id]:e.target.value}))}
                                  onKeyDown={e => e.key === 'Enter' && submitComment(post)}
                                />
                                <button className="df-comment-send" onClick={() => submitComment(post)}>↵</button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}

            {visiblePosts.length === 0 && (
              <div className="df-empty">{activeStory ? `No posts for ${activeStory} yet.` : 'No posts yet.'}</div>
            )}
          </div>
        </div>

        {/* ── CONTACTS SIDEBAR (wide windows only) ── */}
        <aside className="df-sidebar">
          <div className="df-side-title">Profile</div>
          <div className="df-side-profile">
            <img src={PROFILE_IMG} alt="Carlos" />
            <div>
              <strong>Carlos Zabala</strong>
              <span>Developer · NYC</span>
            </div>
          </div>
          <div className="df-side-title">Projects</div>
          {PROJECTS.map(p => (
            <div key={p.name}
              className={`df-contact${activeStory===p.name?' selected':''}`}
              onClick={() => setActiveStory(activeStory===p.name ? null : p.name)}
            >
              <span className="df-contact-avatar" style={{background:p.color}}>{p.emoji}<span className="df-online-dot" /></span>
              <span>{p.name}</span>
            </div>
          ))}
        </aside>
        </div>
      </div>
    </Draggable>
  );
}