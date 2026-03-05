import React, { useState, useMemo, useCallback } from 'react';
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

export interface Album {
    id: bigint;
    title: string;
    artist: string;
    year: string;
    cover: string | null;
    status: AlbumStatus;
}

interface ModerationPageProps {
    onModerateAlbum?: (album: Album, action: AlbumStatus) => void;
}

// 2. Кастомный фильтр для поиска по нескольким полям
const fuzzyTextFilterFn: FilterFn<Album> = (row, columnId, filterValue) => {
    const search = filterValue.toLowerCase();
    return (
        row.original.title.toLowerCase().includes(search) ||
        row.original.artist.toLowerCase().includes(search) ||
        row.original.year.includes(filterValue)
    );
};

const ModerationPage: React.FC<ModerationPageProps> = ({ onModerateAlbum }) => {
    // Состояния
    const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const [sorting, setSorting] = useState<SortingState>([]);

    // Моковые данные
    const albumsForModeration: Album[] = useMemo(() => [
        { id: 1, title: 'Альбом', artist: 'Исполнитель', year: '2024', cover: null, status: 'pending' },
        { id: 2, title: 'Альбом', artist: 'Исполнитель', year: '2023', cover: null, status: 'pending' },
        { id: 3, title: 'Альбром', artist: 'Исполнитель', year: '2024', cover: null, status: 'pending' },
        { id: 4, title: 'Вечерний', artist: 'Лунный свет', year: '2024', cover: null, status: 'pending' },
        { id: 5, title: 'Ночной дозор', artist: 'Мечтатели', year: '2023', cover: null, status: 'pending' },
        { id: 6, title: 'Рассвет', artist: 'Новое утро', year: '2024', cover: null, status: 'pending' },
        { id: 7, title: 'Классика', artist: 'Оркестр', year: '2022', cover: null, status: 'pending' },
        { id: 8, title: 'Электроника', artist: 'DJ Cool', year: '2024', cover: null, status: 'pending' },
        { id: 9, title: 'Джаз', artist: 'Саксофон', year: '2023', cover: null, status: 'pending' },
        { id: 10, title: 'Рок', artist: 'Группа', year: '2024', cover: null, status: 'pending' },
    ], []);

    // 3. Обработчики модального окна
    const handleOpenModal = useCallback((album: Album) => {
        setSelectedAlbum(album);
        setIsModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedAlbum(null);
    }, []);

    const handleApprove = useCallback((album: Album) => {
        onModerateAlbum?.(album, 'approved');
        handleCloseModal();
    }, [onModerateAlbum, handleCloseModal]);

    const handleReject = useCallback((album: Album) => {
        onModerateAlbum?.(album, 'rejected');
        handleCloseModal();
    }, [onModerateAlbum, handleCloseModal]);

    // 4. Колонки (для сортировки и фильтрации)
    const columns = useMemo<ColumnDef<Album>[]>(() => [
        { accessorKey: 'id', header: 'ID' },
        { accessorKey: 'title', header: 'Название' },
        { accessorKey: 'artist', header: 'Исполнитель' },
        { accessorKey: 'year', header: 'Год' },
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

    // 6. Получаем отфильтрованные данные для рендера
    const albumsToShow = table.getRowModel().rows.map(row => row.original);

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
                    <GridContainer children={undefined}>
                        {albumsToShow.map((album) => (
                            <AlbumCard
                                title={album.title}
                                artist={album.artist}
                                year={album.year}
                                cover={album.cover}
                                onClick={() => handleOpenModal(album)}
                            />
                        ))}
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