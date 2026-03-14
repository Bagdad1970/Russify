import { useState } from 'react';
import '../assets/styles/pages/ProfilePage.css';

import ProfileHeader from '../components/ProfileHeader.tsx';
import AlbumModal from '../components/AlbumModal.tsx';
import CreateAlbumOrTrackModal from '../components/CreateAlbumOrTrackModal.tsx';

const ProfilePage = () => {
    const albums = [
        { id: 1, title: "Альбом 1", date: "2025-01-15", color: "#00f0ff", tracks: [
                { title: "Трек 1", artist: "Исполнитель A", duration: 180 },
                { title: "Трек 2", artist: "Исполнитель B", duration: 210 },
                { title: "Трек 3", artist: "Исполнитель C", duration: 150 },
            ]},
        { id: 2, title: "Альбом 2", date: "2025-02-01", color: "#ff0000", tracks: [
                { title: "Трек 4", artist: "Исполнитель D", duration: 200 },
                { title: "Трек 5", artist: "Исполнитель E", duration: 170 },
            ]},
        { id: 3, title: "Альбом 3", date: "2025-02-10", color: "#8000ff", tracks: [
                { title: "Трек 6", artist: "Исполнитель F", duration: 190 },
            ]},
        { id: 4, title: "Альбом 4", date: "2025-02-18", color: "#7fff7f", tracks: []},
        { id: 5, title: "Альбом 5", date: "2025-02-20", color: "#00f0ff", tracks: []},
        { id: 6, title: "Альбом 6", date: "2025-02-22", color: "#ff0000", tracks: []},
        { id: 7, title: "Альбом 7", date: "2025-02-25", color: "#8000ff", tracks: []},
        { id: 8, title: "Альбом 8", date: "2025-02-28", color: "#7fff7f", tracks: []},
    ];

    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const openAlbumModal = (album) => {
        setSelectedAlbum(album);
        setIsAlbumModalOpen(true);
    };

    const closeAlbumModal = () => {
        setIsAlbumModalOpen(false);
        setSelectedAlbum(null);
    };

    const openCreateModal = () => {
        setIsCreateModalOpen(true);
    };

    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
    };

    const formatDate = (dateStr) => {
        const months = [
            "января", "февраля", "марта", "апреля", "мая", "июня",
            "июля", "августа", "сентября", "октября", "ноября", "декабря"
        ];
        const d = new Date(dateStr);
        const day = String(d.getDate()).padStart(2, '0');
        const month = months[d.getMonth()];
        const year = d.getFullYear();
        return `${day} ${month} ${year}`;
    };

    return (
        <div className="profile-page-container">
            <ProfileHeader />

            <div className="profile-bottom-section">
                <div className="profile-albums-header">
                    <div className="profile-albums-title">Мои альбомы</div>
                    <button className="profile-add-album-btn" onClick={openCreateModal}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                        </svg>
                    </button>
                </div>

                <div className="profile-albums-grid">
                    {albums.map((album) => (
                        <div key={album.id} className="profile-album-card">
                            <div
                                className="album-cover"
                                style={{ backgroundColor: album.color }}
                                onClick={() => openAlbumModal(album)}
                            >
                                <div
                                    className="album-cover-play-button"
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
            </div>

            {isAlbumModalOpen && selectedAlbum && (
                <AlbumModal
                    isOpen={true}
                    onClose={closeAlbumModal}
                    albumName={selectedAlbum.title}
                    authorName="Автор"
                    tracks={selectedAlbum.tracks}
                />
            )}

            {isCreateModalOpen && (
                <CreateAlbumOrTrackModal
                    isOpen={true}
                    onClose={closeCreateModal}
                    mode="track"
                />
            )}
        </div>
    );
};

export default ProfilePage;