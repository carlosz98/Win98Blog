import { useState } from 'react';
import Draggable from 'react-draggable';
import '../css/SpotifyPlaylist.css';

// Carlos's playlist, played through Spotify's official embed.
// Signed-in Spotify users hear full songs; everyone else gets 30s previews.
const PLAYLIST_ID = '1IZXs8MgKybmB2LM372voW';
const EMBED_URL = `https://open.spotify.com/embed/playlist/${PLAYLIST_ID}?utm_source=generator&theme=0`;
const OPEN_URL = `https://open.spotify.com/playlist/${PLAYLIST_ID}`;

function SpotifyPlaylist({ hidden }) {
  const [closed, setClosed] = useState(false);
  const [shaded, setShaded] = useState(false); // Winamp "shade mode": collapse to the title bar

  if (closed) return null;
  const narrow = window.innerWidth <= 500;

  return (
    <Draggable
      handle=".spotify_titlebar"
      bounds={{ top: 0 }}
      defaultPosition={{
        // Desktop: right next to the Winamp main window. Phones: compact, above it.
        x: narrow ? 5 : 390,
        y: narrow ? 34 : 242,
      }}
    >
      <div className="spotify_window" style={hidden ? { display: 'none' } : undefined}>
        <div className="spotify_titlebar" onDoubleClick={() => setShaded(s => !s)}>
          <span className="spotify_title">WINAMP PLAYLIST &middot; CARLOS'S MIX</span>
          <div className="spotify_btns">
            <button title="Shade" onClick={() => setShaded(s => !s)} onTouchEnd={() => setShaded(s => !s)}>_</button>
            <button title="Close" onClick={() => setClosed(true)} onTouchEnd={() => setClosed(true)}>×</button>
          </div>
        </div>
        {!shaded && (
          <>
            <iframe
              title="Carlos's Spotify playlist"
              src={EMBED_URL}
              width="100%"
              height={narrow ? 152 : 352}
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
            <div className="spotify_footer">
              <span>Log in to Spotify for full songs</span>
              <a href={OPEN_URL} target="_blank" rel="noopener noreferrer">Open in Spotify</a>
            </div>
          </>
        )}
      </div>
    </Draggable>
  );
}

export default SpotifyPlaylist;
