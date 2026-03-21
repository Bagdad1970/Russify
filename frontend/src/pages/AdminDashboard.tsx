import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
import { FileManager } from '../api/FileManager.ts';

import type { Genre } from '../types/Genre';
import type { Playlist } from '../types/Playlist';
import type { Album } from '../types/Album';
import type { Track } from '../types/Track';
import type { Author } from '../types/Author';

import '../assets/styles/pages/AdminDashboard.css';

const fileManager = new FileManager();

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
            { accessorKey: 'isSystem', header: 'Системный', cell: ({ getValue }) => (getValue() ? 'Да' : 'Нет') },
            {
                accessorKey: 'coverHash',
                header: 'Обложка',
                cell: ({ getValue }) => {
                    const hash = getValue();
                    if (!hash) return '—';
                    return (
                        <img
                            src={`http://localhost:9000/images/${hash}`}
                            alt="cover"
                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                    );
                }
            },
        ] as ColumnDef<Playlist>[],
    },
    albums: {
        displayName: 'Альбомы',
        manager: new AlbumManager(),
        pk: 'id',
        columns: [
            { accessorKey: 'id', header: 'ID' },
            { accessorKey: 'title', header: 'Название' },
            { accessorKey: 'albumTypeId', header: 'Тип альбома' },
            { accessorKey: 'releasedAt', header: 'Дата релиза', cell: ({ getValue }) => {
                    const date = getValue() as string | number | Date | null | undefined;
                    return date ? new Date(date).toLocaleDateString('ru-RU') : '—';
                } },
            { accessorKey: 'status', header: 'Статус' },
            {
                accessorKey: 'coverHash',
                header: 'Обложка',
                cell: ({ getValue }) => {
                    const hash = getValue();
                    if (!hash) return '—';
                    return (
                        <img
                            src={`http://localhost:9000/images/${hash}`}
                            alt="cover"
                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                    );
                }
            },
        ] as ColumnDef<Album>[],
    },
    tracks: {
        displayName: 'Треки',
        manager: new TrackManager(),
        pk: 'id',
        columns: [
            { accessorKey: 'id', header: 'ID' },
            { accessorKey: 'name', header: 'Название' },
            { accessorKey: 'genreId', header: 'Жанр ID' },
            { accessorKey: 'duration', header: 'Длительность', cell: ({ getValue }) => {
                    const sec = Number((getValue() as number | string | null | undefined) ?? 0);
                    if (!sec) return '—';
                    const mins = Math.floor(sec / 60);
                    const secs = sec % 60;
                    return `${mins}:${secs.toString().padStart(2, '0')}`;
                } },
            {
                accessorKey: 'coverHash',
                header: 'Обложка',
                cell: ({ getValue }) => {
                    const hash = getValue();
                    if (!hash) return '—';
                    return (
                        <img
                            src={`http://localhost:9000/images/${hash}`}
                            alt="cover"
                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                    );
                }
            },
        ] as ColumnDef<Track>[],
    },
    authors: {
        displayName: 'Авторы',
        manager: new AuthorManager(),
        pk: 'id',
        columns: [
            { accessorKey: 'id', header: 'ID' },
            { accessorKey: 'name', header: 'Имя' },
            {
                accessorKey: 'photoHash',
                header: 'Фото',
                cell: ({ getValue }) => {
                    const hash = getValue();
                    if (!hash) return '—';
                    return (
                        <img
                            src={`http://localhost:9000/images/${hash}`}
                            alt="photo"
                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%' }}
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                    );
                }
            },
            { accessorKey: 'description', header: 'Описание' },
        ] as ColumnDef<Author>[],
    },
} as const;

