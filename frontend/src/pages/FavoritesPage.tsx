import {useState, useRef, useEffect, useCallback} from 'react';
import '../assets/styles/pages/FavoritesPage.css';
import FavoriteCard from '../components/FavoriteCard.tsx';
import SearchBar from '../components/SearchBar.tsx';
import PlaylistModal from '../components/PlaylistModal.tsx';
import CreatePlaylistModal from '../components/CreatePlaylistModal.tsx';
import AlbumModal from '../components/AlbumModal.tsx';
import type {Playlist} from "../types/Playlist.ts";
import type {Track} from "../types/Track.ts";
import type {Album} from "../types/Album.ts";
import type {PlaylistWithTracks} from "../types/PlaylistWithTracks.ts";
import {PlaylistManager} from "../api/PlaylistManager.ts";
import {FavoriteManager} from "../api/FavoriteManager.ts";
import {FileManager} from "../api/FileManager.ts";
import noCover from '../assets/images/no-cover.svg';
import {useFavorites} from "../hooks/useFavorites.ts";
import { AlbumManager } from "../api/AlbumManager.ts";
import type { TrackId } from "../types/Track.ts";
import { useTrackPlayback } from "../hooks/useTrackPlayback.ts";

const playlistManager = new PlaylistManager();
const favoriteManager = new FavoriteManager();
const fileManager = new FileManager();
const albumManager = new AlbumManager();

