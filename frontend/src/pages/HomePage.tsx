import '../assets/styles/pages/HomePage.css';
import TrackCard from '../components/TrackCard.tsx';
import SearchBar from '../components/SearchBar.tsx';
import GridContainer from '../components/GridContainer.tsx';
import ColorTile from '../components/ColorTile.tsx';
import PlaylistModal from '../components/PlaylistModal.tsx';
import AlbumModal from '../components/AlbumModal.tsx';
import type { Playlist } from "../types/Playlist.ts";
import type { Track } from "../types/Track.ts";
import type { Album } from "../types/Album.ts";
import type { PlaylistWithTracks } from "../types/PlaylistWithTracks.ts";
import { PlaylistManager } from "../api/PlaylistManager.ts";
import { TrackManager } from "../api/TrackManager.ts";
import { AlbumManager } from "../api/AlbumManager.ts";
import { FileManager } from "../api/FileManager.ts";
import { useEffect, useState } from "react";
import {useFavorites} from "../hooks/useFavorites.ts";

const playlistManager = new PlaylistManager();
const trackManager = new TrackManager();
const albumManager = new AlbumManager();
const fileManager = new FileManager();

const HomePage = ({
                      onOpenPlaylistModal: parentOnOpenPlaylistModal,
                      onOpenSystemModal,
                      onOpenAlbumModal: parentOnOpenAlbumModal,
                      onOpenCreatePlaylistModal,
                  }) => {

    const { favoriteTrackIds, favoriteAlbumIds, removeFavoriteTrack, removeFavoriteAlbum, loadFavorites } = useFavorites();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [searchText, setSearchText] = useState('');
    const [allAlbums, setAllAlbums] = useState<Album[]>([]);
    const [allTracks, setAllTracks] = useState<Track[]>([]);
    const [allPlaylists, setAllPlaylists] = useState<Playlist[]>([]);
    const [moodPlaylists, setMoodPlaylists] = useState<Playlist[]>([]);
    const [albumCovers, setAlbumCovers] = useState<Record<string, string>>({});
    const [playlistCovers, setPlaylistCovers] = useState<Record<string, string>>({});
    const [trackCovers, setTrackCovers] = useState<Record<string, string>>({});

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

    const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
    const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);

    const [selectedPlaylistData, setSelectedPlaylistData] = useState<PlaylistWithTracks | null>(null);
    const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);

    useEffect(() => {
        loadAllData();
        loadFavorites();
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

            const trackCoversMap: Record<string, string> = {};
            await Promise.all(tracks.map(async (track) => {
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

            const approvedAlbums = albums.filter(album => album.status === 'APPROVED');
            setAllAlbums(approvedAlbums);

            const albumCoversMap: Record<string, string> = {};
            await Promise.all(approvedAlbums.map(async (album) => {
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

            // Загружаем обложки для плейлистов
            const playlistCoversMap: Record<string, string> = {};
            await Promise.all(playlists.map(async (playlist) => {
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
            setSearchResults({ tracks: [], albums: [], playlists: [] });
            return;
        }

        setIsSearching(true);
        const searchQuery = searchText.toLowerCase().trim();

        const filteredTracks = allTracks.filter(track => {
            if (!track) return false;
            const trackName = track.name?.toLowerCase() || '';
            const trackArtist = track.artist?.toLowerCase() || '';
            const trackAlbum = track.album?.toLowerCase() || '';
            return trackName.includes(searchQuery) || trackArtist.includes(searchQuery) || trackAlbum.includes(searchQuery);
        });

        const filteredAlbums = allAlbums.filter(album => {
            if (!album) return false;
            const albumTitle = album.title?.toLowerCase() || '';
            const albumStatus = album.status?.toLowerCase() || '';
            return albumTitle.includes(searchQuery) || albumStatus.includes(searchQuery);
        });

        const filteredPlaylists = allPlaylists.filter(playlist => {
            if (!playlist) return false;
            const playlistName = playlist.name?.toLowerCase() || '';
            const playlistDescription = playlist.description?.toLowerCase() || '';
            return playlistName.includes(searchQuery) || playlistDescription.includes(searchQuery);
        });

        setSearchResults({ tracks: filteredTracks, albums: filteredAlbums, playlists: filteredPlaylists });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSearch();
    };

    const handleSearchChange = (text: string) => {
        setSearchText(text);
        if (!text.trim()) {
            setIsSearching(false);
            setSearchResults({ tracks: [], albums: [], playlists: [] });
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
        openPlaylistModal(playlist.id);
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

    const openPlaylistModal = async (playlistId: bigint | number) => {
        try {
            setLoading(true);
            setError(null);

            const playlistInfo = await playlistManager.findById(playlistId);

            const tracksResult = await playlistManager.findTracksByPlaylistId(playlistId);

            const tracksArray = Array.isArray(tracksResult) ? tracksResult : (tracksResult?.tracks || []);

            const playlistWithTracks: PlaylistWithTracks = {
                ...playlistInfo,
                tracks: tracksArray
            };

            setSelectedPlaylistData(playlistWithTracks);
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
        setSelectedPlaylistData(null);
    };

    const closeAlbumModal = () => {
        setIsAlbumModalOpen(false);
        setSelectedAlbum(null);
    };

    const hasSearchResults = searchResults.tracks.length > 0 || searchResults.albums.length > 0 || searchResults.playlists.length > 0;

    return (
        <div className="home-page-container">
            <div className="main-content">
                <TrackCard title="Микс по настроениям" onClick={handleTrackCardClick} />
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

                {!loading && !error && isSearching && (
                    <>
                        {hasSearchResults ? (
                            <div className="search-results">
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
                                                        imageUrl={trackCovers[track.id.toString()]}
                                                        onClick={() => handleTrackClick(track)}
                                                    />
                                                ))}
                                            </GridContainer>
                                        </div>
                                    </div>
                                )}
                                {searchResults.albums.length > 0 && (
                                    <div className="search-section">
                                        <div className="section-title">Альбомы</div>
                                        <div className="scrollable-grid-container">
                                            <GridContainer>
                                                {searchResults.albums.map((album) => (
                                                    <ColorTile
                                                        key={album.id}
                                                        title={album.title || 'Без названия'}
                                                        subtitle={`Статус: ${album.status === 'APPROVED' ? 'Опубликован' : album.status === 'IN_PROGRESS' ? 'В процессе' : 'Отклонён'}`}
                                                        imageUrl={albumCovers[album.id.toString()]}
                                                        onClick={() => handleAlbumClick(album)}
                                                    />
                                                ))}
                                            </GridContainer>
                                        </div>
                                    </div>
                                )}
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
                                                        imageUrl={playlistCovers[playlist.id.toString()]}
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

                {!loading && !error && !isSearching && (
                    <>
                        <div className="section-title">Музыкальные подборки под ваше настроение</div>
                        <div className="scrollable-grid-container">
                            <GridContainer>
                                {moodPlaylists.map((playlist) => (
                                    <ColorTile
                                        key={playlist.id}
                                        title={playlist.name}
                                        imageUrl={playlistCovers[playlist.id.toString()]}
                                        onClick={() => handleSystemTileClick(playlist)}
                                    />
                                ))}
                            </GridContainer>
                        </div>
                    </>
                )}
            </div>

            {isPlaylistModalOpen && selectedPlaylistData && (
                <PlaylistModal
                    isOpen={true}
                    onClose={closePlaylistModal}
                    playlistName={String(selectedPlaylistData.name)}
                    tracks={selectedPlaylistData.tracks || []}
                    playlistId={selectedPlaylistData.id}
                    playlist={selectedPlaylistData}
                    coverHash={selectedPlaylistData.coverHash}
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
                    album={selectedAlbum}
                />
            )}
        </div>
    );
};

export default HomePage;