import React, { useState, useMemo, useCallback, useEffect } from 'react';
import '../assets/styles/pages/ModerationPage.css';
import SearchBar from '../components/SearchBar.tsx';
import GridContainer from '../components/GridContainer.tsx';
import AlbumCard from '../components/AlbumCard.tsx';
import AlbumModalModeration from '../components/AlbumModalModeration.tsx';
import type { Album } from '../types/Album.ts';
import { AlbumManager } from '../api/AlbumManager.ts';
import { FileManager } from '../api/FileManager.ts';
import noCover from '../assets/images/no-cover.svg';

type AlbumStatus = 'IN_PROGRESS' | 'APPROVED' | 'REJECTED';

interface ModerationPageProps {
    onModerateAlbum?: (album: Album, action: AlbumStatus) => void;
}

const ModerationPage: React.FC<ModerationPageProps> = ({ onModerateAlbum }) => {
    const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
    const [fullAlbumData, setFullAlbumData] = useState<Album | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const [albumsForModeration, setAlbumsForModeration] = useState<Album[]>([]);
    const [albumCovers, setAlbumCovers] = useState<Record<string, string>>({});

    const [loadingList, setLoadingList] = useState<boolean>(true);
    const [actionLoading, setActionLoading] = useState<boolean>(false);

    const albumManager = new AlbumManager();
    const fileManager = new FileManager();

    useEffect(() => {
        const loadAlbums = async () => {
            try {
                setLoadingList(true);
                const allAlbums = await albumManager.findAll();
                // Фильтруем только те, что на модерации
                const inProgress = allAlbums.filter(a => a.status === 'IN_PROGRESS');
                setAlbumsForModeration(inProgress);

                // Загружаем обложки для альбомов
                const coversMap: Record<string, string> = {};
                await Promise.all(inProgress.map(async (album) => {
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
                setAlbumCovers(coversMap);

            } catch (error) {
                console.error('Error loading albums:', error);
                alert('Не удалось загрузить список альбомов');
            } finally {
                setLoadingList(false);
            }
        };
        loadAlbums();
    }, []);

    const handleOpenModal = useCallback(async (album: Album) => {
        try {
            setActionLoading(true);
            const fullData = await albumManager.findAllTrackById(album.id);
            setFullAlbumData(fullData);
            setSelectedAlbum(album);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error loading album details:', error);
            alert('Ошибка при загрузке данных альбома');
        } finally {
            setActionLoading(false);
        }
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedAlbum(null);
        setFullAlbumData(null);
    }, []);

    const updateAlbumStatus = async (newStatus: 'APPROVED' | 'DENIED') => {
        if (!fullAlbumData) return;

        try {
            setActionLoading(true);

            const updatedAlbum = { ...fullAlbumData };
            updatedAlbum.status = newStatus;

            await albumManager.updateAlbumMultipart(updatedAlbum);

            onModerateAlbum?.(updatedAlbum, newStatus);

            setAlbumsForModeration(prev => prev.filter(a => a.id !== updatedAlbum.id));

            handleCloseModal();
        } catch (err: any) {
            console.error('Error updating album:', err);
            alert(`Ошибка при сохранении: ${err.message}`);
        } finally {
            setActionLoading(false);
        }
    };

    const handleApprove = () => updateAlbumStatus('APPROVED');
    const handleReject = () => updateAlbumStatus('DENIED');

    // Фильтрация для поиска
    const filteredAlbums = useMemo(() => {
        if (!globalFilter) return albumsForModeration;
        const search = globalFilter.toLowerCase();
        return albumsForModeration.filter(album =>
            album.title.toLowerCase().includes(search) ||
            (album.artist && album.artist.toLowerCase().includes(search)) ||
            (album.releasedAt && album.releasedAt.includes(globalFilter))
        );
    }, [albumsForModeration, globalFilter]);

    if (loadingList) {
        return <div className="moderation-page-container"><div className="loading-spinner">Загрузка...</div></div>;
    }

    return (
        <div className="moderation-page-container">
            <div className="moderation-header">
                <h1 className="moderation-title">Модерация альбомов</h1>
            </div>

            <div className="moderation-content">
                <SearchBar
                    placeholder="Поиск по названию, исполнителю..."
                    value={globalFilter}
                    onChange={setGlobalFilter}
                    onClick={() => {}}
                />

                <div className="moderation-stats">
                    <span className="stats-badge">На модерации: {albumsForModeration.length}</span>
                    {globalFilter && <span className="stats-badge secondary">Найдено: {filteredAlbums.length}</span>}
                </div>

                <div className="scrollable-grid-container">
                    <GridContainer>
                        {filteredAlbums.length > 0 ? (
                            filteredAlbums.map((album) => (
                                <AlbumCard
                                    key={String(album.id)}
                                    title={album.title}
                                    artist={album.artist || "Неизвестно"}
                                    year={new Date(album.releasedAt).getFullYear().toString()}
                                    cover={albumCovers[album.id.toString()]}
                                    onClick={() => handleOpenModal(album)}
                                />
                            ))
                        ) : (
                            <div className="no-albums-message">Альбомов на модерации нет</div>
                        )}
                    </GridContainer>
                </div>
            </div>

            {isModalOpen && fullAlbumData && (
                <AlbumModalModeration
                    album={fullAlbumData}
                    onClose={handleCloseModal}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    isLoading={actionLoading}
                />
            )}
        </div>
    );
};

export default ModerationPage;