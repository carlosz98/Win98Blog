import UseContext from '../Context'
import { Fragment, useContext } from "react";
import Draggable from 'react-draggable'
import { motion } from 'framer-motion';
import resumefile from '../assets/resume.png'
import '../css/ResumeFile.css'
import { RESUME } from './function/resumeData'



function ResumeFile() {

  const { 
    themeDragBar,
    ResumeFileExpand, setResumeFileExpand,
    lastTapTime, setLastTapTime,
    StyleHide,
    isTouchDevice,
    handleSetFocusItemTrue,
    inlineStyleExpand,
    inlineStyle,
    deleteTap,
    handleShow,

   } = useContext(UseContext);


      function handleDragStop(event, data) {
        const positionX = data.x 
        const positionY = data.y
        setResumeFileExpand(prev => ({
          ...prev,
          x: positionX,
          y: positionY
        }))

      }

   function handleExpandStateToggle() {
    setResumeFileExpand(prevState => ({
      ...prevState,
      expand: !prevState.expand
    }));
  }

  function handleExpandStateToggleMobile() {
    const now = Date.now();
    if (now - lastTapTime < 300) {
        setResumeFileExpand(prevState => ({
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
        handle={'.folder_dragbar-resumefile'}
        grid={[1, 1]}
        scale={1}
        disabled={ResumeFileExpand.expand}
        bounds={{top: 0}}
        defaultPosition={{ 
          x: window.innerWidth <= 500 ? 5 : 80,
          y: window.innerWidth <= 500 ? 100 : 90,
        }}
        onStop={(event, data) => handleDragStop(event, data)}
        onStart={() => handleSetFocusItemTrue('ResumeFile')}
      >
        <div className='folder_folder-resumefile resume_window' 
            onClick={(e) => {
              e.stopPropagation();
              handleSetFocusItemTrue('ResumeFile');
            }}
            style={ ResumeFileExpand.expand ? inlineStyleExpand('ResumeFile') : inlineStyle('ResumeFile')}>
          <div className="folder_dragbar-resumefile"
              onDoubleClick={handleExpandStateToggle}
              onTouchStart={handleExpandStateToggleMobile}
             style={{ background: ResumeFileExpand.focusItem? themeDragBar : '#757579'}}
          >
            <div className="folder_barname-resumefile">
              <img src={resumefile} alt="resumefile" />
              <span>Resume</span>
            </div>
            <div className="folder_barbtn-resumefile">
              <div onClick={ !isTouchDevice? (e) => {
                e.stopPropagation()
                setResumeFileExpand(prev => ({...prev, hide: true, focusItem: false}))
                StyleHide('ResumeFile') 
              } : undefined
            }
                   onTouchEnd={(e) => {
                    e.stopPropagation()
                    setResumeFileExpand(prev => ({...prev, hide: true, focusItem: false}))
                    StyleHide('ResumeFile')
                  }}
                  onTouchStart={(e) => e.stopPropagation()}
              >
                <p className='dash-resumefile'></p>
              </div>
              <div
                onClick={ !isTouchDevice ? () => handleExpandStateToggle() : undefined}
                onTouchEnd={handleExpandStateToggle}
              >
                <motion.div className={`expand-resumefile ${ResumeFileExpand.expand ? 'full' : ''}`}>
                </motion.div>
                {ResumeFileExpand.expand ? 
                (
                <div className="expand_2-resumefile"></div>
                )
                :
                (null)}
              </div>
              <div>
                <p className='x-resumefile'
                 onClick={!isTouchDevice ? () => deleteTap('ResumeFile') : undefined}
                onTouchEnd={() => deleteTap('ResumeFile')}
                >×</p>
              </div>
            </div>
          </div>

          <div className="folder_content-resumefile"
            style={ResumeFileExpand.expand ? 
              { height: 'calc(100svh - 72px)'} /// fullscreen btm nav
              : 
              {}
            }

          >
            {ResumeFileExpand.show ? (
              <div className="resume_doc">
                <header className="resume_head">
                  <h1>{RESUME.name}</h1>
                  <p className="resume_title">{RESUME.title}</p>
                  <p className="resume_contact">
                    <span>{RESUME.location}</span>
                    {RESUME.contact.map(c => (
                      <button key={c.label} type="button" className="resume_link"
                        onClick={() => c.open ? handleShow(c.open) : window.open(c.url, '_blank', 'noopener')}
                      >{c.label}</button>
                    ))}
                  </p>
                </header>

                <h2>Summary</h2>
                <p>{RESUME.summary}</p>

                <h2>Education</h2>
                <p className="resume_row">
                  <b>{RESUME.education.school}</b>
                  <span>{RESUME.education.place}</span>
                </p>
                <p className="resume_sub">Relevant coursework:</p>
                <ul className="resume_courses">
                  {RESUME.education.coursework.map(c => <li key={c}>{c}</li>)}
                </ul>

                <h2>Skills</h2>
                <dl className="resume_skills">
                  {RESUME.skills.map(s => (
                    <Fragment key={s.group}>
                      <dt>{s.group}</dt>
                      <dd>{s.items}</dd>
                    </Fragment>
                  ))}
                </dl>

                <h2>Projects</h2>
                {RESUME.projects.map(p => (
                  <div key={p.project} className="resume_project">
                    <p className="resume_row">
                      <button type="button" className="resume_link" onClick={() => handleShow(p.project)}
                        data-tip="Open project"
                      ><b>{p.name}</b></button>
                      <span>{p.stack}</span>
                    </p>
                    <p>{p.text}</p>
                  </div>
                ))}
                <p className="resume_more">
                  More in the <button type="button" className="resume_link" onClick={() => handleShow('Project')}>Project</button> folder.
                </p>
              </div>
            ):(null)}
            
          </div>
        </div>
      </Draggable>
    </>
  )
}          


export default ResumeFile
