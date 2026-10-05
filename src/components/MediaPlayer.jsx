import { useContext, useEffect, useRef, useState } from 'react';
import UseContext from '../Context';
import Draggable from 'react-draggable';
import wmpIcon from '../assets/mediaplayer.png';
import catVideo from '../assets/catvideo.mp4';
import '../css/DevFeed.css';
import '../css/MediaPlayer.css';

// Carlos's videos. `src` is a video file (mp4/webm) or `youtube` is a YouTube video id.
// Add console clips or anything else here and they show up in the playlist.
export const VIDEOS = [
  { title: 'Office supervisor (cat cam)', src: catVideo },
  { title: 'Carlos’s favorite song (trust me)', youtube: 'dQw4w9WgXcQ' },
];

const fmt = s => {
  if (!Number.isFinite(s)) return '00:00';
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
};

function Visualizer({ playing }) {
  const [bars, setBars] = useState(() => Array(24).fill(2));
  useEffect(() => {
    if (!playing) { setBars(b => b.map(() => 2)); return; }
    const t = setInterval(() => setBars(b => b.map((v, i) => {
      const target = 3 + Math.random() * (i < 6 ? 16 : i < 16 ? 13 : 9);
      return Math.round((v + target) / 2);
    })), 120);
    return () => clearInterval(t);
  }, [playing]);
  return (
    <div className="wmp-vis" aria-hidden="true">
      {bars.map((h, i) => <span key={i} style={{ height: `${h * 5}%` }} />)}
    </div>
  );
}

export default function MediaPlayer({ show, setShow }) {
  const { themeDragBar } = useContext(UseContext);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [skin, setSkin] = useState(() => {
    try { return localStorage.getItem('wmpSkin') || 'classic'; } catch { return 'classic'; }
  });
  const [playlist, setPlaylist] = useState(() => window.innerWidth > 500);
  const [menu, setMenu] = useState(false);
  const videoRef = useRef(null);
  const ytRef = useRef(null);
  const video = VIDEOS[index];

  useEffect(() => { try { localStorage.setItem('wmpSkin', skin); } catch { /* ignore */ } }, [skin]);
  useEffect(() => {
    const v = videoRef.current;
    if (v) { v.volume = volume; v.muted = muted; }
    yt('setVolume', [Math.round(volume * 100)]);
    yt(muted ? 'mute' : 'unMute');
  }, [volume, muted, index]);
  useEffect(() => { setTime(0); setDuration(0); }, [index]);

  // YouTube videos are controlled through the embed's postMessage API.
  function yt(func, args = []) {
    const w = ytRef.current?.contentWindow;
    if (w) w.postMessage(JSON.stringify({ event: 'command', func, args }), '*');
  }

  function play() {
    if (video.youtube) { yt('playVideo'); setPlaying(true); return; }
    videoRef.current?.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }
  function pause() {
    if (video.youtube) yt('pauseVideo');
    else videoRef.current?.pause();
    setPlaying(false);
  }
  function stop() {
    if (video.youtube) yt('stopVideo');
    else if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; }
    setPlaying(false);
  }
  function go(i) {
    setPlaying(false);
    setIndex((i + VIDEOS.length) % VIDEOS.length);
  }
  function seek(e) {
    const v = videoRef.current;
    if (!v || !duration) return;
    v.currentTime = Number(e.target.value);
  }

  if (!show) return null;

  return (
    <Draggable handle=".df-dragbar" bounds={{ top: 0 }}
      defaultPosition={{ x: window.innerWidth <= 500 ? 4 : 150, y: window.innerWidth <= 500 ? 40 : 50 }}>
      <div className={`df-window wmp-window wmp-${skin}${playlist ? ' with-list' : ''}`} style={{ zIndex: 9999 }}>
        <div className="df-dragbar" style={skin === 'classic' ? { background: themeDragBar } : undefined}>
          <div className="df-barname">
            <img src={wmpIcon} alt="" />
            <span>{video.title} - Windows Media Player</span>
          </div>
          <div className="df-barbtn">
            <div className="df-btn" onClick={() => { stop(); setShow(false); }}><span className="df-x">×</span></div>
          </div>
        </div>

        <div className="wmp-menu">
          <span>File</span>
          <span className={menu ? 'open' : ''} onClick={() => setMenu(m => !m)}>View</span>
          <span onClick={() => (playing ? pause() : play())}>Play</span>
          <span onClick={() => setPlaylist(p => !p)}>Playlist</span>
          <span>Help</span>
          {menu && (
            <div className="wmp-dropdown" onMouseLeave={() => setMenu(false)}>
              <div onClick={() => { setSkin('classic'); setMenu(false); }}>{skin === 'classic' ? '● ' : '   '}Classic skin</div>
              <div onClick={() => { setSkin('millennium'); setMenu(false); }}>{skin === 'millennium' ? '● ' : '   '}Millennium skin</div>
              <hr />
              <div onClick={() => { setPlaylist(p => !p); setMenu(false); }}>{playlist ? '✓ ' : '   '}Playlist</div>
            </div>
          )}
        </div>

        <div className="wmp-main">
          <div className="wmp-left">
            <div className="wmp-screen">
              {video.youtube ? (
                <iframe
                  ref={ytRef}
                  key={video.youtube}
                  title={video.title}
                  src={`https://www.youtube-nocookie.com/embed/${video.youtube}?enablejsapi=1&controls=0&modestbranding=1&rel=0&playsinline=1`}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  ref={videoRef}
                  key={video.src}
                  src={video.src}
                  playsInline
                  onClick={() => (playing ? pause() : play())}
                  onTimeUpdate={e => setTime(e.target.currentTime)}
                  onLoadedMetadata={e => setDuration(e.target.duration)}
                  onEnded={() => go(index + 1)}
                />
              )}
              {!playing && !video.youtube && <div className="wmp-paused" onClick={play}>▶</div>}
            </div>
            <Visualizer playing={playing} />
            <input
              className="wmp-seek"
              type="range"
              min={0}
              max={duration || 1}
              step={0.1}
              value={video.youtube ? 0 : time}
              onChange={seek}
              disabled={!!video.youtube}
              aria-label="Seek"
            />
            <div className="wmp-controls">
              <button className="wmp-play" onClick={() => (playing ? pause() : play())} aria-label={playing ? 'Pause' : 'Play'}>
                {playing ? '❚❚' : '▶'}
              </button>
              <button onClick={stop} aria-label="Stop">■</button>
              <span className="wmp-sep" />
              <button onClick={() => go(index - 1)} aria-label="Previous">|◀◀</button>
              <button onClick={() => go(index + 1)} aria-label="Next">▶▶|</button>
              <span className="wmp-sep" />
              <button onClick={() => setMuted(m => !m)} aria-label="Mute">{muted ? '🔇' : '🔊'}</button>
              <input
                className="wmp-volume"
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={volume}
                onChange={e => { setVolume(Number(e.target.value)); setMuted(false); }}
                aria-label="Volume"
              />
            </div>
          </div>

          {playlist && (
            <div className="wmp-list">
              <div className="wmp-list-title">Playlist</div>
              {VIDEOS.map((v, i) => (
                <div key={v.title} className={`wmp-item${i === index ? ' active' : ''}`} onClick={() => go(i)}>
                  <span>{i + 1}.</span> {v.title}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="wmp-status">
          <span>{playing ? 'Playing' : time > 0 ? 'Paused' : 'Ready'}</span>
          <span>{video.youtube ? 'Streaming' : `${fmt(time)} / ${fmt(duration)}`}</span>
        </div>
      </div>
    </Draggable>
  );
}