type TableKey = keyof typeof tableConfigs;

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const tableKeys = Object.keys(tableConfigs) as TableKey[];

    const [selectedTable, setSelectedTable] = useState<TableKey>('genres');
    const currentConfig = tableConfigs[selectedTable] as any;

    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any | null>(null);
    const [formValues, setFormValues] = useState<Record<string, any>>({});

    const loadData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const items = selectedTable === 'albums'
                ? await new AlbumManager().findAllManaged()
                : await currentConfig.manager.findAll();
            setData(items);
        } catch (err: any) {
            console.error('Error loading data:', err);
            setError(`Не удалось загрузить данные: ${err.message || 'Неизвестная ошибка'}`);
        } finally {
            setLoading(false);
        }
    }, [selectedTable, currentConfig]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Колонки с кнопками действий
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
                            style={{
                                background: '#0d6efd',
                                color: 'white',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                cursor: 'pointer'
                            }}
                        >
                            Изменить
                        </button>
                        <button
                            onClick={() => handleDelete(row.original)}
                            style={{
                                background: '#dc3545',
                                color: 'white',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                cursor: 'pointer'
                            }}
                        >
                            Удалить
                        </button>
                    </div>
                ),
            },
        ];
    }, [currentConfig.columns]);

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
        const pkValue = item[currentConfig.pk];
        if (!window.confirm(`Удалить запись #${pkValue}?`)) return;

        try {
            await currentConfig.manager.deleteById(pkValue);
            setData(prev => prev.filter(r => r[currentConfig.pk] !== pkValue));
            alert('Запись удалена');
        } catch (err: any) {
            console.error(err);
            alert('Ошибка удаления: ' + (err.message || 'Неизвестная ошибка'));
        }
    };

    const handleAddNew = () => {
        setEditingItem(null);
        const empty: Record<string, any> = {};
        currentConfig.columns.forEach(col => {
            const key = col.accessorKey as string;
            if (key && key !== currentConfig.pk && key !== 'coverHash' && key !== 'photoHash') {
                empty[key] = '';
            }
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
            } else {
                savedItem = await currentConfig.manager.create(formValues);
            }

            await loadData(); // Перезагружаем данные
            setModalOpen(false);
            alert(editingItem ? 'Запись обновлена' : 'Запись создана');
        } catch (err: any) {
            console.error(err);
            alert('Ошибка сохранения: ' + (err.message || 'Неизвестная ошибка'));
        }
    };

    const getFieldLabel = (key: string) => {
        const labels: Record<string, string> = {
            name: 'Название',
            title: 'Название',
            userId: 'ID владельца',
            isSystem: 'Системный',
            albumTypeId: 'Тип альбома (ID)',
            releasedAt: 'Дата релиза',
            status: 'Статус',
            genreId: 'ID жанра',
            description: 'Описание',
            duration: 'Длительность (сек)',
        };
        return labels[key] || key;
    };

    return (
        <div className="admin-dashboard" style={{ display: 'flex', minHeight: '100vh', background: '#121212' }}>
            {/* Sidebar */}
            <div style={{ width: '250px', background: '#1e1e1e', padding: '24px', display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ margin: '0 0 24px 0', color: 'white' }}>Админ-панель</h2>
                {tableKeys.map(key => (
                    <button
                        key={key}
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
                            fontSize: '14px'
                        }}
                    >
                        {tableConfigs[key].displayName}
                    </button>
                ))}
                <button
                    onClick={() => navigate('/')}
                    style={{
                        padding: '12px',
                        background: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        marginTop: '20px'
                    }}
                >
                    На главную
                </button>
            </div>

            {/* Main content */}
            <div style={{ flex: 1, padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
                    <h1 style={{ margin: 0, color: 'white' }}>{currentConfig.displayName}</h1>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <SearchBar
                            placeholder="Поиск..."
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
                                fontSize: '14px'
                            }}
                        >
                            + Добавить
                        </button>
                        <button
                            onClick={loadData}
                            style={{
                                padding: '10px 20px',
                                background: '#0d6efd',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            Обновить
                        </button>
                    </div>
                </div>

                {loading && (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#aaa' }}>
                        Загрузка данных...
                    </div>
                )}

                {error && (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#dc3545' }}>
                        {error}
                    </div>
                )}

                {!loading && !error && (
                    <div style={{ overflowX: 'auto' }}>
                        {data.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#aaa' }}>
                                Нет данных. Нажмите "+ Добавить" чтобы создать первую запись.
                            </div>
                        ) : (
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
                                                    borderBottom: '1px solid #444',
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
                                    <tr key={row.id} style={{ borderBottom: '1px solid #333' }}>
                                        {row.getVisibleCells().map(cell => (
                                            <td key={cell.id} style={{ padding: '12px' }}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {/* Модалка */}
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
                                maxWidth: '500px',
                                maxHeight: '90vh',
                                overflowY: 'auto',
                            }}
                            onClick={e => e.stopPropagation()}
                        >
                            <h2 style={{ margin: '0 0 20px 0', color: 'white' }}>
                                {editingItem ? 'Редактировать' : 'Создать'} запись
                            </h2>

                            <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
                                {currentConfig.columns.map(col => {
                                    const key = col.accessorKey as string;
                                    if (!key || key === currentConfig.pk) return null;
                                    if (key === 'coverHash' || key === 'photoHash') return null;

                                    const value = formValues[key] ?? '';

                                    return (
                                        <div key={key}>
                                            <label style={{ display: 'block', marginBottom: '6px', color: '#aaa', fontSize: '14px' }}>
                                                {getFieldLabel(key)}
                                            </label>
                                            {key === 'isSystem' ? (
                                                <select
                                                    value={value ? 'true' : 'false'}
                                                    onChange={e => setFormValues(prev => ({ ...prev, [key]: e.target.value === 'true' }))}
                                                    style={{
                                                        width: '100%',
                                                        padding: '10px',
                                                        background: '#2c2c2c',
                                                        border: '1px solid #444',
                                                        borderRadius: '6px',
                                                        color: 'white',
                                                        fontSize: '14px'
                                                    }}
                                                >
                                                    <option value="false">Нет</option>
                                                    <option value="true">Да</option>
                                                </select>
                                            ) : key === 'releasedAt' ? (
                                                <input
                                                    type="date"
                                                    value={value ? new Date(value).toISOString().split('T')[0] : ''}
                                                    onChange={e => setFormValues(prev => ({ ...prev, [key]: e.target.value }))}
                                                    style={{
                                                        width: '100%',
                                                        padding: '10px',
                                                        background: '#2c2c2c',
                                                        border: '1px solid #444',
                                                        borderRadius: '6px',
                                                        color: 'white',
                                                        fontSize: '14px'
                                                    }}
                                                />
                                            ) : (
                                                <input
                                                    type="text"
                                                    value={value}
                                                    onChange={e => setFormValues(prev => ({ ...prev, [key]: e.target.value }))}
                                                    style={{
                                                        width: '100%',
                                                        padding: '10px',
                                                        background: '#2c2c2c',
                                                        border: '1px solid #444',
                                                        borderRadius: '6px',
                                                        color: 'white',
                                                        fontSize: '14px'
                                                    }}
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                <button
                                    onClick={() => setModalOpen(false)}
                                    style={{
                                        padding: '10px 20px',
                                        background: '#6c757d',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: '14px'
                                    }}
                                >
                                    Отмена
                                </button>
                                <button
                                    onClick={handleSave}
                                    style={{
                                        padding: '10px 20px',
                                        background: '#0d6efd',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: '14px'
                                    }}
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