const FavoritesPage = () => {
    const [category, setCategory] = useState("Треки");

    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [tracks, setTracks] = useState<Track[]>([]);
    const [albums, setAlbums] = useState<Album[]>([]);
    const [playlistCovers, setPlaylistCovers] = useState<Record<string, string>>({});
    const [trackCovers, setTrackCovers] = useState<Record<string, string>>({});
    const [albumCovers, setAlbumCovers] = useState<Record<string, string>>({});

    const [searchQuery, setSearchQuery] = useState("");

    const [pendingRemovalIds, setPendingRemovalIds] = useState<Set<string>>(new Set());
    const removalTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

    const {
        favoriteTrackIds,
        favoriteAlbumIds,
        favoritePlaylistIds,
        removeFavoriteTrack,
        removeFavoriteAlbum,
        removeFavoritePlaylist
    } = useFavorites();
    const { playTrack, isTrackPlaying, isTrackLoading } = useTrackPlayback();

    const loadAllData = useCallback(async () => {
        try {
            const userPlaylists = await favoriteManager.getFavoritePlaylists();
            setPlaylists(userPlaylists);

            const favoriteTracks = await favoriteManager.getFavoriteTracks();
            setTracks(favoriteTracks);

            const favoriteAlbums = await favoriteManager.getFavoriteAlbums();
            setAlbums(favoriteAlbums);

            const playlistCoversMap: Record<string, string> = {};
            await Promise.all(userPlaylists.map(async (playlist) => {
                if (playlist.coverHash) {
                    try {
                        const coverSrc = await fileManager.getFileUrl("images", playlist.coverHash);
                        if (coverSrc) {
                            playlistCoversMap[playlist.id.toString()] = coverSrc;
                        }
                    } catch (err) {
                        console.log(`Error loading cover for playlist ${playlist.id}:`, err);
                    }
                }
            }));
            setPlaylistCovers(playlistCoversMap);

            const trackCoversMap: Record<string, string> = {};
            await Promise.all(favoriteTracks.map(async (track) => {
                if (track.coverHash) {
                    try {
                        const coverSrc = await fileManager.getFileUrl("images", track.coverHash);
                        if (coverSrc) {
                            trackCoversMap[track.id.toString()] = coverSrc;
                        }
                    } catch (err) {
                        console.log(`Error loading cover for track ${track.id}:`, err);
                    }
                }
            }));
            setTrackCovers(trackCoversMap);

            const albumCoversMap: Record<string, string> = {};
            await Promise.all(favoriteAlbums.map(async (album) => {
                if (album.coverHash) {
                    try {
                        const coverSrc = await fileManager.getFileUrl("images", album.coverHash);
                        if (coverSrc) {
                            albumCoversMap[album.id.toString()] = coverSrc;
                        }
                    } catch (err) {
                        console.log(`Error loading cover for album ${album.id}:`, err);
                    }
                }
            }));
            setAlbumCovers(albumCoversMap);

        } catch (err) {
            console.log('Error loading data:', err);
        }
    }, []);

    useEffect(() => {
        void loadAllData();
    }, [loadAllData]);

    const [menuVisible, setMenuVisible] = useState<number | null>(null);
    const [startY, setStartY] = useState(0);
    const menuRef = useRef<HTMLDivElement | null>(null);

    const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist>();
    const [selectedPlaylistData, setSelectedPlaylistData] = useState<PlaylistWithTracks | null>(null);
    const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);

    const handleCategoryChange = (cat: string) => {
        setCategory(cat);
        setSearchQuery("");
    };

    const getFilteredTracks = () => {
        if (!searchQuery.trim()) return tracks;
        const query = searchQuery.toLowerCase().trim();
        return tracks.filter(track =>
            track.name?.toLowerCase().includes(query)
        );
    };

    const getFilteredPlaylists = () => {
        if (!searchQuery.trim()) return playlists;
        const query = searchQuery.toLowerCase().trim();
        return playlists.filter(playlist =>
            playlist.name?.toLowerCase().includes(query)
        );
    };

    const getFilteredAlbums = () => {
        if (!searchQuery.trim()) return albums;
        const query = searchQuery.toLowerCase().trim();
        return albums.filter(album =>
            album.title?.toLowerCase().includes(query)
        );
    };

    const toggleRemoveTrack = (trackId: TrackId) => {
        const idStr = trackId.toString();

        if (pendingRemovalIds.has(idStr)) {
            const timer = removalTimers.current.get(idStr);
            if (timer) {
                clearTimeout(timer);
                removalTimers.current.delete(idStr);
            }

            setPendingRemovalIds(prev => {
                const next = new Set(prev);
                next.delete(idStr);
                return next;
            });
            return;
        }

        setPendingRemovalIds(prev => new Set(prev).add(idStr));

        const timer = setTimeout(async () => {
            try {
                await removeFavoriteTrack(Number(trackId));
                setTracks(currentTracks => currentTracks.filter(t => t.id !== trackId));
            } catch (err) {
                console.error('Error removing track from favorites:', err);
                alert('Не удалось удалить трек из избранного');
            } finally {
                removalTimers.current.delete(idStr);
                setPendingRemovalIds(prev => {
                    const next = new Set(prev);
                    next.delete(idStr);
                    return next;
                });
            }
        }, 2000);

        removalTimers.current.set(idStr, timer);
    };

    const removeAlbum = async (albumId: number | bigint) => {
        if (!window.confirm('Удалить этот альбом из избранного?')) {
            return;
        }

        try {
            const numericId = Number(albumId);
            await removeFavoriteAlbum(numericId);
            setAlbums(prev => prev.filter(a => a.id !== albumId));
        } catch (err) {
            console.error('Error removing album from favorites:', err);
            alert('Не удалось удалить альбом из избранного');
        }
    };

    const removePlaylist = async (playlistId: number | bigint) => {
        if (!window.confirm('Вы уверены? Плейлист будет удален безвозвратно.')) {
            return;
        }

        try {
            const numericId = Number(playlistId);
            await playlistManager.deleteById(playlistId);
            setPlaylists(prev => prev.filter(p => p.id !== playlistId));
        } catch (err) {
            console.error('Error deleting playlist:', err);
            alert('Не удалось удалить плейлист. Возможно, у вас нет прав.');
        }
    };

    const showMenu = (e: React.MouseEvent, trackId: number) => {
        e.stopPropagation();
        setMenuVisible(trackId);
    };

    const hideMenu = () => {
        setMenuVisible(null);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        setStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!menuVisible) return;
        const touchY = e.touches[0].clientY;
        const diff = touchY - startY;

        if (diff > 50) {
            hideMenu();
        }
    };

    const handlePlayNext = (trackId: number) => {
        console.log("Играть следующим:", trackId);
        hideMenu();
    };

    const handleRemoveFromFavorites = (trackId: number) => {
        toggleRemoveTrack(BigInt(trackId));
        hideMenu();
    };

    const handleAddToPlaylist = (trackId: number) => {
        console.log("Добавить в плейлист:", trackId);
        hideMenu();
    };

    const openPlaylistModal = async (playlist: Playlist) => {
        try {
            const playlistInfo = await playlistManager.findById(playlist.id);
            const tracksArray = await playlistManager.findTracksByPlaylistId(playlist.id);

            const playlistWithTracks: PlaylistWithTracks = {
                ...playlistInfo,
                tracks: tracksArray
            };

            setSelectedPlaylistData(playlistWithTracks);
            setIsModalOpen(true);
        } catch (err) {
            console.error('Error loading playlist details:', err);
            alert('Не удалось загрузить плейлист');
        }
    };

    const closePlaylistModal = () => {
        setIsModalOpen(false);
        setSelectedPlaylistData(null);
    };

    const openCreatePlaylistModal = () => {
        setIsCreateModalOpen(true);
    };

    const closeCreatePlaylistModal = () => {
        setIsCreateModalOpen(false);
    };

    const handleAlbumClick = async (album: Album) => {
        try {
            const fullAlbum = await albumManager.findAllTrackById(album.id);
            setSelectedAlbum(fullAlbum);
            setIsAlbumModalOpen(true);
        } catch (err) {
            console.error('Error loading album details:', err);
            setSelectedAlbum(album);
            setIsAlbumModalOpen(true);
        }
    };

    const closeAlbumModal = () => {
        setIsAlbumModalOpen(false);
        setSelectedAlbum(null);
    };

    const formatDate = (dateStr: string | Date) => {
        const d = new Date(dateStr);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}.${month}.${year}`;
    };

    const formatDuration = (seconds?: number) => {
        if (!seconds) return '--:--';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const filteredTracks = getFilteredTracks();
    const filteredPlaylists = getFilteredPlaylists();
    const filteredAlbums = getFilteredAlbums();
    const playbackTracks = filteredTracks.map((track) => {
        const authorCount = track.authorIds ? track.authorIds.size : 0;
        const playbackArtist = track.artist || (authorCount > 0 ? `${authorCount} исполнителей` : "Неизвестный исполнитель");

        return {
            ...track,
            artist: playbackArtist,
            album: track.album || "Избранные треки"
        };
    });

    const isSearchActive = searchQuery.trim().length > 0;

    const handleTrackPlay = (track: Track) => {
        const playbackTrack = playbackTracks.find((item) => item.id === track.id) ?? track;

        void playTrack(playbackTrack, { queue: playbackTracks }).catch((error) => {
            console.error('Error playing favorite track:', error);
            alert('Не удалось воспроизвести трек');
        });
    };

    return (
        <div className="favorites-page-container">
            <div className="favorites-main-content">
                <FavoriteCard title="Избранное" onCategoryChange={handleCategoryChange} initialCategory={category} />
            </div>

            <div className="favorites-bottom-section">
                <SearchBar
                    placeholder="Введите название..."
                    value={searchQuery}
                    onChange={(value) => setSearchQuery(value)}
                    onClick={() => {}}
                />
                <div className="favorites-section-title">Избранные {category}</div>

                {category === "Треки" && (
                    <div className="favorites-track-list">
                        {isSearchActive && filteredTracks.length === 0 ? (
                            <div className="favorites-search-empty">
                                Ничего не найдено
                            </div>
                        ) : (
                            filteredTracks.map((track, index) => {
                                const trackTitle = track.name || "Неизвестный трек";
                                const authorCount = track.authorIds ? track.authorIds.size : 0;
                                const trackArtist = authorCount > 0 ? `${authorCount} исполнителей` : "Неизвестный исполнитель";
                                const displayDuration = formatDuration(track.duration);
                                const isPendingRemoval = pendingRemovalIds.has(track.id.toString());
                                const coverUrl = trackCovers[track.id.toString()];

                                return (
                                    <div
                                        key={track.id.toString()}
                                        className={`favorites-track-row ${isPendingRemoval ? 'removing' : ''}`}
                                        onMouseEnter={(e) => !isPendingRemoval && e.currentTarget.classList.add('hover')}
                                        onMouseLeave={(e) => e.currentTarget.classList.remove('hover')}
                                        style={{
                                            opacity: isPendingRemoval ? 0.3 : 1,
                                            transition: 'opacity 0.2s ease',
                                            pointerEvents: 'auto'
                                        }}
                                    >
                                        <div className="favorites-track-number">{index + 1}</div>

                                        <div className="favorites-track-cover">
                                            {coverUrl ? (
                                                <img
                                                    src={coverUrl}
                                                    alt={trackTitle}
                                                    style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';
                                                        const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
                                                        fallback?.style.setProperty('display', 'block');
                                                    }}
                                                />
                                            ) : null}
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="40" height="40" fill="none" stroke="#f1f1f1" strokeWidth="1.5" style={{ display: coverUrl ? 'none' : 'block' }}>
                                                <rect x="4" y="4" width="24" height="24" rx="2" />
                                                <path d="M12 12v8" />
                                                <path d="M16 12v8" />
                                                <path d="M20 12v8" />
                                            </svg>
                                        </div>

                                        <div className="favorites-track-info">
                                            <div className="favorites-track-title">{trackTitle}</div>
                                            <div className="favorites-track-artist">{trackArtist}</div>
                                        </div>

                                        <div className="favorites-track-actions-desktop">
                                            <button
                                                className="favorites-action-btn"
                                                title={isTrackPlaying(track.id) ? 'Пауза' : 'Играть'}
                                                onClick={() => handleTrackPlay(track)}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#aaa" strokeWidth="2">
                                                    {isTrackLoading(track.id) ? (
                                                        <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
                                                    ) : isTrackPlaying(track.id) ? (
                                                        <>
                                                            <rect x="8" y="5" width="3" height="14" fill="currentColor" stroke="none" />
                                                            <rect x="13" y="5" width="3" height="14" fill="currentColor" stroke="none" />
                                                        </>
                                                    ) : (
                                                        <path d="M8 5v14l11-7z" />
                                                    )}
                                                </svg>
                                            </button>
                                            <button className="favorites-action-btn" title="Играть следующим">
                                                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2">
                                                    <path d="M2 6h20M2 12h12M2 18h8" />
                                                    <path d="M18 15l3 3-3 3M21 18h-6" />
                                                </svg>
                                            </button>
                                        </div>

                                        <div className="favorites-track-duration">
                                            {displayDuration}
                                        </div>

                                        <div
                                            className="favorites-track-favorite"
                                            onClick={() => toggleRemoveTrack(track.id)}
                                            style={{
                                                cursor: 'pointer',
                                                transform: isPendingRemoval ? 'scale(1.2)' : 'scale(1)',
                                                transition: 'transform 0.2s'
                                            }}
                                            title={isPendingRemoval ? "Нажмите еще раз, чтобы отменить" : "Удалить"}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="#ff2d55" stroke="#ff2d55" strokeWidth="2">
                                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                            </svg>
                                        </div>

                                        <div className="favorites-track-add-to-playlist">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                                                <path d="M14 10H2v2h12v-2zm0-4H2v2h12V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM2 16h8v-2H2v2z"/>
                                            </svg>
                                        </div>

                                        <div className="favorites-track-actions-mobile">
                                            <button
                                                className="favorites-action-btn"
                                                title={isTrackPlaying(track.id) ? 'Пауза' : 'Играть'}
                                                onClick={() => handleTrackPlay(track)}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#aaa" strokeWidth="2">
                                                    {isTrackLoading(track.id) ? (
                                                        <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
                                                    ) : isTrackPlaying(track.id) ? (
                                                        <>
                                                            <rect x="8" y="5" width="3" height="14" fill="currentColor" stroke="none" />
                                                            <rect x="13" y="5" width="3" height="14" fill="currentColor" stroke="none" />
                                                        </>
                                                    ) : (
                                                        <path d="M8 5v14l11-7z" />
                                                    )}
                                                </svg>
                                            </button>
                                            <button
                                                className="favorites-dots-btn"
                                                onClick={(e) => showMenu(e, Number(track.id))}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#aaa" strokeWidth="2">
                                                    <circle cx="12" cy="12" r="1" />
                                                    <circle cx="12" cy="5" r="1" />
                                                    <circle cx="12" cy="19" r="1" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}

                {category === "Плейлисты" && (
                    <div className="favorites-playlist-grid">
                        {isSearchActive && filteredPlaylists.length === 0 ? (
                            <div className="favorites-search-empty">
                                Ничего не найдено
                            </div>
                        ) : (
                            <>
                                {filteredPlaylists.map((playlist) => (
                                    <div key={playlist.id.toString()} className="favorites-playlist-card">
                                        <div
                                            className="playlist-cover"
                                            onClick={() => openPlaylistModal(playlist)}
                                        >
                                            <img
                                                src={playlistCovers[playlist.id.toString()] || noCover}
                                                alt={playlist.name}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                onError={(e) => {
                                                    e.currentTarget.src = noCover;
                                                }}
                                            />
                                            <div
                                                className="playlist-cover-play-button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openPlaylistModal(playlist);
                                                }}
                                            >
                                                <svg className="playlist-cover-play-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="playlist-info-layer">
                                            <div className="playlist-info-text">
                                                <div className="playlist-title">{playlist.name}</div>
                                                <div className="playlist-meta">
                                                    <span>Пользователь</span>
                                                </div>
                                            </div>
                                            <div
                                                className="playlist-trash-icon"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removePlaylist(playlist.id);
                                                }}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#aaa" strokeWidth="2">
                                                    <path d="M3 6h18M19 6v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="favorites-playlist-card add-placeholder" onClick={openCreatePlaylistModal}>
                                    <svg className="add-plus-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                                    </svg>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {category === "Альбомы" && (
                    <div className="favorites-album-grid">
                        {isSearchActive && filteredAlbums.length === 0 ? (
                            <div className="favorites-search-empty">
                                Ничего не найдено
                            </div>
                        ) : (
                            filteredAlbums.map((album) => (
                                <div key={album.id.toString()} className="favorites-album-card">
                                    <div
                                        className="album-cover"
                                        onClick={() => handleAlbumClick(album)}
                                    >
                                        <img
                                            src={albumCovers[album.id.toString()] || noCover}
                                            alt={album.title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            onError={(e) => {
                                                e.currentTarget.src = noCover;
                                            }}
                                        />
                                        <div
                                            className="album-fav-cover-play-button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAlbumClick(album);
                                            }}
                                        >
                                            <svg className="album-cover-play-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="album-info-layer">
                                        <div className="album-info-text">
                                            <div className="album-title-FP">{album.title}</div>
                                            <div className="album-meta">
                                                <span>{formatDate(album.releasedAt)}</span>
                                            </div>
                                        </div>
                                        <div
                                            className="album-trash-icon"
                                            onClick={() => removeAlbum(album.id)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#aaa" strokeWidth="2">
                                                <path d="M3 6h18M19 6v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {menuVisible && (
                    <div
                        className="favorites-context-menu-overlay"
                        onClick={hideMenu}
                    >
                        <div
                            className="favorites-context-menu active"
                            ref={menuRef}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="favorites-context-item" onClick={() => handlePlayNext(menuVisible)}>
                                Играть следующим
                            </div>
                            <div className="favorites-context-divider"></div>
                            <div className="favorites-context-item" onClick={() => handleRemoveFromFavorites(menuVisible)}>
                                Удалить из избранного
                            </div>
                            <div className="favorites-context-divider"></div>
                            <div className="favorites-context-item" onClick={() => handleAddToPlaylist(menuVisible)}>
                                Добавить в плейлист
                            </div>
                        </div>
                    </div>
                )}

                {isModalOpen && selectedPlaylistData && (
                    <PlaylistModal
                        isOpen={true}
                        onClose={closePlaylistModal}
                        playlistName={String(selectedPlaylistData.name)}
                        tracks={selectedPlaylistData.tracks || []}
                        playlistId={selectedPlaylistData.id ? Number(selectedPlaylistData.id) : undefined}
                        playlist={selectedPlaylistData}
                        coverHash={selectedPlaylistData.coverHash}
                    />
                )}

                {isCreateModalOpen && (
                    <CreatePlaylistModal
                        isOpen={true}
                        onClose={closeCreatePlaylistModal}
                        onSuccess={() => {
                            void loadAllData();
                        }}
                    />
                )}

                {isAlbumModalOpen && selectedAlbum && (
                    <AlbumModal
                        isOpen={true}
                        onClose={closeAlbumModal}
                        albumName={String(selectedAlbum.title)}
                        authorName={selectedAlbum.authors?.[0]?.name || "Автор"}
                        tracks={selectedAlbum.tracks || []}
                        albumAuthors={selectedAlbum.authors || []}
                        albumId={selectedAlbum.id}
                        coverHash={selectedAlbum.coverHash}
                    />
                )}
            </div>
        </div>
    );
};

export default FavoritesPage;
