// src/pages/AdminDashboard.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    type ColumnDef,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
    flexRender,
} from '@tanstack/react-table';
import SearchBar from '../components/SearchBar.tsx';

import { GenreManager } from '../api/GenreManager.ts';
import { PlaylistManager } from '../api/PlaylistManager.ts';
import { AlbumManager } from '../api/AlbumManager.ts';
import { TrackManager } from '../api/TrackManager.ts';
import { AuthorManager } from '../api/AuthorManager.ts';

import type { Genre } from '../types/Genre';
import type { Playlist } from '../types/Playlist';
import type { Album } from '../types/Album';
import type { Track } from '../types/Track';
import type { Author } from '../types/Author';

import '../assets/styles/pages/AdminDashboard.css';

const tableConfigs = {
    genres: {
        displayName: 'Жанры',
        manager: new GenreManager(),
        pk: 'id',
        columns: [
            { accessorKey: 'id', header: 'ID' },
            { accessorKey: 'name', header: 'Название' },
        ] as ColumnDef<Genre>[],
    },
    playlists: {
        displayName: 'Плейлисты',
        manager: new PlaylistManager(),
        pk: 'id',
        columns: [
            { accessorKey: 'id', header: 'ID' },
            { accessorKey: 'name', header: 'Название' },
            { accessorKey: 'userId', header: 'ID владельца' },
            { accessorKey: 'isSystem', header: 'Системный', cell: info => (info.getValue() ? 'Да' : 'Нет') },
        ] as ColumnDef<Playlist>[],
    },
    albums: {
        displayName: 'Альбомы',
        manager: new AlbumManager(),
        pk: 'id',
        columns: [
            { accessorKey: 'id', header: 'ID' },
            { accessorKey: 'title', header: 'Название' },
            { accessorKey: 'albumTypeId', header: 'Тип альбома (ID)' },
            { accessorKey: 'releasedAt', header: 'Дата релиза' },
        ] as ColumnDef<Album>[],
    },
    tracks: {
        displayName: 'Треки',
        manager: new TrackManager(),
        pk: 'id',
        columns: [
            { accessorKey: 'id', header: 'ID' },
            { accessorKey: 'name', header: 'Название' },
            { accessorKey: 'genreId', header: 'Жанр (ID)' },
            { accessorKey: 'coverHash', header: 'Обложка (hash)' },
            { accessorKey: 'audioHash', header: 'Аудио (hash)' },
        ] as ColumnDef<Track>[],
    },
    authors: {
        displayName: 'Авторы',
        manager: new AuthorManager(),
        pk: 'id',
        columns: [
            { accessorKey: 'id', header: 'ID' },
            { accessorKey: 'name', header: 'Имя' },
            { accessorKey: 'photoFilepath', header: 'Фото' },
            { accessorKey: 'description', header: 'Описание' },
        ] as ColumnDef<Author>[],
    },
    // users: { ... } → добавь когда будет UserManager и эндпоинты
} as const;

