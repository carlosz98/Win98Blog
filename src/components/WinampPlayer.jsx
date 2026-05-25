import React, { useContext } from 'react';
import UseContext from '../Context'
import WebampPlayer from './WebampPlayer';
import WinampVisualizer from './WinampVisualizer';

function WinampPlayer() {

  const { WinampExpand } = useContext(UseContext);

  return (
    <div>
      {WinampExpand.show && (
        <>
          <WebampPlayer />
          <WinampVisualizer />
        </>
      )}
    </div>
  );
}

export default WinampPlayer;