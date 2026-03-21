import { useState, useEffect, useRef, type CSSProperties, type MouseEvent as ReactMouseEvent } from 'react';
import '../assets/styles/components/TrackPlayerModal.css';
import { useTrackPlayback } from '../hooks/useTrackPlayback';
import { useFavorites } from '../hooks/useFavorites';
import { FileManager } from '../api/FileManager';
import noCover from '../assets/images/no-cover.svg';

interface PlayerTrack {
    title?: string;
    artist?: string;
    duration?: number;
}

interface AnchorPosition {
    top: number;
    left: number;
    width: number;
    height: number;
}

interface TrackPlayerModalProps {
    isOpen: boolean;
    onClose: () => void;
    track?: PlayerTrack | null;
    anchorPosition?: AnchorPosition | null;
    isMobile?: boolean;
}

const TrackPlayerModal = ({ isOpen, onClose, track = null, anchorPosition = null, isMobile = false }: TrackPlayerModalProps) => {
    const modalRef = useRef<HTMLDivElement | null>(null);
    const fileManagerRef = useRef(new FileManager());
    const [coverSrc, setCoverSrc] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const {
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        isShuffle,
        isRepeat,
        togglePlayback,
        seekTo,
        playNext,
        playPrevious,
        toggleShuffle,
        toggleRepeat,
    } = useTrackPlayback();
    const { favoriteTrackIds, addFavoriteTrack, removeFavoriteTrack } = useFavorites();

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => setIsVisible(true), 10);
        } else {
            setIsVisible(false);
        }
    }, [isOpen]);

    useEffect(() => {
        const loadCover = async () => {
            if (!currentTrack?.coverHash) {
                setCoverSrc('');
                return;
            }

            try {
                const nextCoverSrc = await fileManagerRef.current.getFileUrl('images', currentTrack.coverHash);
                setCoverSrc(nextCoverSrc);
            } catch (error) {
                console.error('Error loading player modal cover:', error);
                setCoverSrc('');
            }
        };

        void loadCover();
    }, [currentTrack?.coverHash]);

    useEffect(() => {
        if (!isMobile && isOpen) {
            const handleClickOutside = (event: MouseEvent) => {
                if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                    onClose();
                }
            };

            const timerId = setTimeout(() => {
                document.addEventListener('click', handleClickOutside);
            }, 100);

            return () => {
                clearTimeout(timerId);
                document.removeEventListener('click', handleClickOutside);
            };
        }
    }, [isMobile, isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    const title = currentTrack?.name || track?.title || 'Название трека';
    const artist = currentTrack?.artist || track?.artist || 'Исполнитель';
    const effectiveDuration = duration || currentTrack?.duration || track?.duration || 0;
    const isFavorite = currentTrack ? favoriteTrackIds.has(Number(currentTrack.id)) : false;

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleFavoriteToggle = () => {
        if (!currentTrack) {
            return;
        }

        const currentTrackId = Number(currentTrack.id);
        if (isFavorite) {
            void removeFavoriteTrack(currentTrackId);
        } else {
            void addFavoriteTrack(currentTrackId);
        }
    };

    const handleProgressClick = (e: ReactMouseEvent<HTMLDivElement>) => {
        if (!effectiveDuration) {
            return;
        }

        const rect = e.currentTarget.getBoundingClientRect();
        const progressFraction = (e.clientX - rect.left) / rect.width;
        seekTo(Math.min(effectiveDuration, Math.max(0, progressFraction * effectiveDuration)));
    };

    const getModalStyle = (): CSSProperties => {
        if (isMobile || !anchorPosition) {
            return {};
        }

        return {
            top: anchorPosition.top + anchorPosition.height + 8,
            left: anchorPosition.left + (anchorPosition.width / 2),
            transform: 'translateX(-50%)',
            position: 'fixed',
            width: Math.min(400, anchorPosition.width * 1.5),
            maxWidth: '450px',
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
                        <img
                            src={coverSrc || noCover}
                            alt={title}
                            className="tpm-cover-image"
                            onError={(e) => {
                                e.currentTarget.src = noCover;
                            }}
                        />
                    </div>
                </div>

                <div className="tpm-info-row">
                    <button className="tpm-btn tpm-btn-playlist" title="Добавить в плейлист" disabled={!currentTrack}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                            <path d="M14 10H2v2h12v-2zm0-4H2v2h12V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM2 16h8v-2H2v2z"/>
                        </svg>
                    </button>

                    <div className="tpm-track-info-centered">
                        <div className="tpm-track-title">{title}</div>
                        <div className="tpm-track-artist">{artist}</div>
                    </div>

                    <button
                        className={`tpm-btn tpm-btn-favorite ${isFavorite ? 'active' : ''}`}
                        onClick={handleFavoriteToggle}
                        title="В избранное"
                        disabled={!currentTrack}
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
                    <div className="tpm-time-current">{formatTime(currentTime)}</div>
                    <div
                        className="tpm-progress-bar-bg"
                        onClick={handleProgressClick}
                    >
                        <div
                            className="tpm-progress-bar-fill"
                            style={{ width: `${effectiveDuration ? (currentTime / effectiveDuration) * 100 : 0}%` }}
                        ></div>
                    </div>
                    <div className="tpm-time-total">{formatTime(effectiveDuration)}</div>
                </div>

                <div className="tpm-controls-row">
                    <button
                        className={`tpm-btn tpm-btn-shuffle ${isShuffle ? 'active' : ''}`}
                        onClick={toggleShuffle}
                        title="Случайный порядок"
                        disabled={!currentTrack}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                            <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.95 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
                        </svg>
                    </button>

                    <button className="tpm-btn tpm-btn-prev" onClick={() => { void playPrevious(); }} disabled={!currentTrack}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                            <rect x="4" y="4" width="3" height="16" fill="currentColor" />
                            <polygon points="20,4 20,20 8,12" fill="currentColor" />
                        </svg>
                    </button>

                    <button
                        className="tpm-btn tpm-btn-play-pause"
                        onClick={() => { void togglePlayback(); }}
                        title={isPlaying ? 'Пауза' : 'Воспроизвести'}
                        disabled={!currentTrack}
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

                    <button className="tpm-btn tpm-btn-next" onClick={() => { void playNext(); }} disabled={!currentTrack}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                            <rect x="17" y="4" width="3" height="16" fill="currentColor" />
                            <polygon points="4,4 4,20 16,12" fill="currentColor" />
                        </svg>
                    </button>

                    <button
                        className={`tpm-btn tpm-btn-repeat ${isRepeat ? 'active' : ''}`}
                        onClick={toggleRepeat}
                        title="Повтор"
                        disabled={!currentTrack}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                            <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
                        </svg>
                    </button>
                </div>
            </div>
        </>
    );
};

export default TrackPlayerModal;
