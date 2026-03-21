import { useState, useRef, useEffect } from 'react';
import '../assets/styles/components/CreatePlaylistModal.css';
import { PlaylistManager } from '../api/PlaylistManager';
import { useFavorites } from '../hooks/useFavorites';
import noCover from '../assets/images/no-cover.svg';
import { appEnv } from '../config/env.ts';

interface CreatePlaylistModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    onSave?: (payload: { name: string; coverFile: File | null; isSystem: boolean }) => Promise<void>;
    defaultIsSystem?: boolean;
    mode?: string;
}

const CreatePlaylistModal = ({ isOpen, onClose, onSuccess, onSave, defaultIsSystem = false }: CreatePlaylistModalProps) => {
    const modalRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const [playlistCoverFile, setPlaylistCoverFile] = useState<File | null>(null);
    const [playlistCoverPreview, setPlaylistCoverPreview] = useState<string | null>(null);
    const [playlistName, setPlaylistName] = useState("Новый плейлист");

    const [isLoading, setIsLoading] = useState(false);
    const [isPositionCalculated, setIsPositionCalculated] = useState(false);

    // ✅ Вернули состояние редактирования имени
    const [isEditingName, setIsEditingName] = useState(false);

    const playlistManager = new PlaylistManager();
    const { addFavoritePlaylist } = useFavorites();

    useEffect(() => {
        if (isOpen) {
            setPlaylistName("Новый плейлист");
            setPlaylistCoverFile(null);
            setPlaylistCoverPreview(null);
            setIsLoading(false);
            setIsEditingName(false);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) {
            setIsPositionCalculated(false);
            return;
        }
        const updateLayout = () => {
            const w = window.innerWidth;
            setIsMobile(w < 768);
            let modalWidth = 500;
            if (w < 768) modalWidth = w - 24;
            const modalHeight = 300;
            const left = (window.innerWidth - modalWidth) / 2;
            const top = Math.max(40, (window.innerHeight - modalHeight) / 2);
            setPosition({ x: left, y: top });
            setIsPositionCalculated(true);
        };
        updateLayout();
        window.addEventListener('resize', updateLayout);
        return () => window.removeEventListener('resize', updateLayout);
    }, [isOpen]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (window.innerWidth < 1024) return;
        if (e.target instanceof Element && e.target.closest('.cpl-header') && !e.target.closest('.cpl-close')) {
            setIsDragging(true);
            const rect = modalRef.current?.getBoundingClientRect();
            if (rect) setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging || window.innerWidth < 1024 || !modalRef.current) return;
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

    const handleCoverClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        document.getElementById('cover-upload')?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPlaylistCoverFile(file);
            const reader = new FileReader();
            reader.onload = (ev) => setPlaylistCoverPreview(ev.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    // Обработчики для редактирования имени
    const handleNameClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditingName(true);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPlaylistName(e.target.value);
    };

    const handleNameBlur = () => {
        setIsEditingName(false);
    };

    const handleNameKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            setIsEditingName(false);
        }
    };

    const handleSave = async () => {
        if (isLoading) return;
        setIsLoading(true);

        try {
            if (onSave) {
                await onSave({
                    name: playlistName.trim() || "Новый плейлист",
                    coverFile: playlistCoverFile,
                    isSystem: defaultIsSystem
                });
                onClose();
                return;
            }

            const formData = new FormData();
            const token = localStorage.getItem('auth_token');

            formData.append("name", playlistName.trim() || "Новый плейлист");
            formData.append("isSystem", String(defaultIsSystem));

            if (playlistCoverFile) {
                formData.append("coverFile", playlistCoverFile);
            }

            const response = await fetch(`${appEnv.apiBaseUrl}/api/playlists`, {
                method: 'POST',
                headers: token ? { 'Authorization': `Bearer ${token}` } : {},
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server error ${response.status}: ${errorText}`);
            }

            const contentType = response.headers.get('content-type');
            const created = contentType?.includes('application/json')
                ? await response.json()
                : { name: playlistName, id: 0 };

            if (created.id && !defaultIsSystem) {
                await addFavoritePlaylist(Number(created.id));
            }

            if (onSuccess) onSuccess();
            onClose();

        } catch (err: any) {
            console.error("❌ Ошибка:", err);
            alert("Не удалось создать плейлист:\n" + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="cpl-overlay" style={{ opacity: isPositionCalculated ? 1 : 0 }}>
            <div ref={modalRef} className={`cpl-container ${isMobile ? 'mobile' : ''}`} style={{ left: `${position.x}px`, top: `${position.y}px` }} onMouseDown={handleMouseDown} onClick={(e) => e.stopPropagation()}>
                <div className={`cpl-header ${isMobile ? 'mobile-centered' : ''}`}>
                    <div className="cpl-playlist-cover" onClick={handleCoverClick}>
                        {playlistCoverPreview ? (
                            <img src={playlistCoverPreview} alt="Обложка" style={{ width: '156px', height: '156px', borderRadius: '12px', objectFit: 'cover' }} />
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 156 156" width="156" height="156" fill="none" stroke="#f1f1f1" strokeWidth="5">
                                <rect x="28" y="28" width="100" height="100" rx="10" /><path d="M52 52v64 M78 52v64 M104 52v64" />
                            </svg>
                        )}
                    </div>

                    <div className="cpl-playlist-info">
                        {/* ✅ Логика редактирования имени */}
                        {isEditingName ? (
                            <input
                                type="text"
                                className="cpl-title-input"
                                value={playlistName}
                                onChange={handleNameChange}
                                onBlur={handleNameBlur}
                                onKeyDown={handleNameKeyDown}
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                                maxLength={50}
                                style={{ fontSize: '20px', fontWeight: 'bold', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '4px 8px', borderRadius: '4px', width: '100%' }}
                            />
                        ) : (
                            <div
                                className="cpl-title"
                                onClick={handleNameClick}
                                title="Нажмите, чтобы изменить название"
                                style={{ cursor: 'pointer', fontSize: '20px', fontWeight: 'bold' }}
                            >
                                {playlistName}
                            </div>
                        )}

                        <div className="cpl-meta">
                            <div className="cpl-count">0 треков</div>
                            <div className="cpl-duration">0:00</div>
                        </div>
                    </div>

                    <button className="cpl-close" onClick={(e) => { e.stopPropagation(); onClose(); }} disabled={isLoading}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#ffffff" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>
                <div className="cpl-divider"></div>
                <div style={{ padding: '20px', textAlign: 'center', color: '#aaa', fontSize: '14px' }}>
                    {isEditingName ? 'Нажмите Enter для сохранения названия' : 'Нажмите на название, чтобы изменить его'}
                </div>
                <div className={`cpl-buttons ${isMobile ? 'mobile-center' : ''}`}>
                    <button className="cpl-btn-cancel" onClick={onClose} disabled={isLoading}>Отменить</button>
                    <button className="cpl-btn-save" onClick={handleSave} disabled={isLoading || !playlistName.trim()}>
                        {isLoading ? 'Создание...' : 'Создать'}
                    </button>
                </div>
            </div>
            <input type="file" id="cover-upload" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
        </div>
    );
};

export default CreatePlaylistModal;
