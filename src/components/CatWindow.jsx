import { useContext, useState } from 'react';
import Draggable from 'react-draggable';
import UseContext from '../Context';
import { MY_CAT } from './function/myCat';
import catIcon from '../assets/cat-banner-cat.png';
import '../css/DevFeed.css';

// Small window that pops up when the taskbar cat banner is clicked.
function CatWindow({ open, setOpen }) {
  const { themeDragBar } = useContext(UseContext);
  const [expand, setExpand] = useState(false);
  if (!open) return null;
  const close = () => setOpen(false);
  const ext = MY_CAT.type === 'video' ? '.mp4' : '.jpg';

  return (
    <Draggable handle=".df-dragbar" disabled={expand} bounds={{ top: 0 }}
      defaultPosition={{ x: window.innerWidth <= 500 ? 5 : window.innerWidth - 300, y: window.innerWidth <= 500 ? 80 : Math.max(20, window.innerHeight - 630) }}>
      <div className="df-window cat-window"
        style={expand ? { position: 'fixed', left: 0, top: 0, width: '100%', height: 'calc(100vh - 37px)', zIndex: 9999, resize: 'none' } : { zIndex: 9999, left: 0, top: 0 }}>
        <div className="df-dragbar" style={{ background: themeDragBar }}>
          <div className="df-barname">
            <img src={catIcon} alt="" style={{ objectFit: 'cover' }} />
            <span>{MY_CAT.name}{ext} - Windows Media Player</span>
          </div>
          <div className="df-barbtn">
            <div className="df-btn" onClick={close} onTouchEnd={close}><span className="df-dash" /></div>
            <div className="df-btn" onClick={() => setExpand(x => !x)}><span className={`df-expand${expand ? ' full' : ''}`} /></div>
            <div className="df-btn" onClick={close} onTouchEnd={close}><span className="df-x">×</span></div>
          </div>
        </div>
        <div className="df-menubar">
          <span>File</span><span>View</span><span>Play</span><span>Help</span>
        </div>
        <div className="cat-window-view">
          {MY_CAT.type === 'video'
            ? <video autoPlay loop muted playsInline>
                {MY_CAT.sources.map(src => <source key={src} src={src} type={src.endsWith('.webm') ? 'video/webm' : 'video/mp4'} />)}
              </video>
            : <img src={MY_CAT.src} alt="Mochi, Carlos's cat" />}
        </div>
        <p className="cat-window-caption">{MY_CAT.caption}</p>
      </div>
    </Draggable>
  );
}

export default CatWindow;
