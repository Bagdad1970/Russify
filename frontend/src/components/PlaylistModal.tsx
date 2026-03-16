import { useState, useRef, useEffect } from 'react';
import '../assets/styles/components/PlaylistModal.css';
import noCoverPlaylist from '../assets/images/no-cover-playlist.svg';
import type { PlaylistWithTracks } from "../types/PlaylistWithTracks.ts";

// 🔥 Пропсы изменились: вместо ID передаем сразу данные
const PlaylistModal = ({ isOpen, onClose, playlistData }: {
    isOpen: boolean;
    onClose: () => void;
    playlistData: PlaylistWithTracks | null
}) => {
    const modalRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isPlaylistFavorite, setIsPlaylistFavorite] = useState(false);
    const [menuTrack, setMenuTrack] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isPositionCalculated, setIsPositionCalculated] = useState(false);

    // Обложку берем сразу из данных, если она там есть (или можно передать URL из родителя)
    const [cover, setCover] = useState<string>("");

    // 🔥 Никаких менеджеров и запросов здесь больше нет!

    useEffect(() => {
        if (!isOpen) {
            setIsPositionCalculated(false);
            return;
        }

        const updateLayout = () => {
            const w = window.innerWidth;
            setIsMobile(w < 768);

            let modalWidth = 640;
            if (w < 1024) modalWidth = Math.min(560, w - 32);
            if (w < 768) modalWidth = w - 24;

            const modalHeight = Math.min(640, window.innerHeight - 112);
            const left = (window.innerWidth - modalWidth) / 2;
            const top = Math.max(56, (window.innerHeight - modalHeight) / 2);

            setPosition({ x: left, y: top });
            setIsPositionCalculated(true);
        };

        updateLayout();
        window.addEventListener('resize', updateLayout);
        return () => window.removeEventListener('resize', updateLayout);
    }, [isOpen]);

    // Если нужны обложки треков через FileManager, это тоже лучше делать в HomePage
    // и передавать уже готовые URL в playlistData.tracks, но если очень нужно здесь:
    // (в данном примере упрощено до статики или данных из пропсов)

    const handleMouseDown = (e) => {
        if (window.innerWidth < 1024) return;
        if (e.target.closest('.pml-header') && !e.target.closest('.pml-close')) {
            setIsDragging(true);
            const rect = modalRef.current.getBoundingClientRect();
            setDragOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
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

    if (!isOpen || !playlistData) return null;

    const togglePlaylistFavorite = () => {
        setIsPlaylistFavorite(!isPlaylistFavorite);
    };

    return (
        <div className="pml-overlay" onClick={() => setMenuTrack(null)} style={{ opacity: isPositionCalculated ? 1 : 0 }}>
            <div
                ref={modalRef}
                className={`pml-container ${isMobile ? 'mobile' : ''}`}
                style={{ left: `${position.x}px`, top: `${position.y}px` }}
                onMouseDown={handleMouseDown}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="pml-header">
                    <div className="pml-playlist-cover-wrapper">
                        {/* Здесь можно использовать cover из playlistData, если передашь */}
                        <img src={noCoverPlaylist} alt="No cover of playlist" />
                    </div>

                    <div className="pml-playlist-info">
                        <div className="pml-title">{playlistData.name}</div>
                        <div className="pml-meta">{playlistData.tracks?.length || 0} треков</div>
                    </div>

                    <div className="pml-playlist-actions">
                        <button className="pml-btn pml-btn-play" title="Воспроизвести" onClick={() => console.log("Play")}>
                            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2"><path d="M8 5v14l11-7z" /></svg>
                        </button>
                        <button className="pml-btn pml-btn-next" title="Следующий" onClick={() => console.log("Next")}>
                            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2"><path d="M8 5v14l11-7z" /><path d="M18 5v14" /></svg>
                        </button>
                        <button className="pml-btn pml-btn-shuffle" title="Шuffle" onClick={() => console.log("Shuffle")}>
                            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2"><path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" /></svg>
                        </button>
                        <button className={`pml-btn pml-btn-heart ${isPlaylistFavorite ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); togglePlaylistFavorite(); }}>
                            <svg viewBox="0 0 24 24" width="20" height="20" fill={isPlaylistFavorite ? "#ff2d55" : "none"} stroke="#aaa" strokeWidth="2"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                        </button>
                    </div>

                    <button className="pml-close" onClick={onClose} aria-label="Закрыть">
                        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>

                <div className="pml-divider"></div>

                <div className="pml-track-list">
                    {playlistData.tracks.map((track, idx) => (
                        <TrackItem
                            key={track.id || idx}
                            index={idx + 1}
                            track={track}
                            isMobile={isMobile}
                            onMoreClick={() => setMenuTrack(track)}
                        />
                    ))}
                </div>

                {isMobile && menuTrack && (
                    <div className="pml-context-menu-overlay" onClick={() => setMenuTrack(null)}>
                        <div className={`pml-context-menu ${menuTrack ? 'active' : ''}`} onClick={(e) => e.stopPropagation()}>
                            <div className="pml-context-item" onClick={() => { console.log("Next:", menuTrack.name); setMenuTrack(null); }}>Играть следующим</div>
                            <div className="pml-context-divider" />
                            <div className="pml-context-item" onClick={() => { console.log("Fav:", menuTrack.name); setMenuTrack(null); }}>В избранное</div>
                            <div className="pml-context-divider" />
                            <div className="pml-context-item" onClick={() => { console.log("Add:", menuTrack.name); setMenuTrack(null); }}>В плейлист</div>
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
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="#f1f1f1" strokeWidth="1.2">
                        <rect x="4" y="4" width="24" height="24" rx="2"/>
                        <path d="M12 12v8"/><path d="M16 12v8"/><path d="M20 12v8"/>
                    </svg>
                </div>
            </div>
            <div className="pml-track-text">
                <div className="pml-track-title">{track.name || "Название трека"}</div>
                <div className="pml-track-artist">{track.genre_name || track.artist || "Исполнитель"}</div>
            </div>
            {!isMobile && (<div className="pml-track-album">{track.album || "Альбом"}</div>)}
            <div className="pml-track-duration">
                {track.duration ? `${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, '0')}` : "01:00"}
            </div>
            <div className="pml-track-actions">
                {isMobile ? (
                    <>
                        <button className="pml-btn pml-btn-play"><svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2"><path d="M8 5v14l11-7z"/></svg></button>
                        <button className="pml-btn pml-btn-more" onClick={(e) => { e.stopPropagation(); onMoreClick(); }}><svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg></button>
                    </>
                ) : (
                    <>
                        <button className="pml-btn pml-btn-play"><svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2"><path d="M8 5v14l11-7z"/></svg></button>
                        <button className="pml-btn pml-btn-next"><svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2"><path d="M8 5v14l11-7z"/><path d="M18 5v14"/></svg></button>
                        <button className={`pml-btn pml-btn-heart ${isFavorite ? 'active' : ''}`} onClick={() => setIsFavorite(!isFavorite)}>
                            <svg viewBox="0 0 24 24" width="18" height="18" fill={isFavorite ? "#ff2d55" : "none"} stroke="#aaa" strokeWidth="2"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                        </button>
                        <button className="pml-btn pml-btn-more" onClick={(e) => { e.stopPropagation(); onMoreClick(); }}><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M14 10H2v2h12v-2zm0-4H2v2h12V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM2 16h8v-2H2v2z"/></svg></button>
                    </>
                )}
            </div>
        </div>
    );
};

export default PlaylistModal;