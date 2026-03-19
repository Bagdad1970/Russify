import { useState, useRef, useEffect } from 'react';
import '../assets/styles/components/AlbumModal.css';
import type { Track } from '../types/Track.ts';
import type { Album } from '../types/Album.ts';
import { useFavorites } from '../hooks/useFavorites';

interface AlbumModalProps {
    isOpen: boolean;
    onClose: () => void;
    albumName: string;
    authorName?: string;
    tracks: Track[];
    albumAuthors?: Array<{ id: number; name: string }>;
    albumId?: number | bigint;
    album?: Album;
}

const AlbumModal = ({
                        isOpen,
                        onClose,
                        albumName,
                        authorName = "Исполнитель",
                        tracks = [],
                        albumAuthors = [],
                        albumId,
                        album
                    }: AlbumModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isPositionCalculated, setIsPositionCalculated] = useState(false);
    const [menuTrack, setMenuTrack] = useState<Track | null>(null);

    const { favoriteTrackIds, favoriteAlbumIds, addFavoriteTrack, removeFavoriteTrack, addFavoriteAlbum, removeFavoriteAlbum } = useFavorites();
    const actualAlbumId = albumId || album?.id;

    // Проверяем, в избранном ли альбом
    const isAlbumFavorite = actualAlbumId ? favoriteAlbumIds.has(Number(actualAlbumId)) : false;

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

    const handleMouseDown = (e: React.MouseEvent) => {
        if (window.innerWidth < 1024) return;
        if (e.target instanceof Element && e.target.closest('.alm-header') && !e.target.closest('.alm-close')) {
            setIsDragging(true);
            const rect = modalRef.current?.getBoundingClientRect();
            if (rect) {
                setDragOffset({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top,
                });
            }
        }
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging || window.innerWidth < 1024 || !modalRef.current) return;

        let newX = e.clientX - dragOffset.x;
        let newY = e.clientY - dragOffset.y;

        const rect = modalRef.current.getBoundingClientRect();
        newX = Math.max(0, Math.min(newX, window.innerWidth - rect.width));
        newY = Math.max(56, Math.min(newY, window.innerHeight - rect.height));

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

    const toggleAlbumFavorite = () => {
        if (!actualAlbumId) {
            console.warn('Нет actualAlbumId');
            return;
        }

        const id = Number(actualAlbumId);
        if (isAlbumFavorite) {
            removeFavoriteAlbum(id);
        } else {
            addFavoriteAlbum(id);
        }
    };

    if (!isOpen) return null;

    // Подсчёт длительности
    const totalSec = tracks.reduce((sum, t) => sum + (t.duration || 0), 0);
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;

    let durationStr = '';
    if (hours > 0) {
        durationStr = `${hours} ч ${minutes} мин`;
    } else if (minutes > 0) {
        durationStr = `${minutes} мин ${seconds} сек`;
    } else {
        durationStr = `${seconds} сек`;
    }

    const albumAuthorName = albumAuthors.length > 0 ? albumAuthors[0].name : authorName;

    return (
        <div className="alm-overlay" onClick={() => setMenuTrack(null)} style={{ opacity: isPositionCalculated ? 1 : 0 }}>
            <div
                ref={modalRef}
                className={`alm-container ${isMobile ? 'mobile' : ''}`}
                style={{ left: `${position.x}px`, top: `${position.y}px` }}
                onMouseDown={handleMouseDown}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Шапка */}
                <div className="alm-header">
                    {/* Обложка */}
                    <div className="alm-album-cover-wrapper">
                        <div className="alm-album-cover">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 156 156" width="156" height="156"
                                 fill="none" stroke="#f1f1f1" strokeWidth="5">
                                <rect x="28" y="28" width="100" height="100" rx="10"/>
                                <path d="M52 52v64 M78 52v64 M104 52v64"/>
                            </svg>
                        </div>
                    </div>

                    {/* Информация */}
                    <div className="alm-album-info">
                        <div className="alm-title">{albumName}</div>
                        <div className="alm-author">{albumAuthorName}</div>
                        <div className="alm-meta">{tracks.length} аудиозаписей</div>
                        <div className="alm-meta">{durationStr}</div>
                    </div>

                    <div className="alm-album-actions">
                        <button
                            className="alm-btn alm-btn-play"
                            title="Воспроизвести альбом"
                            onClick={() => console.log("Воспроизвести альбом:", albumName)}
                        >
                            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </button>
                        <button
                            className="alm-btn alm-btn-next"
                            title="Играть следующим"
                            onClick={() => console.log("Играть следующим:", albumName)}
                        >
                            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2">
                                <path d="M2 6h20M2 12h12M2 18h8" />
                                <path d="M18 15l3 3-3 3M21 18h-6" />
                            </svg>
                        </button>
                        <button
                            className="alm-btn alm-btn-shuffle"
                            title="Случайный порядок"
                            onClick={() => console.log("Случайный порядок:", albumName)}
                        >
                            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2">
                                <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
                            </svg>
                        </button>
                        <button
                            className={`alm-btn alm-btn-heart ${isAlbumFavorite ? 'active' : ''}`}
                            onClick={toggleAlbumFavorite}
                            title={isAlbumFavorite ? "Удалить из избранного" : "Добавить в избранное"}
                        >
                            <svg viewBox="0 0 24 24" width="20" height="20" fill={isAlbumFavorite ? "#ff2d55" : "none"} stroke="#aaa" strokeWidth="2">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                        </button>
                    </div>

                    <button className="alm-close" onClick={onClose} aria-label="Закрыть">
                        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="alm-divider"></div>

                {/* Список треков */}
                <div className="alm-track-list">
                    {tracks.length > 0 ? (
                        tracks.map((track, idx) => (
                            <TrackItem
                                key={track.id ? Number(track.id) : idx}
                                index={idx + 1}
                                track={track}
                                authorName={albumAuthorName}
                                isMobile={isMobile}
                                isFavorite={favoriteTrackIds.has(Number(track.id))}
                                onAddFavorite={() => addFavoriteTrack(Number(track.id))}
                                onRemoveFavorite={() => removeFavoriteTrack(Number(track.id))}
                                onMoreClick={() => setMenuTrack(track)}
                            />
                        ))
                    ) : (
                        <div className="alm-empty-state">
                            В этом альбоме пока нет треков
                        </div>
                    )}
                </div>

                {/* Мобильное контекстное меню */}
                {isMobile && menuTrack && (
                    <div
                        className="alm-context-menu-overlay"
                        onClick={() => setMenuTrack(null)}
                    >
                        <div
                            className={`alm-context-menu ${menuTrack ? 'active' : ''}`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div
                                className="alm-context-item"
                                onClick={() => {
                                    console.log("Играть следующим:", menuTrack.name);
                                    setMenuTrack(null);
                                }}
                            >
                                Играть следующим
                            </div>

                            <div className="alm-context-divider" />

                            <div
                                className="alm-context-item"
                                onClick={() => {
                                    if (menuTrack.id) {
                                        const trackId = Number(menuTrack.id);
                                        if (favoriteTrackIds.has(trackId)) {
                                            removeFavoriteTrack(trackId);
                                        } else {
                                            addFavoriteTrack(trackId);
                                        }
                                    }
                                    setMenuTrack(null);
                                }}
                            >
                                {menuTrack.id && favoriteTrackIds.has(Number(menuTrack.id))
                                    ? "Удалить из избранного"
                                    : "Добавить в избранное"}
                            </div>

                            <div className="alm-context-divider" />

                            <div
                                className="alm-context-item"
                                onClick={() => {
                                    console.log("Добавить в плейлист:", menuTrack.name);
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

interface TrackItemProps {
    index: number;
    track: Track;
    authorName: string;
    isMobile: boolean;
    isFavorite: boolean;
    onAddFavorite: () => void;
    onRemoveFavorite: () => void;
    onMoreClick: () => void;
}

const TrackItem = ({
                       index,
                       track,
                       authorName,
                       isMobile,
                       isFavorite,
                       onAddFavorite,
                       onRemoveFavorite,
                       onMoreClick
                   }: TrackItemProps) => {

    const handleFavoriteClick = () => {
        if (isFavorite) {
            onRemoveFavorite();
        } else {
            onAddFavorite();
        }
    };

    const formatDuration = (seconds?: number) => {
        if (!seconds) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className={`alm-track-item ${isMobile ? 'mobile' : ''}`}>
            {/* Номер */}
            <div className="alm-track-index">{index}.</div>

            {/* Обложка */}
            <div className="alm-track-cover-wrapper">
                <div className="alm-track-cover">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="#f1f1f1" strokeWidth="1.2">
                        <rect x="4" y="4" width="24" height="24" rx="2"/>
                        <path d="M12 12v8"/>
                        <path d="M16 12v8"/>
                        <path d="M20 12v8"/>
                    </svg>
                </div>
            </div>

            <div className="alm-track-text">
                <div className="alm-track-title">{track.name || "Название трека"}</div>
                <div className="alm-track-artist">{authorName || "Исполнитель"}</div>
            </div>

            {/* Длительность */}
            <div className="alm-track-duration">
                {formatDuration(track.duration)}
            </div>

            {/* Действия */}
            <div className="alm-track-actions">
                {isMobile ? (
                    <>
                        <button className="alm-btn alm-btn-play">
                            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                        </button>
                        <button
                            className="alm-btn alm-btn-more"
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
                        <button className="alm-btn alm-btn-play">
                            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                        </button>

                        <button className="alm-btn alm-btn-next">
                            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2">
                                <path d="M2 6h20M2 12h12M2 18h8" />
                                <path d="M18 15l3 3-3 3M21 18h-6" />
                            </svg>
                        </button>

                        <button
                            className={`alm-btn alm-btn-heart ${isFavorite ? 'active' : ''}`}
                            onClick={handleFavoriteClick}
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
                                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                                />
                            </svg>
                        </button>
                        <button
                            className="alm-btn alm-btn-more"
                            onClick={(e) => {
                                e.stopPropagation();
                                onMoreClick();
                            }}
                        >
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                <path
                                    d="M14 10H2v2h12v-2zm0-4H2v2h12V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM2 16h8v-2H2v2z"
                                />
                            </svg>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default AlbumModal;