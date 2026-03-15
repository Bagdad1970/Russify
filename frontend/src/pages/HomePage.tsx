import '../assets/styles/pages/HomePage.css';

import TrackCard from '../components/TrackCard.tsx';
import SearchBar from '../components/SearchBar.tsx';
import GridContainer from '../components/GridContainer.tsx';
import ColorTile from '../components/ColorTile.tsx';
import PlaylistModal from '../components/PlaylistModal.tsx';
import AlbumModal from '../components/AlbumModal.tsx';
import type {Playlist} from "../types/Playlist.ts";
import type {Track} from "../types/Track.ts";
import type {Album} from "../types/Album.ts";
import type {PlaylistWithTracks} from "../types/PlaylistWithTracks.ts";
import {PlaylistManager} from "../api/PlaylistManager.ts";
import {TrackManager} from "../api/TrackManager.ts";
import {AlbumManager} from "../api/AlbumManager.ts";
import {useEffect, useState} from "react";

const HomePage = ({
                      onOpenPlaylistModal: parentOnOpenPlaylistModal,
                      onOpenSystemModal,
                      onOpenAlbumModal: parentOnOpenAlbumModal,
                      onOpenCreatePlaylistModal,
                  }) => {
    const playlistManager = new PlaylistManager();
    const trackManager = new TrackManager();
    const albumManager = new AlbumManager();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [searchText, setSearchText] = useState('');
    const [allAlbums, setAllAlbums] = useState<Album[]>([]);
    const [allTracks, setAllTracks] = useState<Track[]>([]);
    const [allPlaylists, setAllPlaylists] = useState<Playlist[]>([]);
    const [moodPlaylists, setMoodPlaylists] = useState<Playlist[]>([]);

    const [searchResults, setSearchResults] = useState<{
        tracks: Track[];
        albums: Album[];
        playlists: Playlist[];
    }>({
        tracks: [],
        albums: [],
        playlists: []
    });

    const [isSearching, setIsSearching] = useState(false);

    // Состояния для модалок
    const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
    const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);

    const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistWithTracks | null>(null);
    const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);

    useEffect(() => {
        loadAllData();
    }, []);

    const loadAllData = async () => {
        try {
            setLoading(true);

            const [tracks, albums, playlists] = await Promise.all([
                trackManager.findAll(),
                albumManager.findAll(),
                playlistManager.findAll()
            ]);

            setAllTracks(tracks);
            setAllAlbums(albums);
            setAllPlaylists(playlists);

            const moodPlaylistsFiltered = playlists.filter(p =>
                p.name?.toLowerCase().includes('микс') ||
                p.name?.toLowerCase().includes('настроение') ||
                p.name?.toLowerCase().includes('хит')
            ).slice(0, 10);

            setMoodPlaylists(moodPlaylistsFiltered.length > 0 ? moodPlaylistsFiltered : playlists.slice(0, 8));

        } catch (error) {
            console.error('Error loading data:', error);
            setError('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        if (!searchText.trim()) {
            setIsSearching(false);
            setSearchResults({
                tracks: [],
                albums: [],
                playlists: []
            });
            return;
        }

        setIsSearching(true);
        const searchQuery = searchText.toLowerCase().trim();

        const filteredTracks = allTracks.filter(track => {
            if (!track) return false;

            const trackName = track.name?.toLowerCase() || '';
            const trackArtist = track.artist?.toLowerCase() || '';
            const trackAlbum = track.album?.toLowerCase() || '';

            return trackName.includes(searchQuery) ||
                trackArtist.includes(searchQuery) ||
                trackAlbum.includes(searchQuery);
        });

        const filteredAlbums = allAlbums.filter(album => {
            if (!album) return false;

            const albumTitle = album.title?.toLowerCase() || '';
            const albumStatus = album.status?.toLowerCase() || '';

            return albumTitle.includes(searchQuery) ||
                albumStatus.includes(searchQuery);
        });

        const filteredPlaylists = allPlaylists.filter(playlist => {
            if (!playlist) return false;

            const playlistName = playlist.name?.toLowerCase() || '';
            const playlistDescription = playlist.description?.toLowerCase() || '';

            return playlistName.includes(searchQuery) ||
                playlistDescription.includes(searchQuery);
        });

        setSearchResults({
            tracks: filteredTracks,
            albums: filteredAlbums,
            playlists: filteredPlaylists
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleSearchChange = (text: string) => {
        setSearchText(text);
        if (!text.trim()) {
            setIsSearching(false);
            setSearchResults({
                tracks: [],
                albums: [],
                playlists: []
            });
        }
    };

    const handleTrackCardClick = () => {
        if (moodPlaylists.length > 0) {
            if (parentOnOpenPlaylistModal) {
                parentOnOpenPlaylistModal(moodPlaylists[0]);
            } else {
                openPlaylistModal(moodPlaylists[0].id);
            }
        }
    };

    const handleSystemTileClick = (playlist) => {
        onOpenSystemModal(playlist);
    };

    const handlePlaylistClick = async (playlist: Playlist) => {
        await openPlaylistModal(playlist.id);
    };

    const handleTrackClick = (track) => {
        console.log('Track clicked:', track);
    };

    const handleAlbumClick = async (album: Album) => {
        try {
            const fullAlbum = await albumManager.findAllTrackById(album.id);
            setSelectedAlbum(fullAlbum);
            setIsAlbumModalOpen(true);
        } catch (err) {
            console.error('Error loading album details:', err);
        }
    };

    // Функция для открытия модалки плейлиста
    const openPlaylistModal = async (playlistId: bigint) => {
        try {
            setLoading(true);
            // Получаем основную информацию о плейлисте
            const playlistInfo = await playlistManager.findById(playlistId);
            // Получаем треки плейлиста
            const tracks = await playlistManager.findTracksByPlaylistId(playlistId);

            // Объединяем в PlaylistWithTracks
            const playlistWithTracks: PlaylistWithTracks = {
                ...playlistInfo,
                tracks: tracks
            };

            setSelectedPlaylist(playlistWithTracks);
            setIsPlaylistModalOpen(true);
        } catch (err) {
            console.error('Error loading playlist details:', err);
            setError('Failed to load playlist');
        } finally {
            setLoading(false);
        }
    };

    const closePlaylistModal = () => {
        setIsPlaylistModalOpen(false);
        setSelectedPlaylist(null);
    };

    const closeAlbumModal = () => {
        setIsAlbumModalOpen(false);
        setSelectedAlbum(null);
    };

    const hasSearchResults = searchResults.tracks.length > 0 ||
        searchResults.albums.length > 0 ||
        searchResults.playlists.length > 0;

    return (
        <div className="home-page-container">
            <div className="main-content">
                <TrackCard
                    title="Микс по настроениям"
                    onClick={handleTrackCardClick}
                />
            </div>

            <div className="bottom-section">
                <SearchBar
                    placeholder="Введите название трека или исполнителя..."
                    value={searchText}
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyDown}
                />

                {loading && <div className="search-loading">Загрузка...</div>}
                {error && <div className="search-error">{error}</div>}

                {/* Режим поиска */}
                {!loading && !error && isSearching && (
                    <>
                        {hasSearchResults ? (
                            <div className="search-results">
                                {/* Треки */}
                                {searchResults.tracks.length > 0 && (
                                    <div className="search-section">
                                        <div className="section-title">Треки</div>
                                        <div className="scrollable-grid-container">
                                            <GridContainer>
                                                {searchResults.tracks.map((track) => (
                                                    <ColorTile
                                                        key={track.id}
                                                        title={track.name || 'Без названия'}
                                                        subtitle={track.artist || track.album || ''}
                                                        onClick={() => handleTrackClick(track)}
                                                    />
                                                ))}
                                            </GridContainer>
                                        </div>
                                    </div>
                                )}

                                {/* Альбомы */}
                                {searchResults.albums.length > 0 && (
                                    <div className="search-section">
                                        <div className="section-title">Альбомы</div>
                                        <div className="scrollable-grid-container">
                                            <GridContainer>
                                                {searchResults.albums.map((album) => (
                                                    <ColorTile
                                                        key={album.id}
                                                        title={album.title || 'Без названия'}
                                                        subtitle={`Статус: ${album.status === 'APPROVED' ? 'Опубликован' :
                                                            album.status === 'IN_PROGRESS' ? 'В процессе' :
                                                                'Отклонён'}`}
                                                        onClick={() => handleAlbumClick(album)}
                                                    />
                                                ))}
                                            </GridContainer>
                                        </div>
                                    </div>
                                )}

                                {/* Плейлисты */}
                                {searchResults.playlists.length > 0 && (
                                    <div className="search-section">
                                        <div className="section-title">Плейлисты</div>
                                        <div className="scrollable-grid-container">
                                            <GridContainer>
                                                {searchResults.playlists.map((playlist) => (
                                                    <ColorTile
                                                        key={playlist.id}
                                                        title={playlist.name || 'Без названия'}
                                                        subtitle="Плейлист"
                                                        onClick={() => handlePlaylistClick(playlist)}
                                                    />
                                                ))}
                                            </GridContainer>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="no-results">Ничего не найдено</div>
                        )}
                    </>
                )}

                {/* Начальная версия */}
                {!loading && !error && !isSearching && (
                    <>
                        <div className="section-title">Музыкальные подборки под ваше настроение</div>
                        <div className="scrollable-grid-container">
                            <GridContainer>
                                {moodPlaylists.map((playlist) => (
                                    <ColorTile
                                        key={playlist.id}
                                        title={playlist.name}
                                        onClick={() => handleSystemTileClick(playlist)}
                                    />
                                ))}
                            </GridContainer>
                        </div>
                    </>
                )}
            </div>

            {/* Модалка плейлиста */}
            {isPlaylistModalOpen && selectedPlaylist && (
                <PlaylistModal
                    isOpen={true}
                    onClose={closePlaylistModal}
                    selectedId={selectedPlaylist.id}
                />
            )}

            {/* Модалка альбома */}
            {isAlbumModalOpen && selectedAlbum && (
                <AlbumModal
                    isOpen={true}
                    onClose={closeAlbumModal}
                    albumName={String(selectedAlbum.title)}
                    authorName={selectedAlbum.authors?.[0]?.name || "Исполнитель"}
                    tracks={selectedAlbum.tracks || []}
                    albumAuthors={selectedAlbum.authors || []}
                />
            )}
        </div>
    );
};

export default HomePage;