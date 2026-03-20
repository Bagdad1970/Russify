import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/components/CreateAlbumOrTrackModal.css';
import { TrackManager } from '../api/TrackManager'; // Если понадобится для загрузки списка треков

const CreateAlbumOrTrackModal = ({ isOpen, onClose, mode = "track" }) => {
    const navigate = useNavigate();
    const modalRef = useRef(null);
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const [type, setType] = useState(mode);

    // Данные формы
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);

    // Поля для Трека
    const [trackName, setTrackName] = useState("");
    const [authorName, setAuthorName] = useState("");

    // Поля для Альбома
    const [albumName, setAlbumName] = useState("");
    const [albumTracks, setAlbumTracks] = useState([]); // Список выбранных треков (объекты)
    const [draggedIndex, setDraggedIndex] = useState(null);

    // Список всех доступных треков (для добавления в альбом) - можно загружать реально
    const [availableTracks, setAvailableTracks] = useState([]);
    const [isLoadingTracks, setIsLoadingTracks] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Загрузка доступных треков при открытии (если режим альбома)
    useEffect(() => {
        if (isOpen && type === 'album') {
            loadAvailableTracks();
        }
    }, [isOpen, type]);

    const loadAvailableTracks = async () => {
        try {
            setIsLoadingTracks(true);
            // Здесь можно вызвать реальный API, например:
            // const tracks = await trackManager.findAll();
            // setAvailableTracks(tracks);

            // ЗАГЛУШКА для примера (удалите в продакшене)
            const mockTracks = [
                { id: 1, title: "Трек 1", artist: "Исполнитель A", duration: 180 },
                { id: 2, title: "Трек 2", artist: "Исполнитель B", duration: 210 },
                { id: 3, title: "Трек 3", artist: "Исполнитель C", duration: 150 },
            ];
            setAvailableTracks(mockTracks);
        } catch (error) {
            console.error('Error loading tracks:', error);
        } finally {
            setIsLoadingTracks(false);
        }
    };

    useEffect(() => {
        if (!isOpen) return;
        const updateLayout = () => {
            const w = window.innerWidth;
            setIsMobile(w < 768);
            let modalWidth = 600;
            if (w < 768) modalWidth = w - 24;
            const modalHeight = Math.min(600, window.innerHeight - 112);
            const left = (window.innerWidth - modalWidth) / 2;
            const top = Math.max(40, (window.innerHeight - modalHeight) / 2 - 50);
            setPosition({ x: left, y: top });
        };
        updateLayout();
        window.addEventListener('resize', updateLayout);
        return () => window.removeEventListener('resize', updateLayout);
    }, [isOpen]);

    // --- Логика перетаскивания модалки ---
    const handleMouseDown = (e) => {
        if (window.innerWidth < 1024) return;
        if (e.target.closest('.caotm-header') && !e.target.closest('.caotm-close-btn')) {
            setIsDragging(true);
            const rect = modalRef.current.getBoundingClientRect();
            setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }
    };
    const handleMouseMove = (e) => {
        if (!isDragging || window.innerWidth < 1024) return;
        let newX = e.clientX - dragOffset.x;
        let newY = e.clientY - dragOffset.y;
        const r = modalRef.current.getBoundingClientRect();
        newX = Math.max(0, Math.min(newX, window.innerWidth - r.width));
        newY = Math.max(40, Math.min(newY, window.innerHeight - r.height));
        setPosition({ x: newX, y: newY });
    };
    const handleMouseUp = () => setIsDragging(false);
    useEffect(() => {
        if (isDragging && window.innerWidth >= 1024) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging]);

    if (!isOpen) return null;

    // --- Drag & Drop треков внутри альбома ---
    const handleDragStart = (e, index) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };
    const handleDragOver = (e) => e.preventDefault();
    const handleDrop = (e, dropIndex) => {
        e.preventDefault();
        if (draggedIndex === null) return;
        const newTracks = [...albumTracks];
        const [moved] = newTracks.splice(draggedIndex, 1);
        newTracks.splice(dropIndex, 0, moved);
        setAlbumTracks(newTracks);
        setDraggedIndex(null);
    };

    // --- Работа с файлами ---
    const handleCoverClick = () => fileInputRef.current?.click();
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setCoverFile(file);
            const reader = new FileReader();
            reader.onload = (ev) => setCoverImagePreview(ev.target?.result);
            reader.readAsDataURL(file);
        }
    };

    // Добавление трека из списка доступных в альбом
    const addTrackToAlbum = (track) => {
        if (!albumTracks.find(t => t.id === track.id)) {
            setAlbumTracks([...albumTracks, track]);
        }
    };

    const removeTrackFromAlbum = (id) => {
        setAlbumTracks(albumTracks.filter(t => t.id !== id));
    };

    // ✅ ГЛАВНАЯ ФУНКЦИЯ ОТПРАВКИ (Прямой fetch как в PlaylistModal)
    const handleSubmit = async () => {
        if (isSubmitting) return;

        // Валидация
        if (type === 'track' && (!trackName.trim() || !authorName.trim())) {
            alert('Заполните название трека и автора');
            return;
        }
        if (type === 'album' && !albumName.trim()) {
            alert('Введите название альбома');
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            const token = localStorage.getItem('auth_token');
            const API_URL = import.meta.env.VITE_BASE_URL_PROD || import.meta.env.VITE_BASE_URL_DEV || 'http://localhost:8080';

            if (type === 'track') {
                // --- ЛОГИКА ДЛЯ ТРЕКА ---
                // Предположим, эндпоинт POST /api/tracks
                formData.append('title', trackName);
                formData.append('artist', authorName); // Или authorId, если выбирается из списка
                if (coverFile) formData.append('coverFile', coverFile);
                // Если трек требует файл аудио:
                // formData.append('audioFile', audioFile);

                const response = await fetch(`${API_URL}/api/tracks`, {
                    method: 'POST',
                    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
                    body: formData,
                });

                if (!response.ok) {
                    const errText = await response.text();
                    throw new Error(`Ошибка трека: ${response.status} ${errText}`);
                }

            } else {
                // --- ЛОГИКА ДЛЯ АЛЬБОМА ---
                // Эндпоинт POST /api/albums (требует multipart)
                formData.append('title', albumName);

                // AuthorId (нужно получить ID автора, пока заглушка или из токена)
                // Если автор выбирается текстом, возможно, нужен другой эндпоинт или поиск автора сначала.
                // Для примера берем ID из токена или ставим 1
                const userId = token ? JSON.parse(atob(token.split('.')[1])).userId : 1;
                formData.append('authorId', String(userId));

                formData.append('typeId', '1'); // Заглушка типа альбома
                formData.append('releasedAt', new Date().toISOString());

                if (coverFile) formData.append('coverFile', coverFile);

                // Треки (массив ID)
                albumTracks.forEach(t => {
                    formData.append('trackIds', String(t.id));
                });

                const response = await fetch(`${API_URL}/api/albums`, {
                    method: 'POST',
                    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
                    body: formData,
                });

                if (!response.ok) {
                    const errText = await response.text();
                    throw new Error(`Ошибка альбома: ${response.status} ${errText}`);
                }
            }

            // Успех
            alert(type === 'track' ? 'Трек загружен!' : 'Альбом создан!');
            onClose();
            // Можно сделать навигацию или обновление списка
            // navigate('/profile');

        } catch (err) {
            console.error(err);
            alert(err.message || 'Произошла ошибка при загрузке');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getTitle = () => type === "track" ? "Загрузка трека" : "Загрузка альбома";

    return (
        <div className="caotm-overlay" onClick={onClose}>
            <div
                ref={modalRef}
                className={`caotm-container ${isMobile ? 'mobile' : ''}`}
                style={{ left: `${position.x}px`, top: `${position.y}px` }}
                onMouseDown={handleMouseDown}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="caotm-header">
                    <div className="caotm-title">{getTitle()}</div>
                    <button className="caotm-close-btn" onClick={onClose}>
                        <svg viewBox="0 0 24 24" width="24" height="24" stroke="#fff" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>
                <div className="caotm-divider"></div>

                {/* Type Selector */}
                <div className="caotm-type-selector">
                    <button className={`caotm-type-btn ${type === "track" ? "active" : ""}`} onClick={() => setType("track")}>Трект</button>
                    <button className={`caotm-type-btn ${type === "album" ? "active" : ""}`} onClick={() => setType("album")}>Альбом</button>
                </div>
                <div className="caotm-divider"></div>

                {/* Cover Upload */}
                <div className="caotm-cover-section">
                    <div className="caotm-cover-wrapper" onClick={handleCoverClick}>
                        {coverImagePreview ? (
                            <img src={coverImagePreview} alt="Cover" className="caotm-cover-img" />
                        ) : (
                            <div className="caotm-cover-placeholder">
                                <svg viewBox="0 0 156 156" width="156" height="156" fill="none" stroke="#f1f1f1" strokeWidth="5">
                                    <rect x="28" y="28" width="100" height="100" rx="10"/><path d="M52 52v64 M78 52v64 M104 52v64"/>
                                </svg>
                            </div>
                        )}
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{display:'none'}}/>
                    <button className="caotm-file-btn" onClick={handleCoverClick}>Загрузить обложку</button>
                </div>

                {/* Fields */}
                <div className="caotm-content-scrollable">
                    {type === "track" ? (
                        <div className="caotm-input-group">
                            <input className="caotm-input" placeholder="Название трека" value={trackName} onChange={e => setTrackName(e.target.value)} />
                            <input className="caotm-input" placeholder="Исполнитель" value={authorName} onChange={e => setAuthorName(e.target.value)} />
                        </div>
                    ) : (
                        <>
                            <input className="caotm-input" placeholder="Название альбома" value={albumName} onChange={e => setAlbumName(e.target.value)} />

                            <div className="caotm-tracks-manager">
                                <h4>Треки в альбоме:</h4>
                                {albumTracks.length === 0 && <div className="caotm-empty">Нет треков</div>}
                                <div className="caotm-track-list">
                                    {albumTracks.map((t, i) => (
                                        <div key={t.id} className="caotm-track-row" draggable onDragStart={e => handleDragStart(e, i)} onDragOver={handleDragOver} onDrop={e => handleDrop(e, i)}>
                                            <span>{i+1}. {t.title} - {t.artist}</span>
                                            <button onClick={() => removeTrackFromAlbum(t.id)}>✕</button>
                                        </div>
                                    ))}
                                </div>

                                <div className="caotm-add-track-area">
                                    <h4>Добавить трек:</h4>
                                    {isLoadingTracks ? <small>Загрузка...</small> : (
                                        <div className="caotm-available-list">
                                            {availableTracks.filter(t => !albumTracks.find(x => x.id === t.id)).map(t => (
                                                <div key={t.id} className="caotm-available-item" onClick={() => addTrackToAlbum(t)}>
                                                    + {t.title}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="caotm-footer">
                    <button className="caotm-submit-btn" onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? 'Загрузка...' : 'Опубликовать'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateAlbumOrTrackModal;