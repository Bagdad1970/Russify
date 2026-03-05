import '../assets/styles/pages/HomePage.css';

import TrackCard from '../components/TrackCard.tsx';
import SearchBar from '../components/SearchBar.tsx';
import GridContainer from '../components/GridContainer.tsx';
import ColorTile from '../components/ColorTile.tsx';
import type {Playlist} from "../types/Playlist.ts";
import {PlaylistManager} from "../api/PlaylistManager.ts";
import {useEffect, useState} from "react";

const HomePage = ({
                      onOpenPlaylistModal,
                      onOpenSystemModal,
                      onOpenAlbumModal,
                      onOpenCreatePlaylistModal,
                  }) => {
    const playlistManager = new PlaylistManager();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);

    const loadPlaylists = async () => {
        try {
            setLoading(true);

            const foundPlaylists = await playlistManager.findAll();

            setPlaylists(foundPlaylists);
            setError(null);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to process query');
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadPlaylists();
    }, []);

    /*const playlists: Playlist[] = [
        { id: 1n, name: 'Системный плейлист', userId: 1n, isSystem: true, tracks: [{ name: 'Трек 1', artist: 'Исполнитель A' }, { name: 'Трек 2', artist: 'Исполнитель B' }] },
        { id: 2n, name: 'Плейлист 2', author: 'Автор 2', tracks: [{ name: 'Трек 3', artist: 'Исполнитель C' }] },
        { id: 3n, name: 'Плейлист 3', author: 'Автор 3', tracks: [] },
        { id: 4n, name: 'Плейлист 4', author: 'Автор 4', tracks: [{ name: 'Трек 4', artist: 'Исполнитель D' }, { name: 'Трек 5', artist: 'Исполнитель E' }] },
        { id: 5n, name: 'Плейлист 5', author: 'Автор 5', tracks: [] },
        { id: 6n, name: 'Плейлист 6', author: 'Автор 6', tracks: [] },
        { id: 7n, name: 'Плейлист 7', author: 'Автор 7', tracks: [] },
        { id: 8n, name: 'Плейлист 8', author: 'Автор 8', tracks: [] }
    ];
    */

    const handleTrackCardClick = () => {
        if (playlists.length > 0) {
            onOpenPlaylistModal(playlists[0]);
        }
    };

    const handleTileClick = (playlist) => {
        onOpenSystemModal(playlist);
    };

    const handleSearchClick = () => {
        onOpenAlbumModal();
    };

    return (
        <div className="home-page-container">
            <div className="main-content">
                <TrackCard title="Микс по настроениям" onClick={handleTrackCardClick} />
            </div>

            <div className="bottom-section">
                <SearchBar
                    placeholder="Введите название трека..."
                    value=""
                    onChange={() => {}}
                    onClick={handleSearchClick}
                />
                <div className="section-title">Музыкальные подборки под ваше настроение</div>
                <div className="scrollable-grid-container">
                    <GridContainer>
                        {playlists.map((playlist) => (
                            <ColorTile
                                key={playlist.id}
                                title={playlist.name}
                                onClick={() => handleTileClick(playlist)}
                            />
                        ))}
                    </GridContainer>
                </div>
            </div>
        </div>
    );
};

export default HomePage;