import React from 'react';
import './HomePage.css';

import TrackCard from '../../components/TrackCard/TrackCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import GridContainer from '../../components/GridContainer/GridContainer';
import ColorTile from '../../components/ColorTile/ColorTile';

const HomePage = ({
                      onOpenPlaylistModal,
                      onOpenSystemModal,
                      onOpenAlbumModal,
                      onOpenCreatePlaylistModal,
                  }) => {
    // Данные плейлистов
    const playlists = [
        { id: 1, color: '#00f0ff', title: 'Системный плейлист', author: 'Автор 1', tracks: [{ title: 'Трек 1', artist: 'Исполнитель A' }, { title: 'Трек 2', artist: 'Исполнитель B' }] },
        { id: 2, color: '#ff0000', title: 'Плейлист 2', author: 'Автор 2', tracks: [{ title: 'Трек 3', artist: 'Исполнитель C' }] },
        { id: 3, color: '#8000ff', title: 'Плейлист 3', author: 'Автор 3', tracks: [] },
        { id: 4, color: '#7fff7f', title: 'Плейлист 4', author: 'Автор 4', tracks: [{ title: 'Трек 4', artist: 'Исполнитель D' }, { title: 'Трек 5', artist: 'Исполнитель E' }] },
        { id: 5, color: '#00f0ff', title: 'Плейлист 5', author: 'Автор 5', tracks: [] },
        { id: 6, color: '#ff0000', title: 'Плейлист 6', author: 'Автор 6', tracks: [] },
        { id: 7, color: '#8000ff', title: 'Плейлист 7', author: 'Автор 7', tracks: [] },
        { id: 8, color: '#7fff7f', title: 'Плейлист 8', author: 'Автор 8', tracks: [] },
        { id: 9, color: '#00f0ff', title: 'Плейлист 9', author: 'Автор 9', tracks: [] },
        { id: 10, color: '#ff0000', title: 'Плейлист 10', author: 'Автор 10', tracks: [] },
        { id: 11, color: '#8000ff', title: 'Плейлист 11', author: 'Автор 11', tracks: [] },
        { id: 12, color: '#7fff7f', title: 'Плейлист 12', author: 'Автор 12', tracks: [] },
        { id: 13, color: '#00f0ff', title: 'Плейлист 13', author: 'Автор 13', tracks: [] },
        { id: 14, color: '#ff0000', title: 'Плейлист 14', author: 'Автор 14', tracks: [] },
        { id: 15, color: '#8000ff', title: 'Плейлист 15', author: 'Автор 15', tracks: [] },
        { id: 16, color: '#7fff7f', title: 'Плейлист 16', author: 'Автор 16', tracks: [] },
        { id: 17, color: '#00f0ff', title: 'Плейлист 17', author: 'Автор 17', tracks: [] },
        { id: 18, color: '#ff0000', title: 'Плейлист 18', author: 'Автор 18', tracks: [] },
        { id: 19, color: '#8000ff', title: 'Плейлист 19', author: 'Автор 19', tracks: [] },
        { id: 20, color: '#7fff7f', title: 'Плейлист 20', author: 'Автор 20', tracks: [] },
    ];

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
                                color={playlist.color}
                                title={playlist.title}
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