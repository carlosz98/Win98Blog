import UseContext from '../Context';
import { useContext, useState, useRef, useEffect } from "react";
import Draggable from 'react-draggable';
import { motion } from 'framer-motion';
import msnPic from '../assets/msn.png';
import chat from '../assets/chat.png';
import nudge from '../assets/nudge.png';
import nudgeSound from '../assets/nudgeSound.mp3';
import '../css/MSN.css';
import { botReply, GREETING, SUGGESTIONS } from './function/msnBot';

function MsnFolder() {

  const {
    handleShow,
    ringMsn, setRingMsn,
    themeDragBar,
    userNameValue, setUserNameValue,
    MSNExpand, setMSNExpand,
    lastTapTime, setLastTapTime,
    StyleHide,
    isTouchDevice,
    handleSetFocusItemTrue,
    inlineStyleExpand,
    inlineStyle,
    deleteTap,
  } = useContext(UseContext);

  
  const [userName, setUserName] = useState(false);
  const [chatValue, setChatValue] = useState('');
  const [botTyping, setBotTyping] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem('msn_bot_chat') || 'null');
      if (Array.isArray(saved) && saved.length) return saved;
    } catch { /* ignore */ }
    return [{ from: 'bot', ...GREETING, date: Date.now() }];
  });
  const endOfMessagesRef = useRef(null);
  const typingTimer = useRef(null);

  useEffect(() => {
    try { sessionStorage.setItem('msn_bot_chat', JSON.stringify(messages.slice(-60))); } catch { /* ignore */ }
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, botTyping]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView();
  }, [MSNExpand.show]);

  useEffect(() => () => clearTimeout(typingTimer.current), []);

  useEffect(() => {
    if (ringMsn) {
      handleShow('MSN');
      const audio = new Audio(nudgeSound);
      audio.play().catch((err) => console.error("Audio play failed:", err));
    }
  }, [ringMsn]);

  function respond(reply, delay) {
    setBotTyping(true);
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      setBotTyping(false);
      setMessages(prev => [...prev, { from: 'bot', ...reply, date: Date.now() }]);
    }, delay);
  }

  function sendMessage(text) {
    const value = (text ?? chatValue).trim();
    if (!value || botTyping) return;
    setMessages(prev => [...prev, { from: 'user', text: value, date: Date.now() }]);
    setChatValue('');
    const reply = botReply(value);
    // Longer answers take a little longer to "type", like a real chat.
    respond(reply, Math.min(600 + reply.text.length * 12, 2200));
  }

  function sendNudge() {
    setRingMsn(true);
    respond({ text: 'Whoa, you just sent me a nudge! 😄 What would you like to know?' }, 900);
  }

  function runAction(action) {
    if (action.url) window.open(action.url, '_blank', 'noopener');
    else if (action.open) handleShow(action.open);
  }

  function handleDragStop(event, data) {
    const positionX = data.x;
    const positionY = data.y;
    setMSNExpand(prev => ({
      ...prev,
      x: positionX,
      y: positionY
    }));
  }

  function handleExpandStateToggle() {
    setMSNExpand(prevState => ({
      ...prevState,
      expand: !prevState.expand
    }));
  }

  function handleExpandStateToggleMobile() {
    const now = Date.now();
    if (now - lastTapTime < 300) {
      setMSNExpand(prevState => ({
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
        handle={'.folder_dragbar-MSN'}
        grid={[1, 1]}
        scale={1}
        disabled={MSNExpand.expand}
        bounds={{ top: 0 }}
        defaultPosition={{
          x: window.innerWidth <= 500 ? 20 : 50,
          y: window.innerWidth <= 500 ? 40 : 120,
        }}
        onStop={(event, data) => handleDragStop(event, data)}
        onStart={() => handleSetFocusItemTrue('MSN')}
      >
        <div className={`folder_folder-MSN ${ringMsn ? 'shake' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            handleSetFocusItemTrue('MSN');
          }}
          onAnimationEndCapture={() => {
              setRingMsn(false)
            }}
          style={
            MSNExpand.expand ? inlineStyleExpand('MSN') : inlineStyle('MSN')
          }
        >

          {/* -------------------------- Add username --------------------------------- */}
          <div className={userName ? 'Username_input_div_active' : 'Username_input_div_disabled'}>
            <div className="container_username">
              <div className="form_banner"
                style={{ background: MSNExpand.focusItem ? themeDragBar : '#757579' }}
              >
                <img src={chat} alt="chat" />
                <p className='username_text_banner'>
                  Username
                </p>
                <div className="close_form_banner"
                  onClick={() => setUserName(false)}
                >
                  <p>×</p>
                </div>
              </div>
              <form onSubmit={(e) => { e.preventDefault() }}>
                <p>
                  Username:
                </p>
                <input type="text" maxLength={20} placeholder='Enter your username here...'
                  value={userNameValue}
                  onChange={(e) => setUserNameValue(e.target.value)}
                />
                <div className="ok_cancel_username">
                  <button
                    onClick={() => {
                      setUserName(false)
                      localStorage.setItem('username', userNameValue)
                    }}
                  >
                    Ok
                  </button>
                  <button
                    onClick={() => {
                      setUserName(false);
                      setUserNameValue(() => {
                        const localName = localStorage.getItem('username')
                        return localName && localName.length > 0 ? localName : ''
                      });
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
          {/* ------------------------------------------------------------------------------ */}
          <div className="folder_dragbar-MSN"
            onDoubleClick={handleExpandStateToggle}
            onTouchStart={handleExpandStateToggleMobile}
            style={{ background: MSNExpand.focusItem ? themeDragBar : '#757579' }}
          >
            <div className="folder_barname-MSN">
              <img src={msnPic} alt="msnPic" />
              <span>MSN</span>
            </div>
            <div className="folder_barbtn-MSN">
              <div onClick={!isTouchDevice ? (e) => {
                e.stopPropagation();
                setMSNExpand(prev => ({ ...prev, hide: true, focusItem: false }));
                StyleHide('MSN');
              } : undefined}
                onTouchEnd={(e) => {
                  e.stopPropagation();
                  setMSNExpand(prev => ({ ...prev, hide: true, focusItem: false }));
                  StyleHide('MSN');
                }}
                onTouchStart={(e) => e.stopPropagation()}
              >
                <p className='dash-MSN'></p>
              </div>
              <div
                onClick={!isTouchDevice ? () => handleExpandStateToggle() : undefined}
                onTouchEnd={handleExpandStateToggle}
              >
                <motion.div className={`expand-MSN ${MSNExpand.expand ? 'full' : ''}`}>
                </motion.div>
                {MSNExpand.expand ?
                  (
                    <div className="expand_2-MSN"></div>
                  )
                  :
                  (null)}
              </div>
              <div>
                <p className='x-MSN'
                  onClick={!isTouchDevice ? () => {
                    deleteTap('MSN');
                    setUserName(false);
                    setChatValue('')
                  } : undefined}
                  onTouchEnd={() => {
                    deleteTap('MSN');
                    setUserName(false);
                    setChatValue('')
                  }}
                >
                  ×
                </p>
              </div>
            </div>
          </div>

          <div className="file_edit_container-MSN">
            <p>File<span style={{ left: '-23px' }}>_</span></p>
            <p>Edit<span style={{ left: '-24px' }}>_</span></p>
            <p>View<span style={{ left: '-32px' }}>_</span></p>
            <p>Help<span style={{ left: '-30px' }}>_</span></p>
          </div>
          <div className='groove_div'>
            <div className="chat_name_msn_div"
              onClick={() => setUserName(true)}
              title="Change your name"
            >
              <img src={chat} alt="chat" />
            </div>
            <div className="shake_message" onClick={sendNudge} title="Send a nudge">
              <img src={nudge} alt="" />
            </div>
            <span>Username: {userNameValue ? userNameValue : 'Anonymous'}</span>
            <div className="activate_bot active">
              <span>Bot Online</span>
            </div>
          </div>
          <div className="chat_to_div">
            <span>
              To: <span>CarlosBot</span> &lt;ask me about Carlos&gt;
            </span>
          </div>

          <div className="folder_content-MSN">
            {messages.map((msg, index) => (
              <div className='text_container' key={index}>
                <p>
                  <span style={{ color: msg.from === 'bot' ? 'purple' : 'blue' }}>
                    &lt;{msg.from === 'bot' ? 'CarlosBot' : (userNameValue || 'You')}&gt;:{' '}
                  </span>
                  <span style={{ color: msg.from === 'bot' ? 'purple' : '#171616' }}>{msg.text}</span>
                </p>
                {msg.actions?.length > 0 && (
                  <div className="msn_bot_actions">
                    {msg.actions.map(action => (
                      <button key={action.label} onClick={() => runAction(action)}>{action.label}</button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {botTyping && (
              <div className='text_container'>
                <p><span style={{ color: 'purple' }}>&lt;CarlosBot&gt;: </span><span className="msn_typing_dots">...</span></p>
              </div>
            )}
            <div ref={endOfMessagesRef} />
          </div>

          <div className="msn_suggestions">
            {SUGGESTIONS.map(q => (
              <button key={q} disabled={botTyping} onClick={() => sendMessage(q)}>{q}</button>
            ))}
          </div>

          <div className="enter_text_div">
            <textarea
              maxLength={200}
              placeholder='Ask CarlosBot something...'
              value={chatValue}
              onChange={(e) => setChatValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { e.preventDefault(); sendMessage(); }
              }}
            />
            <button
              style={{ color: botTyping ? 'grey' : null }}
              disabled={botTyping}
              onClick={() => sendMessage()}
            >
              Send
            </button>
          </div>
          <div className="status_div">
            <p>
              {botTyping
                ? 'CarlosBot is typing...'
                : chatValue.trim().length > 0
                  ? `${userNameValue || 'You'} is typing...`
                  : 'CarlosBot is online'}
            </p>
          </div>
        </div>
      </Draggable>
    </>
  );
}

export default MsnFolder;
