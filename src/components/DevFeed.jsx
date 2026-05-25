import { useContext, useState, useEffect, useRef } from 'react';
import UseContext from '../Context';
import Draggable from 'react-draggable';
import { motion, AnimatePresence } from 'framer-motion';
import newsIcon from '../assets/news.png';
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

const ADMIN_PASSWORD = 'carlosz98'; // ← change this to your own password
const SHARE_URL = 'https://github.com/carlosz98';

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

// ── Get a session-based user ID so likes persist per visitor ──
function getUserId() {
  let id = sessionStorage.getItem('df_user_id');
  if (!id) {
    id = 'user_' + Math.random().toString(36).slice(2, 9);
    sessionStorage.setItem('df_user_id', id);
  }
  return id;
}

function loadPosts() {
  try {
    const saved = localStorage.getItem('devfeed_posts');
    if (!saved) return SEED_POSTS;
    const parsed = JSON.parse(saved);
    // Migrate old posts that don't have likedBy/comments arrays
    return parsed.map(p => ({
      ...p,
      likedBy: p.likedBy || [],
      comments: p.comments || [],
      likes: p.likes || 0,
    }));
  } catch { return SEED_POSTS; }
}

function savePosts(posts) {
  try { localStorage.setItem('devfeed_posts', JSON.stringify(posts)); }
  catch(e) { console.error('Failed to save posts', e); }
}

