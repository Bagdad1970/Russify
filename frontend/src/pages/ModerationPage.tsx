import React, { useState, useMemo, useCallback, useEffect } from 'react';
import '../assets/styles/pages/ModerationPage.css';
import {
    type ColumnDef,
    getCoreRowModel,
    getFilteredRowModel,
    useReactTable,
    type FilterFn,
    type SortingState,
    getSortedRowModel,
} from '@tanstack/react-table';
import SearchBar from '../components/SearchBar.tsx';
import GridContainer from '../components/GridContainer.tsx';
import AlbumCard from '../components/AlbumCard.tsx';
import AlbumModalModeration from '../components/AlbumModalModeration.tsx';
import {AlbumStatus} from "../types/AlbumStatus.ts";
import { AlbumManager } from '../api/AlbumManager.ts'; // Добавляем менеджер
import type { Album } from '../types/Album.ts'; // Импортируем тип Album

interface ModerationPageProps {
    onModerateAlbum?: (album: Album, action: AlbumStatus) => void;
}

// Кастомный фильтр для поиска по нескольким полям
const fuzzyTextFilterFn: FilterFn<Album> = (row, columnId, filterValue) => {
    const search = filterValue.toLowerCase();
    return (
        row.original.title.toLowerCase().includes(search) ||
        row.original.artist?.toLowerCase().includes(search) ||
        row.original.year?.includes(filterValue)
    );
};

const ModerationPage: React.FC<ModerationPageProps> = ({ onModerateAlbum }) => {
    // Состояния
    const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [albumsForModeration, setAlbumsForModeration] = useState<Album[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const albumManager = new AlbumManager();

    // Загружаем альбомы со статусом IN_PROGRESS
    useEffect(() => {
        const loadAlbumsForModeration = async () => {
            try {
                setLoading(true);
                // Получаем все альбомы
                const allAlbums = await albumManager.findAll();

                // Фильтруем только те, что в статусе IN_PROGRESS
                const inProgressAlbums = allAlbums.filter(
                    album => album.status === 'IN_PROGRESS'
                );

                setAlbumsForModeration(inProgressAlbums);
            } catch (error) {
                console.error('Error loading albums for moderation:', error);
            } finally {
                setLoading(false);
            }
        };

        loadAlbumsForModeration();
    }, []);

    // Обработчики модального окна
    const handleOpenModal = useCallback((album: Album) => {
        setSelectedAlbum(album);
        setIsModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedAlbum(null);
    }, []);

    const handleApprove = useCallback((album: Album) => {
        onModerateAlbum?.(album, 'APPROVED'); // Используем APPROVED как в БД
        // Обновляем список, убирая одобренный альбом
        setAlbumsForModeration(prev => prev.filter(a => a.id !== album.id));
        handleCloseModal();
    }, [onModerateAlbum, handleCloseModal]);

    const handleReject = useCallback((album: Album) => {
        onModerateAlbum?.(album, 'REJECTED'); // Используем REJECTED как в БД
        // Обновляем список, убирая отклонённый альбом
        setAlbumsForModeration(prev => prev.filter(a => a.id !== album.id));
        handleCloseModal();
    }, [onModerateAlbum, handleCloseModal]);

    // Колонки (для сортировки и фильтрации)
    const columns = useMemo<ColumnDef<Album>[]>(() => [
        { accessorKey: 'id', header: 'ID' },
        { accessorKey: 'title', header: 'Название' },
        { accessorKey: 'artist', header: 'Исполнитель' },
        { accessorKey: 'releasedAt', header: 'Дата релиза' },
        { accessorKey: 'status', header: 'Статус' },
    ], []);

    const table = useReactTable({
        data: albumsForModeration,
        columns,
        state: { globalFilter, sorting },
        globalFilterFn: fuzzyTextFilterFn,
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel()
    });

    // Получаем отфильтрованные данные для рендера
    const albumsToShow = table.getRowModel().rows.map(row => row.original);

    if (loading) {
        return (
            <div className="moderation-page-container">
                <div className="moderation-content">
                    <div className="loading-spinner">Загрузка альбомов...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="moderation-page-container">
            <div className="moderation-header">
                <h1 className="moderation-title">Модерация</h1>
            </div>

            <div className="moderation-content">
                <SearchBar
                    placeholder="Поиск по названию, исполнителю или году..."
                    value={globalFilter}
                    onChange={(value: string) => setGlobalFilter(value)}
                    onClick={() => {}}
                />

                <div className="moderation-stats">
                    <span className="stats-badge">
                        На модерации: {albumsForModeration.length}
                    </span>
                    {globalFilter && (
                        <span className="stats-badge secondary">
                            Найдено: {albumsToShow.length}
                        </span>
                    )}
                </div>

                <div className="scrollable-grid-container">
                    <GridContainer>
                        {albumsToShow.length > 0 ? (
                            albumsToShow.map((album) => (
                                <AlbumCard
                                    key={album.id.toString()}
                                    title={album.title}
                                    artist={album.artist || "Исполнитель"}
                                    year={new Date(album.releasedAt).getFullYear().toString()}
                                    cover={album.coverHash}
                                    onClick={() => handleOpenModal(album)}
                                />
                            ))
                        ) : (
                            <div className="no-albums-message">
                                Нет альбомов на модерации
                            </div>
                        )}
                    </GridContainer>
                </div>
            </div>

            {/* Модальное окно */}
            {isModalOpen && selectedAlbum && (
                <AlbumModalModeration
                    album={selectedAlbum}
                    onClose={handleCloseModal}
                    onApprove={handleApprove}
                    onReject={handleReject}
                />
            )}
        </div>
    );
};

export default ModerationPage;