import { useState, useEffect } from 'react';
import '../assets/styles/pages/ProfilePage.css';

import ProfileHeader from '../components/ProfileHeader.tsx';
import AlbumModal from '../components/AlbumModal.tsx';
import CreateAlbumOrTrackModal from '../components/CreateAlbumOrTrackModal.tsx';
import { UserManager } from '../api/UserManager.ts';
import { AlbumManager } from '../api/AlbumManager.ts';
import { FileManager } from '../api/FileManager.ts';
import type { Album } from '../types/Album.ts';
import type { FileGetRequest } from '../types/request/FileGetRequest.ts';
import noCoverPlaylist from '../assets/images/no-cover-playlist.svg';

const ProfilePage = () => {
    const [albums, setAlbums] = useState<Album[]>([]);
    const [covers, setCovers] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const userManager = new UserManager();
    const albumManager = new AlbumManager();
    const fileManager = new FileManager();

    const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
    const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Загрузка реальных альбомов пользователя
    useEffect(() => {
        const loadUserAlbums = async () => {
            try {
                setLoading(true);
                const userAlbums = await userManager.getUserAlbums();
                setAlbums(userAlbums);

                // Загружаем обложки для альбомов
                const coversMap: Record<string, string> = {};

                if (userAlbums.length > 0) {
                    await Promise.all(userAlbums.map(async (album) => {
                        if (album.coverHash) {
                            try {
                                const fileGetRequest: FileGetRequest = {
                                    bucket: "covers",
                                    hash: album.coverHash
                                };
                                const coverSrc = await fileManager.getFileUrl(fileGetRequest);
                                if (coverSrc) {
                                    coversMap[album.id.toString()] = coverSrc;
                                }
                            } catch (err) {
                                console.log(`Error loading cover for album ${album.id}:`, err);
                            }
                        }
                    }));
                }
                setCovers(coversMap);

            } catch (err) {
                console.error('Error loading user albums:', err);
                setAlbums([]);
            } finally {
                setLoading(false);
            }
        };

        loadUserAlbums();

        // Очистка URL при размонтировании
        return () => {
            Object.values(covers).forEach(url => {
                if (url) fileManager.revokeFileUrl(url);
            });
        };
    }, []);

    const openAlbumModal = async (album: Album) => {
        try {
            setLoading(true);
            // Загружаем полные данные альбома с треками (как в HomePage)
            const fullAlbum = await albumManager.findAllTrackById(album.id);
            setSelectedAlbum(fullAlbum);
            setIsAlbumModalOpen(true);
        } catch (err) {
            console.error('Error loading album details:', err);
        } finally {
            setLoading(false);
        }
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

    const formatDate = (dateStr: string | Date) => {
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

                {loading && <div className="profile-loading">Загрузка...</div>}

                <div className="profile-albums-grid">
                    {albums.map((album) => (
                        <div key={album.id.toString()} className="profile-album-card">
                            <div
                                className="album-cover"
                                onClick={() => openAlbumModal(album)}
                            >
                                <img
                                    src={covers[album.id.toString()] || noCoverPlaylist}
                                    alt={album.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={(e) => {
                                        e.currentTarget.src = noCoverPlaylist;
                                    }}
                                />
                                <div
                                    className="album-cover-play-button"
                                    onClick={(e) => {
                                        e.stopPropagation();
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
                                        <span>{formatDate(album.releasedAt)}</span>
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
                    albumName={String(selectedAlbum.title)}
                    authorName={selectedAlbum.authors?.[0]?.name || "Автор"}
                    tracks={selectedAlbum.tracks || []}
                    albumAuthors={selectedAlbum.authors || []}
                    albumId={selectedAlbum.id}
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