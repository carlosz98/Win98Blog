import React, { useContext } from 'react';
import UseContext from '../Context'
import WebampPlayer from './WebampPlayer';
import WinampVisualizer from './WinampVisualizer';
import SpotifyPlaylist from './SpotifyPlaylist';

function WinampPlayer() {

  const { WinampExpand } = useContext(UseContext);

  return (
    <div>
      {WinampExpand.show && (
        <>
          <WebampPlayer />
          <WinampVisualizer />
          <SpotifyPlaylist hidden={WinampExpand.hide} />
        </>
      )}
    </div>
  );
}

export default WinampPlayer;