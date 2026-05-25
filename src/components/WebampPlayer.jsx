import { useEffect, useRef, useContext, useState } from 'react';
import UseContext from '../Context'
import Webamp from 'webamp';
import { TRACKS } from './WinampVisualizer';

const WebampPlayer = () => {

    const [focus, setFocus] = useState(false)

    const { 
        ObjectState,
        maxZindexRef,
        WinampExpand, setWinampExpand,
        deleteTap,
    } = useContext(UseContext);

    const appRef = useRef(null);

    useEffect(() => {
        let webampInstance;
        let disposed = false;
    
        const startWebamp = () => {
            if (Webamp.browserIsSupported()) {
                const options = {
                    // Tracks come from WinampVisualizer TRACKS array
                    // Add songs there and they automatically appear here too
                    initialTracks: TRACKS.map(track => ({
                        metaData: {
                            artist: track.artist,
                            title: track.title,
                        },
                        url: track.url,
                        duration: track.duration,
                    })),
                    zIndex: 999
                };
                const webamp = new Webamp(options);
                webampInstance = webamp;
    
                const handleClose = () => {
                    if (!disposed) {
                        disposed = true;
                        webamp.dispose();
                        deleteTap('Winamp');
                    }
                };
    
                webamp.onClose(handleClose);
    
                webamp.onMinimize(() => {
                    const webampElement = document.querySelector('#webamp');
                    if (webampElement) {
                        webampElement.style.opacity = 0;
                        webampElement.style.pointerEvents = 'none';
                        webampElement.style.touchAction = 'none';
                        webampElement.style.zIndex = -1;
                        setWinampExpand(prev => ({ ...prev, hide: true, focusItem: false }));
                        setFocus(false);
                    }
                });
    
                webamp.renderWhenReady(appRef.current);
            }
        };
    
        startWebamp();
    
        return () => {
            if (webampInstance && !disposed) {
                disposed = true;
                webampInstance.dispose();
            }
        };
    }, []);

    useEffect(() => {
        const webampElement = document.querySelector('#webamp');
        if (webampElement) {
            if (WinampExpand.focusItem) {
                webampElement.style.zIndex = 999;
            }
            if (!WinampExpand.focusItem && !WinampExpand.hide) {
                const maxZindex = (maxZindexRef.current || 0) + 1;
                webampElement.style.zIndex = maxZindex;
                maxZindexRef.current = maxZindex;
            }
        }
    }, [WinampExpand.focusItem]);
    
    useEffect(() => {
        const handleFocusWinamp = (event) => {
            if (event.target.closest('#webamp') && !focus) {
                const allState = ObjectState();
                allState.forEach(item => {
                    item.setter(prev => ({ ...prev, focusItem: item.name === 'Winamp' }));
                });
            }
        };
    
        document.addEventListener('click', handleFocusWinamp);
        document.addEventListener('touchstart', handleFocusWinamp);
        document.addEventListener('mousedown', handleFocusWinamp);
    
        return () => {
            document.removeEventListener('click', handleFocusWinamp);
            document.removeEventListener('touchstart', handleFocusWinamp);
            document.removeEventListener('mousedown', handleFocusWinamp);
        };
    }, []);

    return (
        <div ref={appRef} className='winampRef'></div>
    );
};

export default WebampPlayer;