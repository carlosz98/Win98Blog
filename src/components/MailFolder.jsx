import UseContext from '../Context'
import { useContext } from "react";
import Draggable from 'react-draggable'
import { motion } from 'framer-motion';
import Mail from '../assets/mail.png'
import '../css/MailFolder.css'


function MailFolder() {

  const { 
    themeDragBar,
    MailExpand, setMailExpand,
    lastTapTime, setLastTapTime,
    StyleHide,
    isTouchDevice,
    handleSetFocusItemTrue,
    inlineStyleExpand,
    inlineStyle,
    deleteTap,
    iconFocusIcon,
   } = useContext(UseContext);

  function handleDragStop(event, data) {
    const positionX = data.x 
    const positionY = data.y
    setMailExpand(prev => ({
      ...prev,
      x: positionX,
      y: positionY
    }))
  }

  function handleExpandStateToggle() {
    setMailExpand(prevState => ({
      ...prevState,
      expand: !prevState.expand
    }));
  }

  function handleExpandStateToggleMobile() {
    const now = Date.now();
    if (now - lastTapTime < 300) {
      setMailExpand(prevState => ({
        ...prevState,
        expand: !prevState.expand
      }));
    }
    setLastTapTime(now);
  }

  return (
    <>
      <Draggable
        axis="both" 
        handle={'.folder_dragbar-mail'}
        grid={[1, 1]}
        scale={1}
        disabled={MailExpand.expand}
        bounds={{ top: 0 }}
        defaultPosition={{ 
          x: window.innerWidth <= 500 ? 20 : 50,
          y: window.innerWidth <= 500 ? 40 : 120,
        }}
        onStop={(event, data) => handleDragStop(event, data)}
        onStart={() => handleSetFocusItemTrue('Mail')}
      >
        <div
          className='folder_folder-mail' 
          onClick={(e) => {
            e.stopPropagation();
            handleSetFocusItemTrue('Mail');
          }}
          style={MailExpand.expand ? inlineStyleExpand('Mail') : inlineStyle('Mail')}
        >
          <div
            className="folder_dragbar-mail"
            onDoubleClick={handleExpandStateToggle}
            onTouchStart={handleExpandStateToggleMobile}
            style={{ background: MailExpand.focusItem ? themeDragBar : '#757579' }}
          >
            <div className="folder_barname-mail">
              <img src={Mail} alt="Mail" />
              <span>Mail</span>
            </div>
            <div className="folder_barbtn-mail">
              <div
                onClick={!isTouchDevice ? (e) => {
                  e.stopPropagation()
                  setMailExpand(prev => ({ ...prev, hide: true, focusItem: false }))
                  StyleHide('Mail') 
                } : undefined}
                onTouchEnd={(e) => {
                  e.stopPropagation()
                  setMailExpand(prev => ({ ...prev, hide: true, focusItem: false }))
                  StyleHide('Mail')
                }}
                onTouchStart={(e) => e.stopPropagation()}
              >
                <p className='dash-mail'></p>
              </div>
              <div
                onClick={!isTouchDevice ? () => handleExpandStateToggle() : undefined}
                onTouchEnd={handleExpandStateToggle}
              >
                <motion.div className={`expand-mail ${MailExpand.expand ? 'full' : ''}`}>
                </motion.div>
                {MailExpand.expand ? <div className="expand_2-mail"></div> : null}
              </div>
              <div>
                <p
                  className='x-mail'
                  onClick={!isTouchDevice ? () => deleteTap('Mail') : undefined}
                  onTouchEnd={() => deleteTap('Mail')}
                >×</p>
              </div>
            </div>
          </div>

          <div className="file_edit_container-mail">
            <p>File<span style={{ left: '-23px' }}>_</span></p>
            <p>Edit<span style={{ left: '-24px' }}>_</span></p>
            <p>View<span style={{ left: '-32px' }}>_</span></p>
            <p>Help<span style={{ left: '-30px' }}>_</span></p>
          </div>

          <div
            className="folder_content-mail"
            onClick={() => iconFocusIcon('')}
            style={MailExpand.expand ? { height: 'calc(100svh - 100px)' } : {}}
          >
            <div style={{
              padding: '20px',
              fontFamily: 'MS Sans Serif, Arial, sans-serif',
              fontSize: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}>

              {/* Header message */}
              <div style={{
                background: '#d4d0c8',
                border: '2px inset #808080',
                padding: '12px 16px',
                fontSize: '12px',
                lineHeight: '1.8',
              }}>
                <strong>👋 Hey there!</strong>
                <br />
                Want to get in touch? Reach out through any of the options below.
                I'm open to opportunities, collabs, and conversations.
              </div>

              {/* Email link */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}>
                <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>📧 Email</p>
                <a
                  href="mailto:czabala98@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    background: '#d4d0c8',
                    border: '2px outset #ffffff',
                    padding: '6px 14px',
                    color: '#000080',
                    textDecoration: 'none',
                    fontFamily: 'MS Sans Serif, Arial, sans-serif',
                    fontSize: '12px',
                    cursor: 'pointer',
                    width: 'fit-content',
                  }}
                  onMouseOver={e => e.currentTarget.style.background = '#000080'}
                  onMouseOut={e => e.currentTarget.style.background = '#d4d0c8'}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = 'white'
                    e.currentTarget.style.background = '#000080'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = '#000080'
                    e.currentTarget.style.background = '#d4d0c8'
                  }}
                >
                  czabala98@gmail.com
                </a>
              </div>

              {/* LinkedIn link */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}>
                <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>💼 LinkedIn</p>
                <a
                  href="https://www.linkedin.com/in/carloszabala98/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    background: '#d4d0c8',
                    border: '2px outset #ffffff',
                    padding: '6px 14px',
                    color: '#000080',
                    textDecoration: 'none',
                    fontFamily: 'MS Sans Serif, Arial, sans-serif',
                    fontSize: '12px',
                    cursor: 'pointer',
                    width: 'fit-content',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = 'white'
                    e.currentTarget.style.background = '#000080'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = '#000080'
                    e.currentTarget.style.background = '#d4d0c8'
                  }}
                >
                  linkedin.com/in/carloszabala98
                </a>
              </div>

              {/* GitHub link */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}>
                <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>🐙 GitHub</p>
                <a
                  href="https://github.com/carlosz98"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    background: '#d4d0c8',
                    border: '2px outset #ffffff',
                    padding: '6px 14px',
                    color: '#000080',
                    textDecoration: 'none',
                    fontFamily: 'MS Sans Serif, Arial, sans-serif',
                    fontSize: '12px',
                    cursor: 'pointer',
                    width: 'fit-content',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = 'white'
                    e.currentTarget.style.background = '#000080'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = '#000080'
                    e.currentTarget.style.background = '#d4d0c8'
                  }}
                >
                  github.com/carlosz98
                </a>
              </div>

              {/* Footer note */}
              <div style={{
                borderTop: '1px solid #808080',
                paddingTop: '12px',
                color: '#444',
                fontSize: '11px',
              }}>
                © 2025 Carlos Zabala — New York City
              </div>

            </div>
          </div>
        </div>
      </Draggable>
    </>
  )
}          

export default MailFolder