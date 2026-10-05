import UseContext from '../Context'
import { useContext, useState, useEffect, Fragment } from "react";
import Draggable from 'react-draggable'
import { motion } from 'framer-motion';
import About from '../assets/ipng.png'
import bioPC from '../assets/bio_pc.png'
import hobby from '../assets/hobby.png'
import '../css/MyBioFolder.css'

// General tab lines, typed out one character at a time.
const BIO_LINES = [
  { label: 'Objective:' },
  { text: 'Building software, games, and retro experiences.' },
  { gap: true },
  { label: 'Information:' },
  { text: 'Carlos Zabala' },
  { text: 'Programmer & Software Developer' },
  { text: 'LaGuardia Community College' },
  { gap: true },
  { label: 'Location:' },
  { text: 'New York City' },
  { text: 'Open to opportunities' },
  { text: 'On Site / Remote' },
];
const BIO_TOTAL = BIO_LINES.reduce((n, l) => n + (l.label || l.text || '').length, 0);
const TYPE_MS = 15;

// Technology tab meters (level is 0–100).
const SKILLS = [
  { name: 'C++',            level: 85 },
  { name: 'Java',           level: 80 },
  { name: 'C#',             level: 75 },
  { name: 'Unity',          level: 75 },
  { name: 'Unreal Engine 5', level: 65 },
  { name: 'Android / Kotlin', level: 70 },
  { name: 'iOS / SwiftUI',  level: 60 },
  { name: 'React / JS',     level: 70 },
  { name: 'Firebase / GCP', level: 60 },
  { name: 'HTML',           level: 55 },
  { name: 'CSS',            level: 55 },
  { name: 'JavaScript',     level: 55 },
];

// Shown as beginner meters under a "Currently learning" heading.
const LEARNING = [
  { name: 'PHP',     level: 25 },
  { name: 'MySQL',   level: 25 },
  { name: 'Node.js', level: 25 },
];

function prefersReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}


