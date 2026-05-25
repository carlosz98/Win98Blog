import { useEffect, useState, useRef } from 'react';
import mp3_1 from '../assets/never-gonna-give-you-up.mp3';

// ─────────────────────────────────────────────────────────────
// ADD YOUR SONGS & GIFS HERE
// 1. Import your mp3 at the top: import mp3_2 from '../assets/your-song.mp3';
// 2. Add an entry to the TRACKS array below
// ─────────────────────────────────────────────────────────────
// import mp3_2 from '../assets/your-song.mp3';

export const TRACKS = [
  {
    artist: 'Rick Astley',
    title: 'Never Gonna Give You Up',
    url: mp3_1,
    duration: 213,
    gif: 'https://media.giphy.com/media/Vuw9m5wXviFIQ/giphy.gif',
  },
  // ADD NEXT SONG HERE:
  // {
  //   artist: 'Artist Name',
  //   title: 'Song Title',
  //   url: mp3_2,
  //   duration: 200,
  //   gif: 'your gif url or import',
  // },
];

const WinampVisualizer = () => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [pos, setPos] = useState({ left: 0, top: 0, show: false });
  const [visible, setVisible] = useState(true);

  // ── Detect currently playing track ──
  useEffect(() => {
    const interval = setInterval(() => {
      const webamp = document.querySelector('#webamp');
      if (!webamp) { setCurrentTrack(null); return; }

      // Check if Webamp is in playing state
      // Webamp adds class "playing" to its main container when playing
      const isPlaying = webamp.querySelector('.playing') !== null;
      if (!isPlaying) { setCurrentTrack(null); return; }

      // Get the track title from the marquee element
      const marqueeEl = webamp.querySelector('.marquee');
      const rawText = (marqueeEl?.textContent || '').toLowerCase().trim();

      if (!rawText) { setCurrentTrack(null); return; }

      const matched = TRACKS.find(track =>
        rawText.includes(track.title.toLowerCase()) ||
        rawText.includes(track.artist.toLowerCase())
      );

      setCurrentTrack(matched || null);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // ── Follow Webamp position via rAF ──
  useEffect(() => {
    let rafId;

    function updatePos() {
      const webamp = document.querySelector('#webamp');
      if (!webamp) { setPos(p => ({ ...p, show: false })); rafId = requestAnimationFrame(updatePos); return; }

      // Webamp's draggable main window
      const mainWin =
        webamp.querySelector('[data-id="main-window"]') ||
        webamp.querySelector('.webamp-window') ||
        webamp.querySelector('.window') ||
        webamp.firstElementChild;

      if (!mainWin) { setPos(p => ({ ...p, show: false })); rafId = requestAnimationFrame(updatePos); return; }

      const r = mainWin.getBoundingClientRect();
      if (r.width === 0) { setPos(p => ({ ...p, show: false })); rafId = requestAnimationFrame(updatePos); return; }

      setPos({ left: r.right + 2, top: r.top, show: true });
      rafId = requestAnimationFrame(updatePos);
    }

    rafId = requestAnimationFrame(updatePos);
    return () => cancelAnimationFrame(rafId);
  }, []);

  if (!visible || !pos.show || !currentTrack) return null;

  return (
    <div
      id="winamp-viz"
      style={{
        position: 'fixed',
        left: `${pos.left}px`,
        top: `${pos.top}px`,
        width: '275px',
        background: '#000',
        border: '2px solid #1a1a1a',
        zIndex: 998,
        display: 'flex',
        flexDirection: 'column',
        userSelect: 'none',
        boxShadow: '4px 4px 12px rgba(0,0,0,0.8)',
      }}
    >
      {/* Title bar */}
      <div style={{
        background: 'linear-gradient(90deg, #0a0a2e, #1a3a7a)',
        padding: '3px 6px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'default',
      }}>
        <span style={{
          fontFamily: 'Arial, sans-serif',
          fontSize: '10px',
          fontWeight: 'bold',
          color: '#fff',
          letterSpacing: '1px',
          textTransform: 'uppercase',
        }}>
          MILKDROP — {currentTrack.artist}
        </span>
        <button
          onClick={() => setVisible(false)}
          style={{
            background: '#c0c0c0',
            border: '1px outset #fff',
            width: '16px',
            height: '14px',
            fontSize: '10px',
            lineHeight: '12px',
            cursor: 'pointer',
            padding: 0,
            fontWeight: 'bold',
            color: '#000',
          }}
        >×</button>
      </div>

      {/* GIF */}
      <div style={{
        width: '100%',
        height: '275px',
        overflow: 'hidden',
        background: '#000',
      }}>
        <img
          key={currentTrack.title}
          src={currentTrack.gif}
          alt="visualizer"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>

      {/* Track info */}
      <div style={{
        background: '#0a0a0a',
        padding: '4px 8px',
        fontFamily: '"Courier New", monospace',
        fontSize: '10px',
        color: '#00ff41',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}>
        ▶ {currentTrack.artist} — {currentTrack.title}
      </div>
    </div>
  );
};

export default WinampVisualizer;