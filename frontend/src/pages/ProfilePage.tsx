import { useState, useEffect } from 'react';
import '../assets/styles/pages/ProfilePage.css';

import ProfileHeader from '../components/ProfileHeader.tsx';
import AlbumModal from '../components/AlbumModal.tsx';
import CreateAlbumOrTrackModal from '../components/CreateAlbumOrTrackModal.tsx';
import { UserManager } from '../api/UserManager.ts';
import { AlbumManager } from '../api/AlbumManager.ts';
import { FileManager } from '../api/FileManager.ts';
import type { Album } from '../types/Album.ts';
import noCover from '../assets/images/no-cover.svg';
import defaultAvatar from '../assets/images/no-cover.svg';

interface TokenPayload {
    userId?: number;
    sub?: string;
    email?: string;
    username?: string;
    avatarHash?: string;
    role?: string;
    iat?: number;
    exp?: number;
}

const ProfilePage = () => {
    const [albums, setAlbums] = useState<Album[]>([]);
    const [covers, setCovers] = useState<Record<string, string>>({});
    const [user, setUser] = useState<{
        id: number;
        email: string;
        username: string;
        avatarHash?: string;
    } | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const userManager = new UserManager();
    const albumManager = new AlbumManager();
    const fileManager = new FileManager();

    const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
    const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const getUserFromToken = (): TokenPayload | null => {
        const token = localStorage.getItem('auth_token');
        if (!token) return null;

        try {
            const payload = token.split('.')[1];
            const decoded = JSON.parse(atob(payload));
            return decoded;
        } catch (err) {
            console.error('Error parsing token:', err);
            return null;
        }
    };

    useEffect(() => {
        const loadUserData = async () => {
            const tokenData = getUserFromToken();
            if (tokenData) {
                const userData = {
                    id: tokenData.userId || 0,
                    email: tokenData.email || '',
                    username: tokenData.username || tokenData.sub || 'Пользователь',
                    avatarHash: tokenData.avatarHash
                };
                setUser(userData);

                if (userData.avatarHash) {
                    try {
                        console.log('🖼️ Loading avatar with hash:', userData.avatarHash);
                        const avatar = await fileManager.getFileUrl("images", userData.avatarHash);
                        if (avatar) {
                            console.log('✅ Avatar loaded:', avatar);
                            setAvatarUrl(avatar);
                        } else {
                            console.log('No avatar URL returned');
                            setAvatarUrl(defaultAvatar);
                        }
                    } catch (err) {
                        console.error('Error loading avatar:', err);
                        setAvatarUrl(defaultAvatar);
                    }
                } else {
                    setAvatarUrl(defaultAvatar);
                }
            }
        };

        loadUserData();
    }, []);

    useEffect(() => {
        const loadUserAlbums = async () => {
            try {
                setLoading(true);
                const userAlbums = await userManager.getUserAlbums();
                setAlbums(userAlbums);

                const coversMap: Record<string, string> = {};
                if (userAlbums.length > 0) {
                    await Promise.all(userAlbums.map(async (album) => {
                        if (album.coverHash) {
                            try {
                                const coverSrc = await fileManager.getFileUrl("images", album.coverHash);
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
    }, []);

    const openAlbumModal = async (album: Album) => {
        try {
            setLoading(true);
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

    const handleDeleteAlbum = async (e: React.MouseEvent, albumId: bigint, albumTitle: string) => {
        e.stopPropagation();

        if (!window.confirm(`Вы уверены, что хотите удалить альбом "${albumTitle}"? Это действие нельзя отменить.`)) {
            return;
        }

        try {
            await albumManager.deleteById(albumId);
            setAlbums(prev => prev.filter(a => a.id !== albumId));
            setCovers(prev => {
                const newCovers = { ...prev };
                delete newCovers[albumId.toString()];
                return newCovers;
            });
        } catch (err) {
            console.error('Error deleting album:', err);
            alert('Не удалось удалить альбом. Попробуйте позже.');
        }
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

    const getAlbumStatusStyle = (status?: string) => {
        const baseStyle: React.CSSProperties = {
            transition: 'box-shadow 0.2s, border-color 0.2s',
            border: '1px solid transparent',
            borderRadius: '8px'
        };

        if (status === 'APPROVED') {
            return {
                ...baseStyle,
                borderColor: '#4caf50',
                boxShadow: '0 0 8px rgba(76, 175, 80, 0.4)'
            };
        } else if (status === 'DENIED' || status === 'REJECTED') {
            return {
                ...baseStyle,
                borderColor: '#f44336',
                boxShadow: '0 0 8px rgba(244, 67, 54, 0.4)'
            };
        }

        return baseStyle;
    };

    return (
        <div className="profile-page-container">
            <ProfileHeader
                user={user}
                avatarUrl={avatarUrl || defaultAvatar}
            />

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
                        <div
                            key={album.id.toString()}
                            className="profile-album-card"
                            style={getAlbumStatusStyle(album.status)}
                            title={`Статус: ${album.status || 'Неизвестен'}`}
                        >
                            <div
                                className="album-cover"
                                onClick={() => openAlbumModal(album)}
                            >
                                <img
                                    src={covers[album.id.toString()] || noCover}
                                    alt={album.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={(e) => {
                                        e.currentTarget.src = noCover;
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
                                <div
                                    className="album-trash-icon"
                                    onClick={(e) => handleDeleteAlbum(e, album.id, album.title)}
                                    title="Удалить альбом"
                                    style={{ cursor: 'pointer' }}
                                >
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
                    album={selectedAlbum}
                />
            )}

            {isCreateModalOpen && (
                <CreateAlbumOrTrackModal
                    isOpen={true}
                    onClose={closeCreateModal}
                    mode="album"
                />
            )}
        </div>
    );
};

export default ProfilePage;