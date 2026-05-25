import UseContext from '../Context'
import { useContext, useState } from "react";
import Draggable from 'react-draggable'
import { motion } from 'framer-motion';
import About from '../assets/ipng.png'
import bioPC from '../assets/bio_pc.png'
import tech from '../assets/tech.png'
import hobby from '../assets/hobby.png'
import '../css/MyBioFolder.css'


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

  const technologyText = (
    <>
      Strong foundation in <span>C++</span>, <span>C#</span> and <span>Java</span> with
      a focus on <span>OOP</span>, Data Structures, and Algorithms.
      I build games with <span>Unreal Engine 5</span> and <span>Unity</span>,
      and develop for <span>Android</span> (Kotlin / Jetpack Compose)
      and <span>iOS</span> (SwiftUI). Also comfortable with{' '}
      <span>HTML / CSS / JS</span>, <span>React</span>, and cloud tools like{' '}
      <span>GCP</span> and <span>Firebase</span>.
    </>
  );

  const bioText = (
    <>
      <strong>Objective:</strong>
      <br />
      <span>Building software, games, and retro experiences.</span>
      <br />
      <br />
      <strong>Information:</strong>
      <br />
      <span>Carlos Zabala</span>
      <br />
      <span>Programmer &amp; Software Developer</span>
      <br />
      <span>LaGuardia Community College</span>
      <br />
      <br />
      <strong>Location:</strong>
      <br />
      <span>New York City</span>
      <br />
      <span>Open to opportunities</span>
      <br />
      <span>On Site / Remote</span>
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
              <img
                alt="bioPC"
                className={generalTap ? 'bio_img' : 'bio_img_other'}
                src={generalTap ? bioPC : (technologyTap ? tech : hobby)}
              />
              <div className="biotext_container">
                <p className={generalTap ? 'bio_text_1' : 'bio_text_1_other'}>
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