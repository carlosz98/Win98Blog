import UseContext from '../Context';
import { useState, useEffect, useRef, useContext } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import "../css/NewsApp.css";
import { MdGpsFixed } from "react-icons/md";

function NewsApp() {
    const newsContainerRef = useRef();
    const [error, setError] = useState('');
    const [allNews, setAllNews] = useState([]);
    const [newsLoading, setNewsLoading] = useState(false);

    const { 
        tileScreen,
        city, setCity,
        Cel, setCel,
        weather, setWeather,
        newsPopup, setNewsPopup,
    } = useContext(UseContext);

    const time = new Date();
    const hours = time.getHours();
    const isNight = hours > 17 || hours < 6;

    const weatherIcons = {
        0: isNight ? '🌙' : '☀️',
        1: isNight ? '🌙' : '🌤️',
        2: isNight ? '🌙' : '⛅',
        3: '☁️',
        45: '🌫️',
        61: '🌧️',
        71: '❄️',
        95: '⛈️',
    };

    useEffect(() => {
        fetchNews();
    }, []);

    async function fetchNews() {
        setNewsLoading(true);
        try {
            const query = encodeURIComponent('retro games OR video games OR gaming OR Nintendo OR PlayStation OR arcade');
            const apiKey = '930cfa1c4d5969e6b17e36963f4c1e5b';
            const url = `https://gnews.io/api/v4/search?q=${query}&lang=en&max=20&sortby=publishedAt&token=${apiKey}`;
            const response = await fetch(url);
            const data = await response.json();
            if (data.articles) {
                setAllNews(data.articles);
            } else {
                setError('Could not load news.');
            }
        } catch (err) {
            console.error('Error fetching gaming news:', err);
            setError('Failed to load news.');
        } finally {
            setNewsLoading(false);
        }
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                newsContainerRef.current &&
                !newsContainerRef.current.contains(event.target) &&
                !event.target.closest('.time')
            ) {
                setNewsPopup(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [newsContainerRef]);

    function openNews(url) {
        window.open(url);
    }

    useEffect(() => {
        if (newsPopup) getUserLocation();
    }, [newsPopup]);

    useEffect(() => {
        getUserLocation();
    }, [tileScreen]);

    function getUserLocation() {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lon = pos.coords.longitude;
                fetchWeatherAndCity(lat, lon);
            },
            () => setError('Location permission denied')
        );
    }

    function fetchWeatherAndCity(lat, lon) {
        if (!lat || !lon) return;

        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weathercode`;
        fetch(weatherUrl)
            .then(res => res.json())
            .then(data => {
                const current = data.current;
                const tempF = ((current.temperature_2m * 9 / 5) + 32).toFixed(0);
                const code = current.weathercode;
                setWeather({ temp: tempF, code: code });
                localStorage.setItem('tempF', JSON.stringify(tempF));
                localStorage.setItem('iconCode', JSON.stringify(code));
            })
            .catch(() => setError('Failed to fetch weather'));

        const geoUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
        fetch(geoUrl, { headers: { 'User-Agent': 'NewsApp/1.0 (portfolio)' } })
            .then(res => res.json())
            .then(data => {
                const address = data.address;
                const cityName = address.city || address.town || address.village || address.state || 'Unknown';
                setCity(cityName);
                localStorage.setItem('city', JSON.stringify(cityName));
            })
            .catch(() => setCity('Unknown'));
    }

    return (
        <>
            <AnimatePresence>
                {newsPopup && (
                    <motion.div
                        className="news_container"
                        ref={newsContainerRef}
                        initial={{ opacity: 0, x: '-500px' }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ ease: 'easeInOut', duration: 0.3 }}
                        exit={{ opacity: 0, x: '-500px' }}
                    >
                        {weather && (
                            <div className="weather_container">
                                <span className='location' onClick={getUserLocation}>
                                    <MdGpsFixed />
                                </span>
                                <h1>{city}</h1>
                                <h1>
                                    {weatherIcons[weather.code] || ''}
                                    <span
                                        className="temp"
                                        onClick={() => setCel(!Cel)}
                                    >
                                        {Cel ? weather.temp : ((weather.temp - 32) * 5 / 9).toFixed(0)}
                                        {Cel ? '°F' : '°C'}
                                    </span>
                                </h1>
                            </div>
                        )}

                        {error && <p className="error">{error}</p>}

                        <h1>🎮 Gaming News</h1>

                        {newsLoading && <p>Loading gaming news...</p>}

                        {!newsLoading && allNews.length > 0 ? (
                            allNews.map((item, index) => (
                                <div
                                    className="news"
                                    key={index}
                                    onClick={() => openNews(item.url)}
                                >
                                    {item.image && <img src={item.image} alt="" />}
                                    <h5>{item.title}</h5>
                                </div>
                            ))
                        ) : (
                            !newsLoading && <p>No news found.</p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default NewsApp;