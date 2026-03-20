import React, { useState, useMemo, useCallback, useEffect } from 'react';
import CreatePlaylistModal from '../components/CreatePlaylistModal.tsx';
import PlaylistModal from '../components/PlaylistModal.tsx';
import '../assets/styles/pages/SystemPlaylistsPage.css';
import { PlaylistManager } from '../api/PlaylistManager.ts';
import type { Playlist } from '../types/Playlist.ts';
import type { Track } from '../types/Track.ts';
import type { PlaylistWithTracks } from '../types/PlaylistWithTracks.ts';

interface SystemPlaylistExtended extends Playlist {
    color?: string;
}

interface SystemPlaylistsPageProps {
    onPlaylistUpdate?: (playlist: SystemPlaylistExtended) => void;
    onPlaylistDelete?: (id: number) => void;
    onPlaylistCreate?: (playlist: SystemPlaylistExtended) => void;
}

const SystemPlaylistsPage: React.FC<SystemPlaylistsPageProps> = ({
                                                                     onPlaylistUpdate,
                                                                     onPlaylistDelete,
                                                                     onPlaylistCreate,
                                                                 }) => {
    const [playlists, setPlaylists] = useState<SystemPlaylistExtended[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

    // Состояния для просмотра
    const [selectedPlaylistData, setSelectedPlaylistData] = useState<PlaylistWithTracks | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    const playlistManager = new PlaylistManager();

    useEffect(() => {
        loadPlaylists();
    }, []);

    const loadPlaylists = async () => {
        try {
            setLoading(true);
            const all = await playlistManager.findAll();

            // ✅ ФИЛЬТРАЦИЯ: Оставляем только системные плейлисты
            const systemOnly = all.filter(p => p.isSystem === true);

            const withColors = systemOnly.map((p, index) => ({
                ...p,
                color: p.coverHash ? undefined : generateColor(p.id || index)
            }));
            setPlaylists(withColors);
        } catch (error) {
            console.error('Error loading system playlists:', error);
        } finally {
            setLoading(false);
        }
    };

    const generateColor = (seed: number | string) => {
        const colors = ['#00ffff', '#ff0055', '#8b00ff', '#90ee90', '#ffff00', '#ffaa00', '#ff66cc'];
        const num = typeof seed === 'number' ? seed : seed.charCodeAt(0);
        return colors[Math.abs(num) % colors.length];
    };

    const filteredPlaylists = useMemo(() => {
        if (!searchQuery.trim()) return playlists;
        const query = searchQuery.toLowerCase();
        return playlists.filter(
            (p) =>
                p.name?.toLowerCase().includes(query) ||
                (p as any).description?.toLowerCase().includes(query)
        );
    }, [playlists, searchQuery]);

    const handleOpenViewModal = useCallback(async (playlist: SystemPlaylistExtended) => {
        try {
            setLoading(true);
            const playlistInfo = await playlistManager.findById(playlist.id);
            const tracksResult = await playlistManager.findTracksByPlaylistId(playlist.id);
            const tracksArray = Array.isArray(tracksResult)
                ? tracksResult
                : (tracksResult as any)?.tracks || [];

            const playlistWithTracks: PlaylistWithTracks = {
                ...playlistInfo,
                tracks: tracksArray
            };

            setSelectedPlaylistData(playlistWithTracks);
            setIsViewModalOpen(true);
        } catch (err) {
            console.error('Error loading playlist details:', err);
            alert('Не удалось загрузить плейлист');
        } finally {
            setLoading(false);
        }
    }, []);

    const handleCloseViewModal = useCallback(() => {
        setIsViewModalOpen(false);
        setSelectedPlaylistData(null);
    }, []);

    const handleOpenCreateModal = useCallback(() => {
        setIsCreateModalOpen(true);
    }, []);

    const handleCloseCreateModal = useCallback(() => {
        setIsCreateModalOpen(false);
    }, []);

    const handleSavePlaylist = useCallback(async (data: any) => {
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            // ✅ СОЗДАНИЕ: Всегда создаем как системный
            formData.append('isSystem', 'true');

            if (data.coverFile) formData.append('coverFile', data.coverFile);
            if (data.trackIds && Array.isArray(data.trackIds)) {
                data.trackIds.forEach((id: number) => formData.append('trackIds', String(id)));
            }

            const created = await playlistManager.createMultipart(formData);
            const newPlaylist: SystemPlaylistExtended = {
                ...created,
                color: generateColor(created.id || Date.now()),
            };
            setPlaylists(prev => [...prev, newPlaylist]);
            onPlaylistCreate?.(newPlaylist);
            handleCloseCreateModal();
        } catch (err: any) {
            console.error('Error saving playlist:', err);
            alert(`Ошибка: ${err.message}`);
        }
    }, [onPlaylistCreate, handleCloseCreateModal]);

    const handleDelete = useCallback(
        async (playlist: SystemPlaylistExtended) => {
            if (!window.confirm(`Вы уверены, что хотите удалить системный плейлист "${playlist.name}"?`)) return;
            try {
                await playlistManager.deleteById(BigInt(playlist.id));
                setPlaylists(prev => prev.filter(p => p.id !== playlist.id));
                onPlaylistDelete?.(playlist.id);
            } catch (err) {
                alert('Не удалось удалить плейлист');
            }
        },
        [onPlaylistDelete]
    );

    return (
        <div className="system-playlists-page-container">
            <div className="system-playlists-header">
                <h1 className="system-playlists-title">Системные плейлисты</h1>
            </div>

            <div className="system-playlists-content">
                <div className="search-section">
                    <div className="search-input-wrapper">
                        <svg className="search-iconSPP" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                        </svg>
                        <input type="text" placeholder="Поиск..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="search-input" />
                        {searchQuery && <button onClick={() => setSearchQuery('')} className="search-clear-btnSPP">×</button>}
                    </div>
                    <span className="search-results-count">Найдено: {filteredPlaylists.length}</span>
                </div>

                <div className="playlists-description">Музыкальные подборки под ваше настроение</div>

                {loading ? (
                    <div className="loading-spinner">Загрузка...</div>
                ) : (
                    <div className="playlists-grid">
                        {filteredPlaylists.map((playlist) => (
                            <div
                                key={playlist.id}
                                className="playlist-card"
                                style={{ backgroundColor: playlist.color || '#333' }}
                                onClick={() => handleOpenViewModal(playlist)}
                            >
                                <div className="playlist-card-content">
                                    {(playlist as any).coverHash && (
                                        <img src={`http://localhost:9000/covers/${(playlist as any).coverHash}`} alt="" style={{position:'absolute', top:0, left:0, width:'100%', height:'100%', objectFit:'cover', opacity:0.3}} />
                                    )}

                                    <button
                                        className="playlist-play-btnSPP"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleOpenViewModal(playlist);
                                        }}
                                    >
                                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                                    </button>

                                    <h3 className="playlist-name">{playlist.name}</h3>
                                </div>

                                <div className="playlist-actions">
                                    {/* ✅ Кнопка удаления видна всегда, так как все плейлисты здесь системные */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(playlist);
                                        }}
                                        className="playlist-action-btnSPP delete"
                                        title="Удалить системный плейлист"
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="3 6 5 6 21 6" />
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                        </svg>
                                    </button>

                                    <span className="system-badge">Системный</span>
                                </div>
                            </div>
                        ))}

                        <div className="playlist-card add-new" onClick={handleOpenCreateModal}>
                            <div className="add-new-content">
                                <svg className="add-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                                <span className="add-new-text">Новый системный плейлист</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <CreatePlaylistModal
                isOpen={isCreateModalOpen}
                onClose={handleCloseCreateModal}
                onSave={handleSavePlaylist}
                mode="create"
                defaultIsSystem={true}
            />

            {isViewModalOpen && selectedPlaylistData && (
                <PlaylistModal
                    isOpen={true}
                    onClose={handleCloseViewModal}
                    playlistName={String(selectedPlaylistData.name)}
                    tracks={selectedPlaylistData.tracks || []}
                    playlistId={selectedPlaylistData.id ? Number(selectedPlaylistData.id) : undefined}
                    playlist={selectedPlaylistData}
                    coverHash={selectedPlaylistData.coverHash}
                    defaultIsSystem={true}
                />
            )}
        </div>
    );
};

export default SystemPlaylistsPage;