import React, { useState, useEffect, useRef } from 'react';
import './TrackPlayerModal.css';

const TrackPlayerModal = ({ isOpen, onClose, track = null, anchorPosition = null, isMobile = false }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(30);
    const [isShuffle, setIsShuffle] = useState(false);
    const [isRepeat, setIsRepeat] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const modalRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => setIsVisible(true), 10);
        } else {
            setIsVisible(false);
        }
    }, [isOpen]);

    useEffect(() => {
        let interval;
        if (isPlaying) {
            interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setIsPlaying(false);
                        return 0;
                    }
                    return prev + 0.5;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    useEffect(() => {
        if (!isMobile && isOpen) {
            const handleClickOutside = (event) => {
                if (modalRef.current && !modalRef.current.contains(event.target)) {
                    onClose();
                }
            };

            setTimeout(() => {
                document.addEventListener('click', handleClickOutside);
            }, 100);

            return () => {
                document.removeEventListener('click', handleClickOutside);
            };
        }
    }, [isMobile, isOpen, onClose]);

    if (!isOpen || !track) return null;

    const formatTime = (percent) => {
        const totalSec = track.duration || 240;
        const currentSec = Math.floor((percent / 100) * totalSec);
        const mins = Math.floor(currentSec / 60);
        const secs = currentSec % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const totalTime = () => {
        const totalSec = track.duration || 240;
        const mins = Math.floor(totalSec / 60);
        const secs = totalSec % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleProgressClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        setProgress(Math.min(100, Math.max(0, pos * 100)));
    };

    const getModalStyle = () => {
        if (isMobile || !anchorPosition) return {};

        return {
            top: anchorPosition.top + anchorPosition.height + 8,
            left: anchorPosition.left + (anchorPosition.width / 2),
            transform: 'translateX(-50%)',
            position: 'fixed',
            width: Math.min(400, anchorPosition.width * 1.5),
            maxWidth: '450px'
        };
    };

    return (
        <>
            {isMobile && (
                <div className="tpm-overlay" onClick={onClose} />
            )}

            <div
                ref={modalRef}
                className={`tpm-container ${isMobile ? 'tpm-container-mobile' : 'tpm-container-desktop'} ${isVisible ? 'tpm-visible' : ''}`}
                style={getModalStyle()}
                onClick={(e) => e.stopPropagation()}
            >
                {isMobile && (
                    <button className="tpm-close-btn" onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#ffffff" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                )}

                <div className="tpm-cover-wrapper">
                    <div className="tpm-cover">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" fill="none" stroke="#f1f1f1" strokeWidth="10">
                            <rect x="40" y="40" width="220" height="220" rx="20" />
                            <path d="M100 100v100 M150 100v100 M200 100v100" />
                        </svg>
                    </div>
                </div>

                <div className="tpm-info-row">
                    <button className="tpm-btn tpm-btn-playlist" title="Добавить в плейлист">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                            <path d="M14 10H2v2h12v-2zm0-4H2v2h12V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM2 16h8v-2H2v2z"/>
                        </svg>
                    </button>

                    <div className="tpm-track-info-centered">
                        <div className="tpm-track-title">{track.title || "Название трека"}</div>
                        <div className="tpm-track-artist">{track.artist || "Исполнитель"}</div>
                    </div>

                    <button
                        className={`tpm-btn tpm-btn-favorite ${isFavorite ? 'active' : ''}`}
                        onClick={() => setIsFavorite(!isFavorite)}
                        title="В избранное"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                            fill={isFavorite ? "#ff2d55" : "none"}
                            stroke="#aaa"
                            strokeWidth="2"
                        >
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                    </button>
                </div>

                <div className="tpm-progress-section">
                    <div className="tpm-time-current">{formatTime(progress)}</div>
                    <div
                        className="tpm-progress-bar-bg"
                        onClick={handleProgressClick}
                    >
                        <div
                            className="tpm-progress-bar-fill"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <div className="tpm-time-total">{totalTime()}</div>
                </div>

                <div className="tpm-controls-row">
                    <button
                        className={`tpm-btn tpm-btn-shuffle ${isShuffle ? 'active' : ''}`}
                        onClick={() => setIsShuffle(!isShuffle)}
                        title="Случайный порядок"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"
                             fill="currentColor">
                            <path
                                d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.95 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
                        </svg>
                    </button>

                    <button className="tpm-btn tpm-btn-prev">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                            <rect x="4" y="4" width="3" height="16" fill="currentColor" />
                            <polygon points="20,4 20,20 8,12" fill="currentColor" />
                        </svg>
                    </button>

                    <button
                        className="tpm-btn tpm-btn-play-pause"
                        onClick={() => setIsPlaying(!isPlaying)}
                        title={isPlaying ? "Пауза" : "Воспроизвести"}
                    >
                        {isPlaying ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36" fill="currentColor">
                                <rect x="8" y="4" width="3" height="16" fill="currentColor" />
                                <rect x="15" y="4" width="3" height="16" fill="currentColor" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36" fill="currentColor">
                                <polygon points="8,4 20,12 8,20" fill="currentColor" />
                            </svg>
                        )}
                    </button>

                    <button className="tpm-btn tpm-btn-next">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                            <rect x="17" y="4" width="3" height="16" fill="currentColor" />
                            <polygon points="4,4 4,20 16,12" fill="currentColor" />
                        </svg>
                    </button>

                    <button
                        className={`tpm-btn tpm-btn-repeat ${isRepeat ? 'active' : ''}`}
                        onClick={() => setIsRepeat(!isRepeat)}
                        title="Повтор"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"
                             fill="currentColor">
                            <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
                        </svg>
                    </button>
                </div>
            </div>
        </>
    );
};

export default TrackPlayerModal;