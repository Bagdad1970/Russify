import { useState, useRef, useEffect } from 'react';
import '../assets/styles/components/SystemPlaylistModal.css';

const SystemPlaylistModal = ({ isOpen, onClose, playlistName = "Название плейлиста", tracks = [] }) => {
    const modalRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const [menuTrack, setMenuTrack] = useState(null);

    useEffect(() => {
        if (!isOpen) return;

        const updateLayout = () => {
            const w = window.innerWidth;
            setIsMobile(w < 768);

            let modalWidth = 640;
            if (w < 1024) modalWidth = Math.min(560, w - 32);
            if (w < 768) modalWidth = w - 24;

            const modalHeight = Math.min(720, window.innerHeight - 80);
            const left = (window.innerWidth - modalWidth) / 2;
            const top = Math.max(56, (window.innerHeight - modalHeight) / 2);

            setPosition({ x: left, y: top });
        };

        updateLayout();
        window.addEventListener('resize', updateLayout);
        return () => window.removeEventListener('resize', updateLayout);
    }, [isOpen]);

    const handleMouseDown = (e) => {
        if (window.innerWidth < 1024) return;
        if (e.target.closest('.pml-header') && !e.target.closest('.pml-close')) {
            setIsDragging(true);
            const rect = modalRef.current.getBoundingClientRect();
            setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }
    };

    const handleMouseMove = (e) => {
        if (!isDragging || window.innerWidth < 1024) return;

        let newX = e.clientX - dragOffset.x;
        let newY = e.clientY - dragOffset.y;

        const r = modalRef.current.getBoundingClientRect();
        newX = Math.max(0, Math.min(newX, window.innerWidth - r.width));
        newY = Math.max(56, Math.min(newY, window.innerHeight - r.height));

        setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => setIsDragging(false);

    useEffect(() => {
        if (isDragging && window.innerWidth >= 1024) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging]);

    if (!isOpen) return null;

    const totalSec = tracks.reduce((sum, t) => sum + (t.duration || 60), 0);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    const durationStr = `${min} мин ${sec} сек`;

    return (
        <div className="pml-overlay" onClick={() => setMenuTrack(null)}>
            <div
                ref={modalRef}
                className={`pml-container ${isMobile ? 'mobile' : ''}`}
                style={{ left: `${position.x}px`, top: `${position.y}px` }}
                onMouseDown={handleMouseDown}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="pml-header">
                    <button className="pml-close" onClick={onClose} aria-label="Закрыть">
                        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>

                    <div className="pml-playlist-cover-wrapper">
                        <div className="pml-playlist-cover">
                            <svg viewBox="0 0 156 156" width="156" height="156" fill="none" stroke="#f1f1f1" strokeWidth="5">
                                <rect x="28" y="28" width="100" height="100" rx="10" />
                                <path d="M52 52v64 M78 52v64 M104 52v64" />
                            </svg>
                        </div>
                    </div>

                    <div className="pml-playlist-info">
                        <div className="pml-title">{playlistName}</div>
                        <div className="pml-meta">{tracks.length} аудиозаписей</div>
                        <div className="pml-meta">{durationStr}</div>
                    </div>

                    <div className="pml-playlist-actions-inline">
                        <button className="pml-btn pml-btn-play" title="Воспроизвести плейлист">
                            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </button>
                        <button className="pml-btn pml-btn-next" title="Играть следующим">
                            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2">
                                <path d="M8 5v14l11-7z" />
                                <path d="M18 5v14" />
                            </svg>
                        </button>
                        <button className="pml-btn pml-btn-shuffle" title="Случайный порядок">
                            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2">
                                <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="pml-divider" />

                <div className="pml-track-list">
                    {tracks.map((track, idx) => (
                        <TrackItem
                            key={idx}
                            index={idx + 1}
                            track={track}
                            isMobile={isMobile}
                            onMoreClick={() => setMenuTrack(track)}
                        />
                    ))}
                </div>

                {/* Мобильное контекстное меню */}
                {isMobile && menuTrack && (
                    <div
                        className="pml-context-menu-overlay"
                        onClick={() => setMenuTrack(null)}
                    >
                        <div
                            className={`pml-context-menu ${menuTrack ? 'active' : ''}`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div
                                className="pml-context-item"
                                onClick={() => {
                                    console.log("Играть следующим:", menuTrack.title);
                                    setMenuTrack(null);
                                }}
                            >
                                Играть следующим
                            </div>

                            <div className="pml-context-divider" />

                            <div
                                className="pml-context-item"
                                onClick={() => {
                                    console.log("Добавить в избранное:", menuTrack.title);
                                    setMenuTrack(null);
                                }}
                            >
                                Добавить в избранное
                            </div>

                            <div className="pml-context-divider" />

                            <div
                                className="pml-context-item"
                                onClick={() => {
                                    console.log("Добавить в плейлист:", menuTrack.title);
                                    setMenuTrack(null);
                                }}
                            >
                                Добавить в плейлист
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const TrackItem = ({ index, track, isMobile, onMoreClick }) => {
    const [isFavorite, setIsFavorite] = useState(false);

    return (
        <div className={`pml-track-item ${isMobile ? 'mobile' : ''}`}>
            <div className="pml-track-index">{index}.</div>

            <div className="pml-track-cover-wrapper">
                <div className="pml-track-cover">
                    <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="#f1f1f1" strokeWidth="1.2">
                        <rect x="4" y="4" width="24" height="24" rx="2"/>
                        <path d="M12 12v8"/>
                        <path d="M16 12v8"/>
                        <path d="M20 12v8"/>
                    </svg>
                </div>
            </div>

            <div className="pml-track-text">
                <div className="pml-track-title">{track.title || "Название трека"}</div>
                <div className="pml-track-artist">{track.artist || "Исполнитель"}</div>
            </div>

            {!isMobile && (
                <div className="pml-track-album">{track.album || "Альбом"}</div>
            )}

            <div className="pml-track-duration">
                {track.duration
                    ? `${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, '0')}`
                    : "0:00"}
            </div>

            <div className="pml-track-actions">
                {isMobile ? (
                    <>
                        <button className="pml-btn pml-btn-play">
                            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                        </button>
                        <button
                            className="pml-btn pml-btn-more"
                            onClick={(e) => {
                                e.stopPropagation();
                                onMoreClick();
                            }}
                        >
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                                <circle cx="12" cy="5" r="2"/>
                                <circle cx="12" cy="12" r="2"/>
                                <circle cx="12" cy="19" r="2"/>
                            </svg>
                        </button>
                    </>
                ) : (
                    <>
                        <button className="pml-btn pml-btn-play">
                            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                        </button>
                        <button className="pml-btn pml-btn-next">
                            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2">
                                <path d="M8 5v14l11-7z"/>
                                <path d="M18 5v14" />
                            </svg>
                        </button>

                        <button
                            className={`pml-btn pml-btn-heart ${isFavorite ? 'active' : ''}`}
                            onClick={() => setIsFavorite(!isFavorite)}
                        >
                            <svg
                                viewBox="0 0 24 24"
                                width="18"
                                height="18"
                                fill={isFavorite ? "#ff2d55" : "none"}
                                stroke="#aaa"
                                strokeWidth="2"
                            >
                                <path
                                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                        </button>
                        <button className="pml-btn pml-btn-playlist">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                <path d="M14 10H2v2h12v-2zm0-4H2v2h12V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM2 16h8v-2H2v2z"/>
                            </svg>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default SystemPlaylistModal;