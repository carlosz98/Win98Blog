import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import StartupAnimation from './components/StartupAnimation.jsx'

function Root() {
  const [showAnimation, setShowAnimation] = useState(() => {
    const seen = sessionStorage.getItem('booted');
    return seen !== 'true';
  });

  function handleBootComplete() {
    sessionStorage.setItem('booted', 'true');
    setShowAnimation(false);
  }

  return (
    <>
      {showAnimation && <StartupAnimation onComplete={handleBootComplete} />}
      <App />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <Root />
  // </React.StrictMode>
)