export default function DevFeed({ show, setShow }) {
  const { themeDragBar } = useContext(UseContext);

  const [expand, setExpand]           = useState(false);
  const [focus, setFocus]             = useState(true);
  const [posts, setPosts]             = useState(loadPosts);
  const [activeStory, setActiveStory] = useState(null);
  const userId                        = getUserId();

  // ── Auth ──
  const [isAdmin, setIsAdmin]         = useState(() => sessionStorage.getItem('df_admin') === 'true');
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

  // ── Persist on change ──
  useEffect(() => { savePosts(posts); }, [posts]);

  function updatePosts(fn) {
    setPosts(prev => {
      const next = fn(prev);
      savePosts(next);
      return next;
    });
  }

  // ── Admin ──
  function handleLogin(e) {
    e.preventDefault();
    if (pwInput === ADMIN_PASSWORD) {
      setIsAdmin(true);
      sessionStorage.setItem('df_admin', 'true');
      setShowLogin(false); setPwInput(''); setPwError('');
      setComposerOpen(true);
    } else {
      setPwError('Incorrect password.'); setPwInput('');
    }
  }
  function handleLogout() {
    setIsAdmin(false); sessionStorage.removeItem('df_admin'); setComposerOpen(false);
  }
  function handleNewPostClick() {
    if (isAdmin) setComposerOpen(o => !o);
    else setShowLogin(true);
  }

  // ── Post ──
  function handlePost() {
    if (!title.trim() && !body.trim()) return;
    const newPost = {
      id: Date.now(),
      title: title.trim(), body: body.trim(),
      tags, media: mediaUrl.trim() || null,
      project: selProject,
      time: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      likes: 0, likedBy: [], comments: [],
    };
    updatePosts(prev => [newPost, ...prev]);
    setTitle(''); setBody(''); setTags([]); setTagInput(''); setMediaUrl('');
    setComposerOpen(false);
  }

  function handleDeletePost(id) {
    updatePosts(prev => prev.filter(p => p.id !== id));
  }

  function handleTagKey(e) {
    if ((e.key === 'Enter' || e.key === ' ') && tagInput.trim()) {
      const t = tagInput.trim().startsWith('#') ? tagInput.trim() : '#' + tagInput.trim();
      setTags(prev => [...prev, t]);
      setTagInput(''); e.preventDefault();
    }
  }

  // ── Like ──
  function toggleLike(postId) {
    updatePosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      const liked = p.likedBy.includes(userId);
      return {
        ...p,
        likes: liked ? p.likes - 1 : p.likes + 1,
        likedBy: liked ? p.likedBy.filter(id => id !== userId) : [...p.likedBy, userId],
      };
    }));
  }

  // ── Comment ──
  function toggleComments(postId) {
    setOpenComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  }

  function submitComment(postId) {
    const text = (commentInputs[postId] || '').trim();
    const name = (commentNames[postId] || '').trim() || 'Anonymous';
    if (!text) return;
    const comment = {
      id: Date.now(),
      name,
      text,
      time: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };
    updatePosts(prev => prev.map(p =>
      p.id === postId ? { ...p, comments: [...p.comments, comment] } : p
    ));
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    setCommentNames(prev => ({ ...prev, [postId]: '' }));
  }

  function deleteComment(postId, commentId) {
    updatePosts(prev => prev.map(p =>
      p.id === postId
        ? { ...p, comments: p.comments.filter(c => c.id !== commentId) }
        : p
    ));
  }

  // ── Share ──
  function handleShare(postId) {
    navigator.clipboard.writeText(SHARE_URL).then(() => {
      setCopiedId(postId);
      setTimeout(() => setCopiedId(null), 2000);
    });
  }

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

        <div className="df-body" style={expand ? { height:'calc(100vh - 90px)' } : {}}>

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
                    <p>Enter admin password to post:</p>
                    <input type="password" value={pwInput} onChange={e => setPwInput(e.target.value)} placeholder="Password" autoFocus />
                    {pwError && <span className="df-login-error">{pwError}</span>}
                    <div className="df-login-btns">
                      <button type="submit" className="df-post-btn">Login</button>
                      <button type="button" className="df-cancel-btn" onClick={() => { setShowLogin(false); setPwError(''); }}>Cancel</button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── STORIES ── */}
          <div className="df-stories-wrap">
            <div className="df-stories">
              {/* Create post card */}
              <div className="df-story df-story-create" onClick={handleNewPostClick}>
                <div className="df-story-icon" style={{ background:'#e4e6eb' }}>
                  <div className="df-plus-circle">+</div>
                </div>
                <div className="df-story-create-bottom"><span>{isAdmin ? 'New Post' : 'Post'}</span></div>
              </div>
              {/* One story card per post */}
              {posts.slice(0,8).map(p => {
                const proj = getProject(p.project);
                return (
                  <div key={p.id}
                    className={`df-story${activeStory===p.project?' selected':''}`}
                    onClick={() => setActiveStory(activeStory===p.project ? null : p.project)}
                  >
                    <div className="df-story-icon" style={{background:proj.color,padding:0,overflow:'hidden'}}>
                      {p.media && <img src={p.media} alt="" style={{width:'100%',height:'100%',objectFit:'cover',position:'absolute',inset:0}}/>}
                      {!p.media && <span style={{fontSize:'28px',position:'relative',zIndex:1}}>{proj.emoji}</span>}
                      {/* Blue gradient + profile pic at top */}
                      <div style={{position:'absolute',top:0,left:0,right:0,height:'34px',background:'linear-gradient(180deg,rgba(0,0,128,0.88) 0%,transparent 100%)',zIndex:2,display:'flex',alignItems:'flex-start',padding:'3px 4px'}}>
                        <img src="https://www.image2url.com/r2/default/images/1779668696401-898704a7-949a-4304-bd28-dc369d0df131.jpg"
                          style={{width:'20px',height:'20px',objectFit:'cover',borderRadius:'50%',border:'1px solid #fff'}} alt="Carlos"/>
                      </div>
                    </div>
                    <span>{p.title ? p.title.slice(0,14) : p.project}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── STATUS BAR ── */}
          <div className="df-status-bar">
            <div className="df-status-input-row">
              <img src="https://www.image2url.com/r2/default/images/1779668696401-898704a7-949a-4304-bd28-dc369d0df131.jpg" style={{width:'28px',height:'28px',objectFit:'cover',border:'1px solid #fff',borderRightColor:'#808080',borderBottomColor:'#808080',flexShrink:0}} alt="Carlos"/>
              <div className="df-status-input" onClick={handleNewPostClick}>
                {isAdmin ? "What's your update, Carlos?" : "What's on your mind?"}
              </div>
            </div>
            <div className="df-status-btns">
              <button className="df-status-btn">🎥 Live video</button>
              <button className="df-status-btn" onClick={handleNewPostClick}>🖼 Photo/GIF</button>
              <button className="df-status-btn">😊 Feeling</button>
            </div>
          </div>

          {/* ── ROOM ROW ── */}
          <div className="df-room-row">
            <button className="df-room-btn" onClick={handleNewPostClick}>➕ {isAdmin?'Create post':'View posts'}</button>
            <div className="df-room-avatars">
              {PROJECTS.slice(0,6).map(p => (
                <div key={p.name} className="df-mini-avatar" style={{background:p.color}} title={p.name}>{p.emoji}</div>
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
                    <img src="https://www.image2url.com/r2/default/images/1779668696401-898704a7-949a-4304-bd28-dc369d0df131.jpg"
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
            {posts
              .filter(p => !activeStory || p.project === activeStory)
              .map(post => {
                const proj    = getProject(post.project);
                const liked   = post.likedBy.includes(userId);
                const showCmt = openComments[post.id];
                return (
                  <motion.div key={post.id} className="df-post"
                    initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.2}}>

                    {/* Header */}
                    <div className="df-post-header">
                      <div className="df-post-avatar" style={{background:proj.color,overflow:'hidden',padding:0}}>
                        <img src="https://www.image2url.com/r2/default/images/1779668696401-898704a7-949a-4304-bd28-dc369d0df131.jpg"
                          style={{width:'100%',height:'100%',objectFit:'cover'}} alt="Carlos"
                        />
                      </div>
                      <div className="df-post-meta">
                        <strong>{post.project}</strong>
                        <span className="df-post-time">{post.time}</span>
                      </div>
                      {isAdmin && (
                        <button className="df-delete-btn" onClick={() => handleDeletePost(post.id)} title="Delete">🗑</button>
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
                        <div className="df-post-media-header">
                          <span>📁 {post.project} — {post.title}</span>
                        </div>
                        <img src={post.media} alt="" />
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
                        onClick={() => toggleLike(post.id)}
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
                                <button className="df-delete-btn" onClick={() => deleteComment(post.id, c.id)}>🗑</button>
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
                                  onKeyDown={e => e.key === 'Enter' && submitComment(post.id)}
                                />
                                <button className="df-comment-send" onClick={() => submitComment(post.id)}>↵</button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}

            {posts.filter(p => !activeStory || p.project === activeStory).length === 0 && (
              <div className="df-empty">No posts for {activeStory} yet.</div>
            )}
          </div>
        </div>
      </div>
    </Draggable>
  );
}