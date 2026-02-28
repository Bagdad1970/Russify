import React, { useState, useRef, useEffect } from 'react';
import './CreatePlaylistModal.css';

const CreatePlaylistModal = ({ isOpen, onClose }) => {
    const modalRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [playlistCover, setPlaylistCover] = useState(null);
    const [playlistName, setPlaylistName] = useState("Новый плейлист");
    const [playlistTracks, setPlaylistTracks] = useState([]);
    const [availableTracks, setAvailableTracks] = useState([
        { id: 1, title: "Трек 1", artist: "Исполнитель A", duration: 180 },
        { id: 2, title: "Трек 2", artist: "Исполнитель B", duration: 210 },
        { id: 3, title: "Трек 3", artist: "Исполнитель C", duration: 150 },
        { id: 4, title: "Трек 4", artist: "Исполнитель D", duration: 200 },
        { id: 5, title: "Трек 5", artist: "Исполнитель E", duration: 170 },
        { id: 6, title: "Трек 6", artist: "Исполнитель F", duration: 190 },
        { id: 7, title: "Трек 7", artist: "Исполнитель G", duration: 220 },
        { id: 8, title: "Трек 8", artist: "Исполнитель H", duration: 160 },
        { id: 9, title: "Трек 9", artist: "Исполнитель I", duration: 200 },
        { id: 10, title: "Трек 10", artist: "Исполнитель J", duration: 180 },
    ]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    useEffect(() => {
        if (isOpen) {
            const appBarHeight = 56;
            const modalWidth = 800;
            const modalHeight = Math.min(640, window.innerHeight - appBarHeight - 60);
            const left = (window.innerWidth - modalWidth) / 2;
            const top = appBarHeight + (window.innerHeight - appBarHeight - modalHeight) / 2;
            setPosition({ x: left, y: top });
        }
    }, [isOpen]);

    const handleMouseDown = (e) => {
        if (e.target.closest('.cpl-header') && !e.target.closest('.cpl-close')) {
            setIsDragging(true);
            const rect = modalRef.current.getBoundingClientRect();
            setDragOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
        }
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;

        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;

        const modalRect = modalRef.current.getBoundingClientRect();
        const w = modalRect.width;
        const h = modalRect.height;

        const clampedX = Math.max(0, Math.min(newX, window.innerWidth - w));
        const clampedY = Math.max(56, Math.min(newY, window.innerHeight - h));

        setPosition({ x: clampedX, y: clampedY });
    };

    const handleMouseUp = () => setIsDragging(false);

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, dragOffset]);

    if (!isOpen) return null;

    const playlistCount = playlistTracks.length;
    const totalDuration = playlistTracks.reduce((sum, t) => sum + t.duration, 0);
    const durationFormatted = formatTime(totalDuration);

    const handleCoverClick = () => {
        document.getElementById('cover-upload').click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPlaylistCover(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const addTrackToPlaylist = (trackId) => {
        const trackToAdd = availableTracks.find(t => t.id === trackId);
        if (trackToAdd) {
            setPlaylistTracks(prev => [...prev, trackToAdd]);
            setAvailableTracks(prev => prev.filter(t => t.id !== trackId));
        }
    };

    const removeTrackFromPlaylist = (trackId) => {
        const trackToRemove = playlistTracks.find(t => t.id === trackId);
        if (trackToRemove) {
            setAvailableTracks(prev => [...prev, trackToRemove]);
            setPlaylistTracks(prev => prev.filter(t => t.id !== trackId));
        }
    };

    const handleSave = () => {
        console.log("Плейлист сохранён:", { name: playlistName, tracks: playlistTracks, cover: playlistCover });
        onClose();
    };

    const handleCancel = () => {
        onClose();
    };

    return (
        <div className="cpl-overlay">
            <div
                ref={modalRef}
                className="cpl-container"
                style={{ left: `${position.x}px`, top: `${position.y}px` }}
                onMouseDown={handleMouseDown}
            >
                {/* Шапка */}
                <div className="cpl-header">
                    <div className="cpl-playlist-cover" onClick={handleCoverClick}>
                        {playlistCover ? (
                            <img src={playlistCover} alt="Обложка плейлиста" style={{ width: '156px', height: '156px', borderRadius: '12px' }} />
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 156 156" width="156" height="156" fill="none" stroke="#f1f1f1" strokeWidth="5">
                                <rect x="28" y="28" width="100" height="100" rx="10" />
                                <path d="M52 52v64" />
                                <path d="M78 52v64" />
                                <path d="M104 52v64" />
                            </svg>
                        )}
                    </div>

                    {/* Информация */}
                    <div className="cpl-playlist-info">
                        <div className="cpl-title" onClick={() => {
                            const newName = prompt("Введите новое название:", playlistName);
                            if (newName !== null) {
                                setPlaylistName(newName);
                            }
                        }}>
                            {playlistName}
                        </div>
                        <div className="cpl-meta">
                            <div className="cpl-count">{playlistCount} треков</div>
                            <div className="cpl-duration">{durationFormatted}</div>
                        </div>
                    </div>

                    {/* Кнопка закрытия */}
                    <button className="cpl-close" onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }} aria-label="Закрыть">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#ffffff" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="cpl-divider"></div>

                <div className="cpl-main-content">
                    <div className="cpl-column cpl-playlist-column">
                        <h3 className="cpl-column-title">Плейлист</h3>
                        <div className="cpl-track-list">
                            {playlistTracks.map((track) => (
                                <div key={track.id} className="cpl-track-item">
                                    <div className="cpl-track-cover">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="#f1f1f1" strokeWidth="1.2">
                                            <rect x="4" y="4" width="24" height="24" rx="2" />
                                            <path d="M12 12v8" />
                                            <path d="M16 12v8" />
                                            <path d="M20 12v8" />
                                        </svg>
                                    </div>
                                    <div className="cpl-track-text">
                                        <div className="cpl-track-title">{track.title}</div>
                                        <div className="cpl-track-artist">{track.artist}</div>
                                    </div>
                                    <div className="cpl-track-duration">{formatTime(track.duration)}</div>
                                    <button className="cpl-remove-btn" onClick={() => removeTrackFromPlaylist(track.id)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#aaa" strokeWidth="2">
                                            <line x1="18" y1="6" x2="6" y2="18" />
                                            <line x1="6" y1="6" x2="18" y2="18" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="cpl-column cpl-favorites-column">
                        <h3 className="cpl-column-title">Избранное</h3>
                        <div className="cpl-track-list">
                            {availableTracks.map((track) => (
                                <div key={track.id} className="cpl-track-item">
                                    <div className="cpl-track-cover">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="#f1f1f1" strokeWidth="1.2">
                                            <rect x="4" y="4" width="24" height="24" rx="2" />
                                            <path d="M12 12v8" />
                                            <path d="M16 12v8" />
                                            <path d="M20 12v8" />
                                        </svg>
                                    </div>
                                    <div className="cpl-track-text">
                                        <div className="cpl-track-title">{track.title}</div>
                                        <div className="cpl-track-artist">{track.artist}</div>
                                    </div>
                                    <div className="cpl-track-duration">{formatTime(track.duration)}</div>
                                    <button className="cpl-add-btn" onClick={() => addTrackToPlaylist(track.id)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#aaa" strokeWidth="2">
                                            <path d="M12 5v14M5 12h14" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="cpl-buttons">
                    <button className="cpl-btn-cancel" onClick={handleCancel}>Отменить</button>
                    <button className="cpl-btn-save" onClick={handleSave}>Сохранить</button>
                </div>
            </div>
            <input type="file" id="cover-upload" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
        </div>
    );
};

export default CreatePlaylistModal;