type TableKey = keyof typeof tableConfigs;

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();

    const tableKeys = Object.keys(tableConfigs) as TableKey[];

    const [selectedTable, setSelectedTable] = useState<TableKey>('genres');
    const currentConfig = tableConfigs[selectedTable];

    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [globalFilter, setGlobalFilter] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any | null>(null);
    const [formValues, setFormValues] = useState<Record<string, any>>({});

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);
            try {
                const items = await currentConfig.manager.findAll();
                setData(items);
            } catch (err: any) {
                console.error(err);
                setError('Не удалось загрузить данные');
                alert('Ошибка загрузки: ' + (err.message || 'Неизвестная ошибка'));
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [selectedTable]);

    const columns = useMemo<ColumnDef<any>[]>(() => {
        return [
            ...currentConfig.columns,
            {
                id: 'actions',
                header: 'Действия',
                cell: ({ row }) => (
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={() => handleEdit(row.original)}
                            style={{ background: '#0d6efd', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px' }}
                        >
                            Изменить
                        </button>
                        <button
                            onClick={() => handleDelete(row.original)}
                            style={{ background: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px' }}
                        >
                            Удалить
                        </button>
                    </div>
                ),
            },
        ];
    }, [currentConfig]);

    const table = useReactTable({
        data,
        columns,
        state: { globalFilter },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const handleEdit = (item: any) => {
        setEditingItem(item);
        setFormValues({ ...item });
        setModalOpen(true);
    };

    const handleDelete = async (item: any) => {
        if (!window.confirm(`Удалить запись #${item[currentConfig.pk]}?`)) return;
        try {
            await currentConfig.manager.deleteById(item[currentConfig.pk]);
            setData(prev => prev.filter(r => r[currentConfig.pk] !== item[currentConfig.pk]));
            alert('Запись удалена');
        } catch (err: any) {
            console.error(err);
            alert('Ошибка удаления: ' + (err.message || 'Неизвестная ошибка'));
        }
    };

    const handleAddNew = () => {
        setEditingItem(null);
        const empty = {} as Record<string, any>;
        currentConfig.columns.forEach(c => {
            const key = c.accessorKey as string;
            if (key !== currentConfig.pk) empty[key] = '';
        });
        setFormValues(empty);
        setModalOpen(true);
    };

    const handleSave = async () => {
        try {
            let savedItem;
            if (editingItem) {
                const updated = { ...editingItem, ...formValues };
                savedItem = await currentConfig.manager.update(updated);
                setData(prev =>
                    prev.map(r => r[currentConfig.pk] === savedItem[currentConfig.pk] ? savedItem : r)
                );
            } else {
                savedItem = await currentConfig.manager.create(formValues);
                setData(prev => [...prev, savedItem]);
            }
            setModalOpen(false);
            alert(editingItem ? 'Запись обновлена' : 'Запись создана');
        } catch (err: any) {
            console.error(err);
            alert('Ошибка сохранения: ' + (err.message || 'Неизвестная ошибка'));
        }
    };

    return (
        <div className="admin-dashboard">
            <div className="admin-sidebar">
                <h2 style={{ margin: '0 0 24px 0' }}>Админ-панель</h2>
                {tableKeys.map(key => (
                    <button
                        key={key}
                        className={selectedTable === key ? 'active' : ''}
                        onClick={() => setSelectedTable(key)}
                        style={{
                            width: '100%',
                            padding: '12px',
                            marginBottom: '8px',
                            textAlign: 'left',
                            background: selectedTable === key ? '#0d6efd' : '#2c2c2c',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                        }}
                    >
                        {tableConfigs[key].displayName}
                    </button>
                ))}
                <button
                    onClick={() => navigate('/')}
                    style={{
                        marginTop: 'auto',
                        padding: '12px',
                        background: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                    }}
                >
                    На главную
                </button>
            </div>

            <div className="admin-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h1>{currentConfig.displayName}</h1>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <SearchBar
                            placeholder={`Поиск по ${currentConfig.displayName.toLowerCase()}...`}
                            value={globalFilter}
                            onChange={setGlobalFilter}
                        />
                        <button
                            onClick={handleAddNew}
                            style={{
                                padding: '10px 20px',
                                background: '#198754',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                            }}
                        >
                            + Добавить
                        </button>
                    </div>
                </div>

                {loading && <p>Загрузка...</p>}
                {error && <p style={{ color: '#dc3545' }}>{error}</p>}

                {!loading && !error && (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th
                                        key={header.id}
                                        style={{
                                            padding: '12px',
                                            background: '#2c2c2c',
                                            textAlign: 'left',
                                            cursor: header.column.getCanSort() ? 'pointer' : 'default',
                                        }}
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                        </thead>
                        <tbody>
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} style={{ padding: '12px', borderBottom: '1px solid #444' }}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}

                {/* Модалка — без изменений */}
                {modalOpen && (
                    <div
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(0,0,0,0.7)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000,
                        }}
                        onClick={() => setModalOpen(false)}
                    >
                        <div
                            style={{
                                background: '#1e1e1e',
                                padding: '24px',
                                borderRadius: '12px',
                                width: '90%',
                                maxWidth: '700px',
                                maxHeight: '90vh',
                                overflowY: 'auto',
                            }}
                            onClick={e => e.stopPropagation()}
                        >
                            <h2>{editingItem ? 'Редактировать' : 'Создать'} запись</h2>

                            <div style={{ display: 'grid', gap: '16px', margin: '24px 0' }}>
                                {currentConfig.columns.map(col => {
                                    const key = col.accessorKey as string;
                                    if (key === currentConfig.pk && !editingItem) return null;

                                    return (
                                        <div key={key}>
                                            <label style={{ display: 'block', marginBottom: '6px' }}>{col.header}</label>
                                            <input
                                                type="text"
                                                value={formValues[key] ?? ''}
                                                onChange={e => setFormValues(prev => ({ ...prev, [key]: e.target.value }))}
                                                style={{
                                                    width: '100%',
                                                    padding: '10px',
                                                    background: '#2c2c2c',
                                                    border: '1px solid #444',
                                                    borderRadius: '6px',
                                                    color: 'white',
                                                }}
                                            />
                                        </div>
                                    );
                                })}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                <button
                                    onClick={() => setModalOpen(false)}
                                    style={{ padding: '10px 20px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '6px' }}
                                >
                                    Отмена
                                </button>
                                <button
                                    onClick={handleSave}
                                    style={{ padding: '10px 20px', background: '#0d6efd', color: 'white', border: 'none', borderRadius: '6px' }}
                                >
                                    Сохранить
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;