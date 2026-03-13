import {useState, useRef, useEffect} from 'react';
import '../assets/styles/pages/FavoritesPage.css';
import FavoriteCard from '../components/FavoriteCard.tsx';
import SearchBar from '../components/SearchBar.tsx';
import PlaylistModal from '../components/PlaylistModal.tsx';
import CreatePlaylistModal from '../components/CreatePlaylistModal.tsx';
import AlbumModal from '../components/AlbumModal.tsx';
import type {Playlist} from "../types/Playlist.ts";
import {PlaylistManager} from "../api/PlaylistManager.ts";
import {FileManager} from "../api/FileManager.ts";

const FavoritesPage = () => {
    const [category, setCategory] = useState("Треки");

    const playlistManager = new PlaylistManager();
    const fileManager = new FileManager();
    const [playlists, setPlaylists] = useState<Playlist[]>([]);

    useEffect(() => {
        const loadPlaylists = async () => {
            try {
                const playlists = await playlistManager.findAll();
                setPlaylists(playlists);

            } catch (err) {
                console.log('Error', err);
            }
        };

        loadPlaylists();
    }, []);

    // Данные альбомов
    const albums = [
        { id: 1, title: "Альбом 1", date: "2025-01-15", color: "#00f0ff", creator: "Артур", tracks: [
                { title: "Трек 1", artist: "Исполнитель A", duration: 180 },
                { title: "Трек 2", artist: "Исполнитель B", duration: 210 },
                { title: "Трек 3", artist: "Исполнитель C", duration: 150 },
            ]},
        { id: 2, title: "Альбом 2", date: "2025-02-01", color: "#ff0000", creator: "Мария", tracks: [
                { title: "Трек 4", artist: "Исполнитель D", duration: 200 },
                { title: "Трек 5", artist: "Исполнитель E", duration: 170 },
            ]},
        { id: 3, title: "Альбом 3", date: "2025-02-10", color: "#8000ff", creator: "Иван", tracks: [
                { title: "Трек 6", artist: "Исполнитель F", duration: 190 },
            ]},
        { id: 4, title: "Альбом 4", date: "2025-02-18", color: "#7fff7f", creator: "Ольга", tracks: []},
        { id: 5, title: "Альбом 5", date: "2025-02-20", color: "#00f0ff", creator: "Петр", tracks: []},
        { id: 6, title: "Альбом 6", date: "2025-02-22", color: "#ff0000", creator: "Анна", tracks: []},
        { id: 7, title: "Альбом 7", date: "2025-02-25", color: "#8000ff", creator: "Дмитрий", tracks: []},
        { id: 8, title: "Альбом 8", date: "2025-02-28", color: "#7fff7f", creator: "Елена", tracks: []},
    ];

    // Все треки — в избранном
    const [tracks, setTracks] = useState([
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
        { id: 11, title: "Трек 11", artist: "Исполнитель K", duration: 180 },
        { id: 12, title: "Трек 12", artist: "Исполнитель L", duration: 210 },
        { id: 13, title: "Трек 13", artist: "Исполнитель M", duration: 150 },
        { id: 14, title: "Трек 14", artist: "Исполнитель N", duration: 200 },
        { id: 15, title: "Трек 15", artist: "Исполнитель O", duration: 170 },
    ]);

    const [menuVisible, setMenuVisible] = useState(null); // id трека
    const [startY, setStartY] = useState(0);
    const menuRef = useRef(null);

    const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist>();
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);

    const handleCategoryChange = (cat) => {
        setCategory(cat);
    };

    const removeTrack = (id) => {
        setTracks(tracks.filter(t => t.id !== id));
    };

    const showMenu = (e, trackId) => {
        e.stopPropagation();
        setMenuVisible(trackId);
    };

    const hideMenu = () => {
        setMenuVisible(null);
    };

    const handleTouchStart = (e) => {
        setStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e) => {
        if (!menuVisible) return;
        const touchY = e.touches[0].clientY;
        const diff = touchY - startY;

        if (diff > 50) {
            hideMenu();
        }
    };

    const handlePlayNext = (trackId) => {
        console.log("Играть следующим:", trackId);
        hideMenu();
    };

    const handleRemoveFromFavorites = (trackId) => {
        removeTrack(trackId);
        hideMenu();
    };

    const handleAddToPlaylist = (trackId) => {
        console.log("Добавить в плейлист:", trackId);
        hideMenu();
    };

    const openPlaylistModal = (playlist: Playlist) => {
        setSelectedPlaylist(playlist);
        setIsModalOpen(true);
    };

    const closePlaylistModal = () => {
        setIsModalOpen(false);
        setSelectedPlaylist(null);
    };

    const openCreatePlaylistModal = () => {
        setIsCreateModalOpen(true);
    };

    const closeCreatePlaylistModal = () => {
        setIsCreateModalOpen(false);
    };

    const openAlbumModal = (album) => {
        setSelectedAlbum(album);
        setIsAlbumModalOpen(true);
    };

    const closeAlbumModal = () => {
        setIsAlbumModalOpen(false);
        setSelectedAlbum(null);
    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}.${month}.${year}`;
    };

    return (
        <div className="favorites-page-container">
            <div className="favorites-main-content">
                <FavoriteCard title="Избранное" onCategoryChange={handleCategoryChange} initialCategory={category} />
            </div>

            <div className="favorites-bottom-section">
                <SearchBar
                    placeholder="Введите название..."
                    value=""
                    onChange={() => {}}
                    onClick={() => {}}
                />
                <div className="favorites-section-title">Избранные {category}</div>

                {category === "Треки" && (
                    <div className="favorites-track-list">
                        {tracks.map((track, index) => (
                            <div
                                key={track.id}
                                className="favorites-track-row"
                                onMouseEnter={(e) => e.currentTarget.classList.add('hover')}
                                onMouseLeave={(e) => e.currentTarget.classList.remove('hover')}
                            >
                                <div className="favorites-track-number">{index + 1}</div>
                                <div className="favorites-track-cover">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="#f1f1f1" strokeWidth="1.2">
                                        <rect x="4" y="4" width="24" height="24" rx="2" />
                                        <path d="M12 12v8" />
                                        <path d="M16 12v8" />
                                        <path d="M20 12v8" />
                                    </svg>
                                </div>
                                <div className="favorites-track-info">
                                    <div className="favorites-track-title">{track.title}</div>
                                    <div className="favorites-track-artist">{track.artist}</div>
                                </div>
                                <div className="favorites-track-actions-desktop">
                                    <button className="favorites-action-btn">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#aaa" strokeWidth="2">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </button>
                                    <button className="favorites-action-btn">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#aaa" strokeWidth="2">
                                            <path d="M8 5v14l11-7z" />
                                            <path d="M18 5v14" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="favorites-track-duration">{Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}</div>
                                <div className="favorites-track-favorite">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="#ff2d55" stroke="#aaa" strokeWidth="2" onClick={() => removeTrack(track.id)} style={{ cursor: 'pointer' }}>
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                    </svg>
                                </div>
                                <div className="favorites-track-add-to-playlist">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                        <path d="M14 10H2v2h12v-2zm0-4H2v2h12V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM2 16h8v-2H2v2z"/>
                                    </svg>
                                </div>
                                <div className="favorites-track-actions-mobile">
                                    <button className="favorites-action-btn">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#aaa" strokeWidth="2">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </button>
                                    <button className="favorites-dots-btn" onClick={(e) => showMenu(e, track.id)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#aaa" strokeWidth="2">
                                            <circle cx="12" cy="12" r="1" />
                                            <circle cx="12" cy="5" r="1" />
                                            <circle cx="12" cy="19" r="1" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {category === "Плейлисты" && (
                    <div className="favorites-playlist-grid">
                        {playlists.map((playlist) => (
                            <div key={playlist.id} className="favorites-playlist-card">
                                <div
                                    className="playlist-cover"
                                    style={{ backgroundColor: playlist.color }}
                                    onClick={() => openPlaylistModal(playlist)}
                                >
                                    <div
                                        className="playlist-cover-play-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            console.log("Воспроизвести плейлист:", playlist.name);
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
                                            <span>{playlist.creator}</span>
                                            <span>{formatDate(playlist.date)}</span>
                                        </div>
                                    </div>
                                    <div className="playlist-trash-icon">
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
                    </div>
                )}

                {category === "Альбомы" && (
                    <div className="favorites-album-grid">
                        {albums.map((album) => (
                            <div key={album.id} className="favorites-album-card">
                                <div
                                    className="album-cover"
                                    style={{ backgroundColor: album.color }}
                                    onClick={() => openAlbumModal(album)}
                                >
                                    <div
                                        className="album-fav-cover-play-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            console.log("Воспроизвести альбом:", album.title);
                                            openAlbumModal(album);
                                        }}
                                    >
                                        <svg className="album-cover-play-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="album-info-layer">
                                    <div className="album-info-text">
                                        <div className="album-title">{album.title}</div>
                                        <div className="album-meta">
                                            <span>{album.creator}</span>
                                            <span>{formatDate(album.date)}</span>
                                        </div>
                                    </div>
                                    <div className="album-trash-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#aaa" strokeWidth="2">
                                            <path d="M3 6h18M19 6v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        ))}
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

                {isModalOpen && selectedPlaylist && (
                    <PlaylistModal
                        isOpen={true}
                        onClose={closePlaylistModal}
                        selectedId={selectedPlaylist.id}
                    />
                )}

                {isCreateModalOpen && (
                    <CreatePlaylistModal
                        isOpen={true}
                        onClose={closeCreatePlaylistModal}
                    />
                )}

                {isAlbumModalOpen && selectedAlbum && (
                    <AlbumModal
                        isOpen={true}
                        onClose={closeAlbumModal}
                        albumName={selectedAlbum.title}
                        authorName={selectedAlbum.creator}
                        tracks={selectedAlbum.tracks}
                    />
                )}
            </div>
        </div>
    );
};

export default FavoritesPage;