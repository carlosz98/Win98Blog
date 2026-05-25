import { useEffect, useState } from 'react';

const BIOS_LINES = [
  'Award Modular BIOS v4.51PG, An Energy Star Ally',
  'Copyright (C) 1984-98, Award Software, Inc.',
  '',
  'ASUS P2B ACPI BIOS Revision 1011',
  'Main Processor : Intel Pentium II 350MHz',
  'Memory Testing : 65536K OK',
  '',
  'Detecting Primary Master  ... ST34321A',
  'Detecting Primary Slave   ... None',
  'Detecting Secondary Master... ATAPI CD-ROM',
  'Detecting Secondary Slave ... None',
  '',
  'Award Plug and Play BIOS Extension v1.0A',
  'Initialize Plug and Play Cards...',
  'PnP Init Completed',
  '',
  'Carlos Zabala Portfolio OS v1.0',
  'Loading Windows 98...',
];

export default function StartupAnimation({ onComplete }) {
  const [visibleLines, setVisibleLines] = useState([]);
  const [done, setDone] = useState(false);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setVisibleLines(prev => [...prev, BIOS_LINES[i]]);
      i++;
      if (i >= BIOS_LINES.length) {
        clearInterval(interval);
        setTimeout(() => setDone(true), 600);
      }
    }, 95);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!done) return;
    const start = performance.now();
    const dur = 600;
    function frame(now) {
      const t = Math.min((now - start) / dur, 1);
      setOpacity(1 - t);
      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        onComplete();
      }
    }
    requestAnimationFrame(frame);
  }, [done]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      opacity,
      background: '#000',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      padding: '24px 32px',
      fontFamily: '"Courier New", Courier, monospace',
      fontSize: '13px',
      color: '#aaaaaa',
      lineHeight: '1.6',
      overflowY: 'hidden',
    }}>
      {visibleLines.map((line, i) => (
        <div key={i} style={{
          color:
            line.startsWith('Carlos') ? '#ffffff' :
            line.startsWith('Award') || line.startsWith('Copyright') || line.startsWith('ASUS') ? '#ffffff' :
            line.startsWith('Loading') ? '#ffff00' :
            '#aaaaaa',
          fontWeight:
            line.startsWith('Carlos') || line.startsWith('Loading') ? 'bold' : 'normal',
        }}>
          {line || '\u00A0'}
        </div>
      ))}
      <span style={{
        display: 'inline-block',
        width: '8px',
        height: '13px',
        background: '#aaaaaa',
        marginTop: '2px',
        animation: 'blink 0.7s step-end infinite',
      }} />
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}