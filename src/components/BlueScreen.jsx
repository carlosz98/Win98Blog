import { useEffect, useState } from 'react';
import { playError, playStartup } from './function/sounds';

// Easter egg: type "bsod" in Run. Shows a fake blue screen, then "reboots".
function BlueScreen() {
  const [stage, setStage] = useState(null); // 'blue' | 'reboot' | null

  useEffect(() => {
    const start = () => { setStage('blue'); playError(); };
    window.addEventListener('win98:bsod', start);
    return () => window.removeEventListener('win98:bsod', start);
  }, []);

  useEffect(() => {
    if (stage === 'blue') {
      const next = () => setStage('reboot');
      const arm = setTimeout(() => {
        window.addEventListener('keydown', next);
        window.addEventListener('pointerdown', next);
      }, 500);
      return () => {
        clearTimeout(arm);
        window.removeEventListener('keydown', next);
        window.removeEventListener('pointerdown', next);
      };
    }
    if (stage === 'reboot') {
      const done = setTimeout(() => { setStage(null); playStartup(); }, 2600);
      return () => clearTimeout(done);
    }
  }, [stage]);

  if (!stage) return null;

  if (stage === 'reboot') {
    return (
      <div className="bsod bsod_reboot">
        <p>Restarting Windows 98...</p>
        <p className="bsod_cursor">_</p>
      </div>
    );
  }

  return (
    <div className="bsod">
      <div className="bsod_inner">
        <p className="bsod_title"><span>Windows</span></p>
        <p>A fatal exception 0E has occurred at 0028:C0FFEE98 in VXD CARLOS(01) +</p>
        <p>00010E36. The current application will be terminated.</p>
        <br />
        <p>*  Don't worry, this is just an easter egg. Carlos's site is fine.</p>
        <p>*  Press any key or tap to restart the computer. You will</p>
        <p>&nbsp;&nbsp;&nbsp;lose any unsaved information in all applications.</p>
        <br />
        <p className="bsod_center">Press any key to continue <span className="bsod_cursor">_</span></p>
      </div>
    </div>
  );
}

export default BlueScreen;
