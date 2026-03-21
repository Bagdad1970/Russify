import { useState, useRef, useEffect } from 'react';
import '../assets/styles/components/PlaylistModal.css';
import noCover from '../assets/images/no-cover.svg';
import type { Track } from '../types/Track.ts';
import type { Playlist } from '../types/Playlist.ts';
import { FileManager } from '../api/FileManager';
import { PlaylistManager } from '../api/PlaylistManager';
import { TrackManager } from '../api/TrackManager';
import { useFavorites } from '../hooks/useFavorites';

interface PlaylistModalProps {
    isOpen: boolean;
    onClose: () => void;
    playlistName: string;
    tracks: Track[];
    playlistId?: number | bigint;
    playlist?: Playlist;
    coverHash?: string | null;
    authorName?: string;
    defaultIsSystem?: boolean;
}

const PlaylistModal = ({
                           isOpen,
                           onClose,
                           playlistName,
                           tracks: initialTracks = [],
                           playlistId,
                           playlist,
                           coverHash
                       }: PlaylistModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isPositionCalculated, setIsPositionCalculated] = useState(false);
    const [menuTrack, setMenuTrack] = useState<Track | null>(null);
    const [coverSrc, setCoverSrc] = useState<string>("");

    const [currentTracks, setCurrentTracks] = useState<Track[]>([]);
    const [isAddMode, setIsAddMode] = useState(false);
    const [availableTracks, setAvailableTracks] = useState<Track[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fileManager = new FileManager();
    const playlistManager = new PlaylistManager();
    const trackManager = new TrackManager();

    const {
        favoriteTrackIds,
        favoritePlaylistIds,
        addFavoriteTrack,
        removeFavoriteTrack,
        addFavoritePlaylist,
        removeFavoritePlaylist
    } = useFavorites();

    const actualPlaylistId = playlistId || playlist?.id;
    const isPlaylistFavorite = actualPlaylistId ? favoritePlaylistIds.has(Number(actualPlaylistId)) : false;

    useEffect(() => {
        if (isOpen) {
            setCurrentTracks(initialTracks);
            setIsAddMode(false);
            loadCover();
        }
    }, [isOpen, initialTracks]);

    const loadCover = async () => {
        if (!coverHash) {
            setCoverSrc("");
            return;
        }
        try {
            const src = await fileManager.getFileUrl("images", coverHash);
            if (src) setCoverSrc(src);
        } catch (err) {
            console.error('Error loading cover:', err);
            setCoverSrc("");
        }
    };

    useEffect(() => {
        if (isOpen && isAddMode) {
            loadAvailableTracks();
        }
    }, [isAddMode, isOpen, currentTracks]);

    const loadAvailableTracks = async () => {
        try {
            const allTracks = await trackManager.findAll();
            const currentIds = new Set(currentTracks.map(t => t.id));
            setAvailableTracks(allTracks.filter(t => !currentIds.has(t.id)));
        } catch (error) {
            console.error('Error loading available tracks:', error);
        }
    };

    useEffect(() => {
        if (!isOpen) { setIsPositionCalculated(false); return; }
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
        if (e.target instanceof Element && e.target.closest('.pml-header') && !e.target.closest('.pml-close')) {
            setIsDragging(true);
            const rect = modalRef.current?.getBoundingClientRect();
            if (rect) setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
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

    const handleAddTrack = async (track: Track) => {
        if (!actualPlaylistId) return;
        setIsLoading(true);
        try {
            await playlistManager.addTrackToPlaylist(actualPlaylistId, Number(track.id));
            setCurrentTracks(prev => [...prev, track]);
            setAvailableTracks(prev => prev.filter(t => t.id !== track.id));
        } catch (err) {
            console.error('Error adding track:', err);
            alert('Не удалось добавить трек');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveTrack = async (track: Track) => {
        if (!actualPlaylistId) return;
        if (!window.confirm(`Удалить трек "${track.name}" из плейлиста?`)) return;

        setIsLoading(true);
        try {
            await playlistManager.removeTrackFromPlaylist(actualPlaylistId, Number(track.id));
            setCurrentTracks(prev => prev.filter(t => t.id !== track.id));
        } catch (err) {
            console.error('Error removing track:', err);
            alert('Не удалось удалить трек');
        } finally {
            setIsLoading(false);
        }
    };

    const togglePlaylistFavorite = () => {
        if (!actualPlaylistId) return;
        const id = Number(actualPlaylistId);
        isPlaylistFavorite ? removeFavoritePlaylist(id) : addFavoritePlaylist(id);
    };

    const formatDuration = (seconds?: number) => {
        if (!seconds) return "0:00";
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    if (!isOpen) return null;

    return (
        <div className="pml-overlay" onClick={() => { setMenuTrack(null); if(isAddMode) setIsAddMode(false); }} style={{ opacity: isPositionCalculated ? 1 : 0 }}>
            <div
                ref={modalRef}
                className={`pml-container ${isMobile ? 'mobile' : ''}`}
                style={{ left: `${position.x}px`, top: `${position.y}px` }}
                onMouseDown={handleMouseDown}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="pml-header">
                    <div className="pml-playlist-cover-wrapper">
                        <img
                            src={coverSrc || noCover}
                            alt="Cover"
                            style={{ width: '156px', height: '156px', objectFit: 'cover' }}
                            onError={(e) => {
                                e.currentTarget.src = noCover;
                            }}
                        />
                    </div>
                    <div className="pml-playlist-info">
                        <div className="pml-title">{playlistName}</div>
                        <div className="pml-meta">{currentTracks.length} треков</div>
                    </div>

                    {!isAddMode ? (
                        <div className="pml-playlist-actions">
                            <button className="pml-btn pml-btn-add" onClick={() => setIsAddMode(true)} title="Добавить трек" disabled={isLoading}>
                                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                            </button>
                            <button className="pml-btn pml-btn-play" onClick={() => console.log("Play")}>
                                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2"><path d="M8 5v14l11-7z" /></svg>
                            </button>
                            <button className={`pml-btn pml-btn-heart ${isPlaylistFavorite ? 'active' : ''}`} onClick={togglePlaylistFavorite}>
                                <svg viewBox="0 0 24 24" width="20" height="20" fill={isPlaylistFavorite ? "#ff2d55" : "none"} stroke="#aaa" strokeWidth="2"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                            </button>
                            <button className="pml-close" onClick={onClose}><svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></button>
                        </div>
                    ) : (
                        <div className="pml-playlist-actions">
                            <span style={{color: '#fff', marginRight: '10px'}}>Выберите трек</span>
                            <button className="pml-btn pml-btn-cancel" onClick={() => setIsAddMode(false)} title="Закрыть">
                                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            </button>
                        </div>
                    )}
                </div>

                <div className="pml-divider"></div>

                {!isAddMode ? (
                    <div className="pml-track-list">
                        {currentTracks.length > 0 ? (
                            currentTracks.map((track, idx) => (
                                <div key={String(track.id)} className={`pml-track-item ${isMobile ? 'mobile' : ''}`}>
                                    <div className="pml-track-index">{idx + 1}.</div>
                                    <div className="pml-track-cover-wrapper">
                                        <div className="pml-track-cover">
                                            <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="#f1f1f1" strokeWidth="1.2">
                                                <rect x="4" y="4" width="24" height="24" rx="2"/>
                                                <path d="M12 12v8"/><path d="M16 12v8"/><path d="M20 12v8"/>
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="pml-track-text">
                                        <div className="pml-track-title">{track.name}</div>
                                        <div className="pml-track-artist">{track.artist}</div>
                                    </div>
                                    {!isMobile && <div className="pml-track-album">{track.album}</div>}
                                    <div className="pml-track-duration">{formatDuration(track.duration)}</div>
                                    <div className="pml-track-actions">
                                        <button className="pml-btn pml-btn-remove" onClick={() => handleRemoveTrack(track)} title="Удалить из плейлиста" disabled={isLoading}>
                                            <svg viewBox="0 0 24 24" width="18" height="18" stroke="#ff4444" strokeWidth="2">
                                                <polyline points="3 6 5 6 21 6"/>
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="pml-empty-state">В этом плейлисте пока нет треков. Нажмите +, чтобы добавить.</div>
                        )}
                    </div>
                ) : (

                    <div className="pml-track-list" style={{ maxHeight: '500px' }}>
                        {availableTracks.length > 0 ? (
                            availableTracks.map(track => (
                                <div key={String(track.id)} className="pml-track-item">
                                    <div className="pml-track-cover-wrapper">
                                        <div className="pml-track-cover">
                                            <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="#f1f1f1" strokeWidth="1.2">
                                                <rect x="4" y="4" width="24" height="24" rx="2"/>
                                                <path d="M12 12v8"/><path d="M16 12v8"/><path d="M20 12v8"/>
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="pml-track-text">
                                        <div className="pml-track-title">{track.name}</div>
                                        <div className="pml-track-artist">{track.artist}</div>
                                    </div>
                                    <div className="pml-track-actions">
                                        <button className="pml-btn pml-btn-add-track" onClick={() => handleAddTrack(track)} disabled={isLoading}>
                                            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2">
                                                <line x1="12" y1="5" x2="12" y2="19"/>
                                                <line x1="5" y1="12" x2="19" y2="12"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="pml-empty-state">Нет доступных треков для добавления</div>
                        )}
                    </div>
                )}

                {isMobile && !isAddMode && menuTrack && (
                    <div className="pml-context-menu-overlay" onClick={() => setMenuTrack(null)}>
                        <div className={`pml-context-menu ${menuTrack ? 'active' : ''}`} onClick={(e) => e.stopPropagation()}>
                            <div className="pml-context-item" onClick={() => { console.log("Next:", menuTrack.name); setMenuTrack(null); }}>Играть следующим</div>
                            <div className="pml-context-divider" />
                            <div className="pml-context-item" onClick={() => {
                                if (menuTrack.id) {
                                    const tid = Number(menuTrack.id);
                                    favoriteTrackIds.has(tid) ? removeFavoriteTrack(tid) : addFavoriteTrack(tid);
                                }
                                setMenuTrack(null);
                            }}>{menuTrack.id && favoriteTrackIds.has(Number(menuTrack.id)) ? "Удалить из избранного" : "Добавить в избранное"}</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlaylistModal;