function MyBioFolder() {

  const [generalTap, setGenerapTap] = useState(true)
  const [technologyTap, setTechnologyTap] = useState(false)
  const [hobbTap, setHobbTap] = useState(false)

  const { 
    themeDragBar,
    MybioExpand, setMybioExpand,
    StyleHide,
    isTouchDevice,
    handleSetFocusItemTrue,
    inlineStyleExpand,
    inlineStyle,
    deleteTap,
   } = useContext(UseContext);

  // ── Typewriter for the General tab ──
  const typing = MybioExpand.show && generalTap;
  const [typed, setTyped] = useState(0);
  useEffect(() => {
    if (!typing) return;
    if (prefersReducedMotion()) { setTyped(BIO_TOTAL); return; }
    setTyped(0);
    const id = setInterval(() => {
      setTyped(n => {
        if (n + 1 >= BIO_TOTAL) clearInterval(id);
        return n + 1;
      });
    }, TYPE_MS);
    return () => clearInterval(id);
  }, [typing]);

  // ── Meters fill up when the Technology tab opens ──
  const [metersFilled, setMetersFilled] = useState(false);
  useEffect(() => {
    if (!(MybioExpand.show && technologyTap)) { setMetersFilled(false); return; }
    const id = setTimeout(() => setMetersFilled(true), 50);
    return () => clearTimeout(id);
  }, [MybioExpand.show, technologyTap]);

  let budget = typed;
  const bioText = (
    <span className="bio_typed" onClick={() => setTyped(BIO_TOTAL)} title="Click to skip">
      {BIO_LINES.map((line, i) => {
        if (line.gap) return budget > 0 ? <br key={i} /> : null;
        const full = line.label || line.text;
        const shown = full.slice(0, Math.max(0, budget));
        budget -= full.length;
        if (!shown) return null;
        // Line breaks go before each line so the cursor stays on the line being typed.
        return (
          <Fragment key={i}>
            {i > 0 && <br />}
            {line.label ? <strong>{shown}</strong> : <span>{shown}</span>}
          </Fragment>
        );
      })}
      <span className={`bio_cursor${typed >= BIO_TOTAL ? ' done' : ''}`} aria-hidden="true" />
    </span>
  );

  const renderMeter = skill => (
          <span key={skill.name} className="bio_skill_row">
            <span className="bio_skill_name">{skill.name}</span>
            <span
              className="bio_meter"
              role="meter"
              aria-label={skill.name}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={skill.level}
            >
              <span className="bio_meter_fill" style={{ width: metersFilled ? `${skill.level}%` : 0 }} />
            </span>
          </span>
  );

  const technologyText = (
    <>
      <span className="bio_tech_intro">
        Focused on OOP, data structures and algorithms. I build games and
        mobile apps, plus web projects like this one.
      </span>
      <fieldset className="bio_skills">
        <legend>Skills</legend>
        {SKILLS.map(renderMeter)}
      </fieldset>
      <fieldset className="bio_skills bio_learning">
        <legend>Currently learning <span className="bio_learning_badge">beginner</span></legend>
        {LEARNING.map(renderMeter)}
      </fieldset>
    </>
  );

  const hobbyText = (
    <>
      In my free time I explore new tech, listen to music,
      and collect retro hardware. I'm always building something —
      even on weekends. I enjoy game dev, tinkering with old machines,
      and finding inspiration in retro aesthetics. Big fan of anything
      with a CRT glow.
    </>
  );

  function handleDragStop(event, data) {
    const positionX = data.x
    const positionY = data.y
    setMybioExpand(prev => ({
      ...prev,
      x: positionX,
      y: positionY
    }))
  }

  function handleBiotap(name) {
    setGenerapTap(name === 'general');
    setTechnologyTap(name === 'technology');
    setHobbTap(name === 'hobby');
  }

  const activeBtnStyle = {
    bottom: '2px',
    outline: '1px dotted black',
    outlineOffset: '-5px',
    borderBottomColor: '#c5c4c4',
    zIndex: '3'
  };

  return (
    <>
      <Draggable
        axis="both"
        handle={'.folder_dragbar'}
        grid={[1, 1]}
        scale={1}
        disabled={MybioExpand.expand}
        bounds={{ top: 0 }}
        defaultPosition={{
          x: window.innerWidth <= 500 ? 35 : 70,
          y: window.innerWidth <= 500 ? 35 : 40,
        }}
        onStop={(event, data) => handleDragStop(event, data)}
        onStart={() => handleSetFocusItemTrue('About')}
      >
        <motion.div
          className='bio_folder'
          onClick={(e) => {
            e.stopPropagation();
            handleSetFocusItemTrue('About');
          }}
          style={MybioExpand.expand ? inlineStyleExpand('About') : inlineStyle('About')}
        >
          <div
            className="folder_dragbar"
            style={{ background: MybioExpand.focusItem ? themeDragBar : '#757579' }}
          >
            <div className="bio_barname">
              <img src={About} alt="About" />
              <span>About</span>
            </div>
            <div className="bio_barbtn">
              <div
                onClick={!isTouchDevice ? (e) => {
                  e.stopPropagation()
                  setMybioExpand(prev => ({ ...prev, hide: true, focusItem: false }))
                  StyleHide('About')
                } : undefined}
                onTouchEnd={(e) => {
                  e.stopPropagation()
                  setMybioExpand(prev => ({ ...prev, hide: true, focusItem: false }))
                  StyleHide('About')
                }}
                onTouchStart={(e) => e.stopPropagation()}
              >
                <p className='dash'></p>
              </div>
              <div>
                <p
                  className='x'
                  onClick={!isTouchDevice ? () => {
                    deleteTap('About')
                    handleBiotap('general')
                  } : undefined}
                  onTouchEnd={() => {
                    deleteTap('About')
                    handleBiotap('general')
                  }}
                >×</p>
              </div>
            </div>
          </div>

          <div className="file_tap_container-bio">
            <p
              onClick={() => handleBiotap('general')}
              style={generalTap ? activeBtnStyle : {}}
            >General</p>
            <p
              onClick={() => handleBiotap('technology')}
              style={technologyTap ? activeBtnStyle : {}}
            >Technology</p>
            <p
              onClick={() => handleBiotap('hobby')}
              style={hobbTap ? activeBtnStyle : {}}
            >Hobby</p>
          </div>

          <div className="folder_content">
            <div
              className="folder_content-bio"
              style={{ display: generalTap ? 'grid' : 'block' }}
            >
              {!technologyTap && (
                <img
                  alt="bioPC"
                  className={generalTap ? 'bio_img' : 'bio_img_other'}
                  src={generalTap ? bioPC : hobby}
                />
              )}
              <div className="biotext_container">
                <p className={generalTap ? 'bio_text_1' : technologyTap ? 'bio_text_1_other bio_text_tech' : 'bio_text_1_other'}>
                  {generalTap ? bioText : technologyTap ? technologyText : hobbyText}
                </p>
              </div>
            </div>

            <div className="bio_btn_container">
              <div
                className="bio_btn_ok"
                onClick={!isTouchDevice ? () => {
                  deleteTap('About')
                  handleBiotap('general')
                } : undefined}
                onTouchEnd={() => {
                  deleteTap('About')
                  handleBiotap('general')
                }}
              >
                <span>OK</span>
              </div>
              <div
                className="bio_btn_cancel"
                onClick={!isTouchDevice ? () => {
                  deleteTap('About')
                  handleBiotap('general')
                } : undefined}
                onTouchEnd={() => {
                  deleteTap('About')
                  handleBiotap('general')
                }}
              >
                <span>Cancel</span>
              </div>
            </div>
          </div>
        </motion.div>
      </Draggable>
    </>
  )
}

export default MyBioFolder