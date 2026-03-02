import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AppBar.css';

const getTrackInfo = () => {
    return { title: "Название трека", artist: "Исполнитель", duration: 240 };
};

const AppBar = ({ activeTab = 'Главная', onFavoritesClick }) => {
    const navigate = useNavigate();

    const [isPlaying, setIsPlaying] = useState(false);
    const [isShuffle, setIsShuffle] = useState(false);
    const [isRepeat, setIsRepeat] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [progress, setProgress] = useState(30);
    const { title, artist, duration } = getTrackInfo();

    const handleTrackClick = () => {
        console.log("Клик по треку:", title, "—", artist);
    };

    const handlePlayPause = () => {
        console.log("Кнопка воспроизведения");
        setIsPlaying(!isPlaying);
    };

    const handleNext = () => {
        console.log("Следующий трек");
    };

    const handlePrev = () => {
        console.log("Предыдущий трек");
    };

    const toggleShuffle = () => {
        setIsShuffle(!isShuffle);
        console.log("Случайное переключение:", !isShuffle);
    };

    const toggleRepeat = () => {
        setIsRepeat(!isRepeat);
        console.log("Повтор:", !isRepeat);
    };

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
        console.log("Избранное:", !isFavorite);
    };

    const handleAddToPlaylist = () => {
        console.log("Добавить в плейлист");
    };

    const handleProgressChange = (e) => {
        setProgress(Number(e.target.value));
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleFavoritesClick = () => {
        navigate('/favorites');
    };

    return (
        <div className="app-bar">
            <div className="left-section">
                {/* Профиль */}
                <span className="icon-user" onClick={() => navigate('/profile')}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                </span>
                {/* Вкладки */}
                <span className="tab" onClick={() => navigate('/')}>{activeTab}</span>
                <span className="tab" onClick={handleFavoritesClick}>Избранное</span>
            </div>

            <div className="center-section">
                <div className="track-and-controls" onClick={handleTrackClick}>
                    <div className="track-info">
                        <div className="track-cover">
                            <div className="cover-placeholder"></div>
                        </div>
                        <div>
                            <h3 className="track-title">{title}</h3>
                            <p className="track-artist">{artist}</p>
                        </div>
                    </div>

                    <div className="controls">
                        <button className={`btn shuffle ${isShuffle ? 'active' : ''}`} onClick={(e) => {
                            e.stopPropagation();
                            toggleShuffle();
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.95 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
                            </svg>
                        </button>
                        <button className={`btn prev`} onClick={(e) => {
                            e.stopPropagation();
                            handlePrev();
                        }}>⏮</button>
                        <button className="btn play-pause" onClick={(e) => {
                            e.stopPropagation();
                            handlePlayPause();
                        }}>{isPlaying ? '⏸' : '▶️'}</button>
                        <button className="btn next" onClick={(e) => {
                            e.stopPropagation();
                            handleNext();
                        }}>⏭</button>
                        <button className={`btn repeat ${isRepeat ? 'active' : ''}`} onClick={(e) => {
                            e.stopPropagation();
                            toggleRepeat();
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
                            </svg>
                        </button>
                    </div>
                    <div className="progress-section">
                        <span className="time">{formatTime(progress)}</span>
                        <input
                            type="range"
                            min="0"
                            max={duration}
                            value={progress}
                            onChange={handleProgressChange}
                            className="progress-slider"
                        />
                        <span className="time">{formatTime(duration)}</span>
                    </div>
                    <div className="extra-controls">
                        <button className={`btn favorite ${isFavorite ? 'active' : ''}`} onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite();
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill={isFavorite ? '#ff2d55' : 'currentColor'}>
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                        </button>
                        <button className="btn playlist" onClick={(e) => {
                            e.stopPropagation();
                            handleAddToPlaylist();
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"
                                 fill="currentColor">
                                <path
                                    d="M14 10H2v2h12v-2zm0-4H2v2h12V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM2 16h8v-2H2v2z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <div className="right-section">
                {/* Настройки */}
                <span className="settings-icon" onClick={() => navigate('/settings')}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                        <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1 0 .33.03.65.07.97l-2.11 1.66c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.31.61.22l2.49-1.02c.52.39 1.06.73 1.69.98l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.25 1.17-.59 1.69-.98l2.49 1.02c.22.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66z"/>
                    </svg>
                </span>
            </div>
        </div>
    );
};

export default AppBar;