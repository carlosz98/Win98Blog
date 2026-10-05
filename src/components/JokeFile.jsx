import { useContext, useState } from 'react';
import Draggable from 'react-draggable';
import UseContext from '../Context';
import notepad from '../assets/notepad.png';
import { JOKE_FILES } from './function/jokeFiles';
import '../css/DevFeed.css';

// Opens one of the Recycle Bin's joke files in a Notepad-style window.
function JokeFile({ name, setName }) {
  const { themeDragBar } = useContext(UseContext);
  const [expand, setExpand] = useState(false);
  const file = name && JOKE_FILES[name];
  if (!file) return null;
  const close = () => setName(null);

  return (
    <Draggable handle=".df-dragbar" disabled={expand} bounds={{ top: 0 }}
      defaultPosition={{ x: window.innerWidth <= 500 ? 5 : 260, y: window.innerWidth <= 500 ? 80 : 110 }}>
      <div className="df-window joke-window"
        style={expand ? { position: 'fixed', left: 0, top: 0, width: '100%', height: 'calc(100vh - 37px)', zIndex: 9999, resize: 'none' } : { zIndex: 9999 }}>
        <div className="df-dragbar" style={{ background: themeDragBar }}>
          <div className="df-barname">
            <img src={notepad} alt="" />
            <span>{name}{file.type} - Notepad</span>
          </div>
          <div className="df-barbtn">
            <div className="df-btn" onClick={close} onTouchEnd={close}><span className="df-dash" /></div>
            <div className="df-btn" onClick={() => setExpand(x => !x)}><span className={`df-expand${expand ? ' full' : ''}`} /></div>
            <div className="df-btn" onClick={close} onTouchEnd={close}><span className="df-x">×</span></div>
          </div>
        </div>
        <div className="df-menubar">
          <span>File</span><span>Edit</span><span>Search</span><span>Help</span>
        </div>
        <pre className="joke-text">{file.text}</pre>
      </div>
    </Draggable>
  );
}

export default JokeFile;
