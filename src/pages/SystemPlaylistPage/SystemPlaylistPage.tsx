

import React, { useState, useMemo, useCallback } from 'react';
import CreatePlaylistModal from '../../components/CreatePlaylistModal/CreatePlaylistModal';
import './SystemPlaylistsPage.css';

// Types
export interface SystemPlaylist {
    id: number;
    name: string;
    color: string;
    tracksCount: number;
    isDefault: boolean;
    description?: string;
}

interface SystemPlaylistsPageProps {
    onPlaylistUpdate?: (playlist: SystemPlaylist) => void;
    onPlaylistDelete?: (id: number) => void;
    onPlaylistCreate?: (playlist: Omit<SystemPlaylist, 'id'>) => void;
}

// Default system playlists
const DEFAULT_PLAYLISTS: SystemPlaylist[] = [
    { id: 1, name: 'Бодрость', color: '#00ffff', tracksCount: 42, isDefault: true, description: 'Энергичные треки для начала дня' },
    { id: 2, name: 'Динамика', color: '#ff0000', tracksCount: 38, isDefault: true, description: 'Активная музыка для тренировок' },
    { id: 3, name: 'Грусть', color: '#8b00ff', tracksCount: 56, isDefault: true, description: 'Лирические композиции' },
    { id: 4, name: 'Свежесть', color: '#90ee90', tracksCount: 29, isDefault: true, description: 'Лёгкие мелодии для расслабления' },
    { id: 5, name: 'Радость', color: '#ffff00', tracksCount: 64, isDefault: true, description: 'Позитивные хиты' },
];

const SystemPlaylistsPage: React.FC<SystemPlaylistsPageProps> = ({
                                                                     onPlaylistUpdate,
                                                                     onPlaylistDelete,
                                                                     onPlaylistCreate,
                                                                 }) => {
    const [playlists, setPlaylists] = useState<SystemPlaylist[]>(DEFAULT_PLAYLISTS);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedPlaylist, setSelectedPlaylist] = useState<SystemPlaylist | null>(null);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

    // Filter playlists based on search
    const filteredPlaylists = useMemo(() => {
        if (!searchQuery.trim()) return playlists;
        const query = searchQuery.toLowerCase();
        return playlists.filter(
            (p) =>
                p.name.toLowerCase().includes(query) ||
                p.description?.toLowerCase().includes(query)
        );
    }, [playlists, searchQuery]);

    // Handlers
    const handleOpenCreateModal = useCallback(() => {
        setModalMode('create');
        setSelectedPlaylist(null);
        setIsModalOpen(true);
    }, []);

    const handleOpenEditModal = useCallback((playlist: SystemPlaylist) => {
        setModalMode('edit');
        setSelectedPlaylist(playlist);
        setIsModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedPlaylist(null);
    }, []);

    // Обработчик сохранения из модалки
    const handleSavePlaylist = useCallback((updatedPlaylist: Partial<SystemPlaylist>) => {
        if (modalMode === 'edit' && selectedPlaylist) {
            // Обновляем существующий плейлист
            const updated: SystemPlaylist = {
                ...selectedPlaylist,
                ...updatedPlaylist, // применяем все изменённые поля
            };

            setPlaylists((prev) =>
                prev.map((p) => (p.id === selectedPlaylist.id ? updated : p))
            );
            onPlaylistUpdate?.(updated);
        } else {
            // Создаём новый плейлист
            const newPlaylist: SystemPlaylist = {
                id: Date.now(),
                name: updatedPlaylist.name || 'Новый плейлист',
                color: updatedPlaylist.color || '#666666',
                tracksCount: updatedPlaylist.tracksCount || 0,
                isDefault: false,
                description: updatedPlaylist.description || '',
            };

            setPlaylists((prev) => [...prev, newPlaylist]);
            onPlaylistCreate?.(newPlaylist);
        }
        handleCloseModal();
    }, [modalMode, selectedPlaylist, onPlaylistUpdate, onPlaylistCreate, handleCloseModal]);

    const handleDelete = useCallback(
        (playlist: SystemPlaylist) => {
            if (playlist.isDefault) {
                alert('Системные плейлисты нельзя удалить!');
                return;
            }

            if (window.confirm(`Удалить плейлист "${playlist.name}"?`)) {
                setPlaylists((prev) => prev.filter((p) => p.id !== playlist.id));
                onPlaylistDelete?.(playlist.id);
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
                {/* Search Bar */}
                <div className="search-section">
                    <div className="search-input-wrapper">
                        <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Поиск плейлистов..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="search-clear-btn"
                            >
                                ×
                            </button>
                        )}
                    </div>
                    <span className="search-results-count">
                        Найдено: {filteredPlaylists.length}
                    </span>
                </div>

                {/* Description */}
                <div className="playlists-description">
                    Музыкальные подборки под ваше настроение
                </div>

                {/* Playlists Grid */}
                <div className="playlists-grid">
                    {filteredPlaylists.map((playlist) => (
                        <div
                            key={playlist.id}
                            className="playlist-card"
                            style={{ backgroundColor: playlist.color }}
                            onClick={() => handleOpenEditModal(playlist)}
                        >
                            <div className="playlist-card-content">
                                <button className="playlist-play-btn" onClick={(e) => e.stopPropagation()}>
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </button>
                                <h3 className="playlist-name">{playlist.name}</h3>
                                <span className="playlist-tracks-count">
                                    {playlist.tracksCount} треков
                                </span>
                                {playlist.description && (
                                    <p className="playlist-description-text">
                                        {playlist.description}
                                    </p>
                                )}
                            </div>

                            <div className="playlist-actions">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenEditModal(playlist);
                                    }}
                                    className="playlist-action-btn edit"
                                    title="Редактировать"
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                    </svg>
                                </button>

                                {/* Кнопка удаления только для не-системных */}
                                {!playlist.isDefault && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(playlist);
                                        }}
                                        className="playlist-action-btn delete"
                                        title="Удалить"
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="3 6 5 6 21 6" />
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                        </svg>
                                    </button>
                                )}

                                {playlist.isDefault && (
                                    <span className="system-badge">Системный</span>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Add New Playlist Card */}
                    <div
                        className="playlist-card add-new"
                        onClick={handleOpenCreateModal}
                    >
                        <div className="add-new-content">
                            <svg className="add-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            <span className="add-new-text">Новый плейлист</span>
                        </div>
                    </div>
                </div>
            </div>

            <CreatePlaylistModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSavePlaylist}
                initialData={selectedPlaylist}
                mode={modalMode}
            />
        </div>
    );
};

export default SystemPlaylistsPage;