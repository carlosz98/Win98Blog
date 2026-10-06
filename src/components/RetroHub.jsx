import { useContext } from 'react';
import UseContext from '../Context';
import Draggable from 'react-draggable';
import retroHubIcon from '../assets/retrohub.png';
import '../css/DevFeed.css';
import '../css/RetroHub.css';

// Carlos's RetroHub Android app, streamed from Appetize.io inside a phone.
// Paste the app's Appetize public key here once the APK is uploaded.
const APPETIZE_KEY = '';

const embedUrl = key =>
  `https://appetize.io/embed/${key}?device=pixel7&screenOnly=true&scale=auto&autoplay=false&centered=both`;

export default function RetroHub({ show, setShow }) {
  const { themeDragBar } = useContext(UseContext);
  if (!show) return null;
  return (
    <Draggable handle=".df-dragbar" bounds={{ top: 0 }}
      defaultPosition={{ x: window.innerWidth <= 500 ? 4 : 220, y: window.innerWidth <= 500 ? 40 : 30 }}>
      <div className="df-window rh-window" style={{ zIndex: 9999 }}>
        <div className="df-dragbar" style={{ background: themeDragBar }}>
          <div className="df-barname">
            <img src={retroHubIcon} alt="" />
            <span>RetroHub.exe</span>
          </div>
          <div className="df-barbtn">
            <div className="df-btn" onClick={() => setShow(false)}><span className="df-x">×</span></div>
          </div>
        </div>
        <div className="rh-body">
          <div className="rh-phone">
            <div className="rh-speaker" />
            <div className="rh-screen">
              {APPETIZE_KEY ? (
                <iframe src={embedUrl(APPETIZE_KEY)} title="RetroHub" allow="autoplay" />
              ) : (
                <div className="rh-placeholder">
                  <div className="rh-logo">RETRO<span>HUB</span></div>
                  <p>Booting up soon...</p>
                  <small>Carlos's Android app for retro gaming fans</small>
                </div>
              )}
            </div>
            <div className="rh-home" />
          </div>
        </div>
        <div className="rh-status">
          <span>RetroHub for Android</span>
          <span>{APPETIZE_KEY ? 'Tap the screen to play' : 'Not installed yet'}</span>
        </div>
      </div>
    </Draggable>
  );
}
