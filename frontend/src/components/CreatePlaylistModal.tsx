import { useState, useRef, useEffect } from 'react';
import '../assets/styles/components/CreatePlaylistModal.css';
import { PlaylistManager } from '../api/PlaylistManager';
import { TrackManager } from '../api/TrackManager';
import { FileManager } from '../api/FileManager';
import type { Track } from '../types/Track';
import noCover from '../assets/images/no-cover.svg';

interface CreatePlaylistModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const CreatePlaylistModal = ({ isOpen, onClose, onSuccess }: CreatePlaylistModalProps) => {
    const modalRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    // Состояния данных
    const [playlistCoverFile, setPlaylistCoverFile] = useState<File | null>(null);
    const [playlistCoverPreview, setPlaylistCoverPreview] = useState<string | null>(null);
    const [playlistName, setPlaylistName] = useState("Новый плейлист");
    const [playlistTracks, setPlaylistTracks] = useState<Track[]>([]);
    const [availableTracks, setAvailableTracks] = useState<Track[]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [isPositionCalculated, setIsPositionCalculated] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);

    const playlistManager = new PlaylistManager();
    const trackManager = new TrackManager();
    const fileManager = new FileManager();

    // Загрузка доступных треков при открытии
    useEffect(() => {
        if (isOpen) {
            loadAvailableTracks();
        }
    }, [isOpen]);

    const loadAvailableTracks = async () => {
        try {
            const tracks = await trackManager.findAll();
            setAvailableTracks(tracks);
            setPlaylistTracks([]);
            setPlaylistName("Новый плейлист");
            setPlaylistCoverFile(null);
            setPlaylistCoverPreview(null);
        } catch (error) {
            console.error('Error loading tracks:', error);
            alert('Не удалось загрузить список треков');
        }
    };

    const formatTime = (seconds?: number) => {
        if (!seconds) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    useEffect(() => {
        if (!isOpen) {
            setIsPositionCalculated(false);
            return;
        }
        const updateLayout = () => {
            const w = window.innerWidth;
            setIsMobile(w < 768);
            let modalWidth = 800;
            if (w < 1024) modalWidth = Math.min(760, w - 32);
            if (w < 768) modalWidth = w - 24;
            const modalHeight = Math.min(640, window.innerHeight - 112);
            const left = (window.innerWidth - modalWidth) / 2;
            const top = Math.max(40, (window.innerHeight - modalHeight) / 2 - 40);
            setPosition({ x: left, y: top });
            setIsPositionCalculated(true);
        };
        updateLayout();
        window.addEventListener('resize', updateLayout);
        return () => window.removeEventListener('resize', updateLayout);
    }, [isOpen]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (window.innerWidth < 1024) return;
        if (e.target instanceof Element && e.target.closest('.cpl-header') && !e.target.closest('.cpl-close')) {
            setIsDragging(true);
            const rect = modalRef.current?.getBoundingClientRect();
            if (rect) {
                setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            }
        }
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging || window.innerWidth < 1024 || !modalRef.current) return;
        let newX = e.clientX - dragOffset.x;
        let newY = e.clientY - dragOffset.y;
        const r = modalRef.current.getBoundingClientRect();
        newX = Math.max(0, Math.min(newX, window.innerWidth - r.width));
        newY = Math.max(40, Math.min(newY, window.innerHeight - r.height));
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

    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (draggedIndex === null) return;
        const targetElement = e.target.closest('.cpl-track-item');
        if (!targetElement) return;
        const children = Array.from(targetElement.parentNode?.children || []);
        const targetIndex = children.indexOf(targetElement);

        if (targetIndex === draggedIndex || targetIndex === -1) return;

        const newTracks = [...playlistTracks];
        const [movedTrack] = newTracks.splice(draggedIndex, 1);
        newTracks.splice(targetIndex, 0, movedTrack);
        setPlaylistTracks(newTracks);
        setDraggedIndex(null);
    };

    const playlistCount = playlistTracks.length;
    const totalDuration = playlistTracks.reduce((sum, t) => sum + (t.duration || 0), 0);
    const durationFormatted = formatTime(totalDuration);

    const handleCoverClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        document.getElementById('cover-upload')?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPlaylistCoverFile(file);
            const reader = new FileReader();
            reader.onload = (ev) => {
                setPlaylistCoverPreview(ev.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const addTrackToPlaylist = (track: Track) => {
        setPlaylistTracks(prev => [...prev, track]);
        setAvailableTracks(prev => prev.filter(t => t.id !== track.id));
    };

    const removeTrackFromPlaylist = (track: Track) => {
        setAvailableTracks(prev => [...prev, track]);
        setPlaylistTracks(prev => prev.filter(t => t.id !== track.id));
    };

    // В handleSave
    const handleSave = async () => {
        if (isLoading) return;
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append("userId", JSON.parse(atob(localStorage.getItem('auth_token')!.split('.')[1])).userId);
            formData.append("name", playlistName.trim() || "Новый плейлист");
            formData.append("isSystem", "false");

            if (playlistCoverFile) {
                formData.append("coverFile", playlistCoverFile);
            }

            const API_URL = import.meta.env.VITE_BASE_URL_PROD || import.meta.env.VITE_BASE_URL_DEV || 'http://localhost:8080';
            const token = localStorage.getItem('auth_token');

            const response = await fetch(`${API_URL}/api/playlists`, {
                method: 'POST',
                headers: token ? {
                    'Authorization': `Bearer ${token}`,
                } : {},
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server error ${response.status}: ${errorText}`);
            }

            const contentType = response.headers.get('content-type');
            const created = contentType?.includes('application/json')
                ? await response.json()
                : { name: playlistName };

            console.log("✅ Плейлист создан:", created);
            alert(`Плейлист "${created.name}" создан!`);

            onSuccess?.();
            onClose();

        } catch (err: any) {
            console.error("❌ Ошибка:", err);
            alert("Не удалось создать плейлист:\n" + err.message);
        } finally {
            setIsLoading(false);
        }
    };


    const handleCancel = () => {
        onClose();
    };

    const handleNameClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditingName(true);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPlaylistName(e.target.value);
    };

    const handleNameBlur = () => {
        setIsEditingName(false);
    };

    const handleNameKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            setIsEditingName(false);
        }
    };

    return (
        <div className="cpl-overlay" style={{ opacity: isPositionCalculated ? 1 : 0 }}>
            <div
                ref={modalRef}
                className={`cpl-container ${isMobile ? 'mobile' : ''}`}
                style={{ left: `${position.x}px`, top: `${position.y}px` }}
                onMouseDown={handleMouseDown}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={`cpl-header ${isMobile ? 'mobile-centered' : ''}`}>
                    <div className="cpl-playlist-cover" onClick={handleCoverClick}>
                        {playlistCoverPreview ? (
                            <img src={playlistCoverPreview} alt="Обложка" style={{ width: '156px', height: '156px', borderRadius: '12px', objectFit: 'cover' }} />
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 156 156" width="156" height="156" fill="none" stroke="#f1f1f1" strokeWidth="5">
                                <rect x="28" y="28" width="100" height="100" rx="10" />
                                <path d="M52 52v64 M78 52v64 M104 52v64" />
                            </svg>
                        )}
                    </div>

                    <div className="cpl-playlist-info">
                        {isEditingName ? (
                            <input
                                type="text"
                                className="cpl-title-input"
                                value={playlistName}
                                onChange={handleNameChange}
                                onBlur={handleNameBlur}
                                onKeyDown={handleNameKeyDown}
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                                maxLength={50}
                            />
                        ) : (
                            <div className="cpl-title" onClick={handleNameClick}>
                                {playlistName}
                            </div>
                        )}
                        <div className="cpl-meta">
                            <div className="cpl-count">{playlistCount} треков</div>
                            <div className="cpl-duration">{durationFormatted}</div>
                        </div>
                    </div>

                    <button className="cpl-close" onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }} aria-label="Закрыть" disabled={isLoading}>
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
                        <div
                            className="cpl-track-list"
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            {playlistTracks.length === 0 && (
                                <div className="cpl-empty-message">Перетащите треки сюда</div>
                            )}
                            {playlistTracks.map((track, index) => (
                                <div
                                    key={String(track.id)}
                                    className={`cpl-track-item ${draggedIndex === index ? 'dragging' : ''}`}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, index)}
                                >
                                    <div className="cpl-track-cover">
                                        {track.coverHash ? (
                                            <img src={`/api/files/covers/${track.coverHash}`} alt="" style={{width: 32, height: 32, objectFit: 'cover'}} />
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="#f1f1f1" strokeWidth="1.2">
                                                <rect x="4" y="4" width="24" height="24" rx="2" />
                                                <path d="M12 12v8" /><path d="M16 12v8" /><path d="M20 12v8" />
                                            </svg>
                                        )}
                                    </div>
                                    <div className="cpl-track-text">
                                        <div className="cpl-track-title">{track.name || "Без названия"}</div>
                                        <div className="cpl-track-artist">{track.artist || "Неизвестно"}</div>
                                    </div>
                                    <div className="cpl-track-duration">{formatTime(track.duration)}</div>
                                    <button className="cpl-remove-btn" onClick={() => removeTrackFromPlaylist(track)} disabled={isLoading}>
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
                        <h3 className="cpl-column-title">Доступные треки</h3>
                        <div className="cpl-track-list">
                            {availableTracks.length === 0 && (
                                <div className="cpl-empty-message">Треков нет</div>
                            )}
                            {availableTracks.map((track) => (
                                <div key={String(track.id)} className="cpl-track-item">
                                    <div className="cpl-track-cover">
                                        {track.coverHash ? (
                                            <img src={`/api/files/covers/${track.coverHash}`} alt="" style={{width: 32, height: 32, objectFit: 'cover'}} />
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="#f1f1f1" strokeWidth="1.2">
                                                <rect x="4" y="4" width="24" height="24" rx="2" />
                                                <path d="M12 12v8" /><path d="M16 12v8" /><path d="M20 12v8" />
                                            </svg>
                                        )}
                                    </div>
                                    <div className="cpl-track-text">
                                        <div className="cpl-track-title">{track.name || "Без названия"}</div>
                                        <div className="cpl-track-artist">{track.artist || "Неизвестно"}</div>
                                    </div>
                                    <div className="cpl-track-duration">{formatTime(track.duration)}</div>
                                    <button className="cpl-add-btn" onClick={() => addTrackToPlaylist(track)} disabled={isLoading}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#aaa" strokeWidth="2">
                                            <path d="M12 5v14M5 12h14" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={`cpl-buttons ${isMobile ? 'mobile-center' : ''}`}>
                    <button className="cpl-btn-cancel" onClick={handleCancel} disabled={isLoading}>Отменить</button>
                    <button
                        className="cpl-btn-save"
                        onClick={handleSave}
                        disabled={isLoading || playlistTracks.length === 0 || !playlistName.trim()}
                    >
                        {isLoading ? 'Сохранение...' : 'Сохранить'}
                    </button>
                </div>
            </div>
            <input type="file" id="cover-upload" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
        </div>
    );
};

export default CreatePlaylistModal;