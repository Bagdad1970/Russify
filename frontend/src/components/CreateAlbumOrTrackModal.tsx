import { useState, useRef, useEffect } from 'react';
import '../assets/styles/components/CreateAlbumOrTrackModal.css';

const CreateAlbumOrTrackModal = ({ isOpen, onClose, mode = "album" }) => {
    const modalRef = useRef(null);
    const audioFileInputRefs = useRef({});
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const [coverImage, setCoverImage] = useState(null);
    const [coverFile, setCoverFile] = useState<File | null>(null);

    const [albumName, setAlbumName] = useState("");
    const [tracks, setTracks] = useState([]);
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formatTime = (seconds) => {
        if (!seconds) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    useEffect(() => {
        if (!isOpen) return;
        const updateLayout = () => {
            const w = window.innerWidth;
            setIsMobile(w < 768);
            let modalWidth = 800;
            if (w < 768) modalWidth = w - 24;
            const modalHeight = Math.min(600, window.innerHeight - 112);
            const left = (window.innerWidth - modalWidth) / 2;
            const top = Math.max(40, (window.innerHeight - modalHeight) / 2 - 100);
            setPosition({ x: left, y: top });
        };
        updateLayout();
        window.addEventListener('resize', updateLayout);
        return () => window.removeEventListener('resize', updateLayout);
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) {
            setCoverImage(null);
            setCoverFile(null);
            setAlbumName("");
            setTracks([]);
        }
    }, [isOpen]);

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

    const handleDragStart = (e, index) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, dropIndex) => {
        e.preventDefault();
        if (draggedIndex === null) return;
        const targetElement = e.target.closest('.caotm-track-row');
        if (!targetElement) return;
        const targetIndex = Array.from(targetElement.parentNode.children).indexOf(targetElement);
        if (targetIndex === draggedIndex) return;
        const newTracks = [...tracks];
        const [movedTrack] = newTracks.splice(draggedIndex, 1);
        newTracks.splice(targetIndex, 0, movedTrack);
        setTracks(newTracks);
        setDraggedIndex(null);
    };

    const handleCoverClick = () => {
        document.getElementById('cover-upload')?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log('📁 Cover file selected:', file.name, file.size, file.type);
            setCoverFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setCoverImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAudioFileSelect = (trackId) => {
        audioFileInputRefs.current[trackId]?.click();
    };

    const handleAudioFileChange = (trackId, e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type === 'audio/mpeg' || file.type === 'audio/mp3') {
                console.log(`🎵 Audio file selected for track ${trackId}:`, file.name, file.size, file.type);

                setTracks(prevTracks => prevTracks.map(track => {
                    if (track.id === trackId) {
                        return { ...track, audioFile: file, audioFileName: file.name };
                    }
                    return track;
                }));

                const audio = new Audio();
                const objectUrl = URL.createObjectURL(file);
                audio.src = objectUrl;

                audio.addEventListener('loadedmetadata', () => {
                    const duration = Math.floor(audio.duration);
                    URL.revokeObjectURL(objectUrl);

                    setTracks(prevTracks => prevTracks.map(track => {
                        if (track.id === trackId) {
                            return { ...track, duration: duration };
                        }
                        return track;
                    }));

                    console.log(`✅ Track ${trackId} duration:`, duration, 'seconds');
                });

                audio.addEventListener('error', () => {
                    console.error('Error loading audio file');
                    URL.revokeObjectURL(objectUrl);
                    alert('Ошибка загрузки аудио файла');
                });
            } else {
                alert('Пожалуйста, выберите MP3 файл (тип: audio/mpeg)');
                console.log('Invalid file type:', file.type);
            }
        }
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;

        if (!albumName.trim()) {
            alert('Введите название альбома');
            return;
        }

        const invalidTracks = tracks.filter(t => !t.audioFile || !t.title.trim());
        if (invalidTracks.length > 0) {
            alert(`У следующих треков отсутствует название или аудио файл:\n${invalidTracks.map(t => t.title || 'Без названия').join('\n')}`);
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            const token = localStorage.getItem('auth_token');
            const API_URL = import.meta.env.VITE_BASE_URL_PROD || import.meta.env.VITE_BASE_URL_DEV || 'http://localhost:8080';

            // Основные поля альбома
            formData.append('title', albumName);
            formData.append('typeId', '1');
            formData.append('releasedAt', new Date().toISOString());

            // Обложка
            if (coverFile) {
                console.log('📸 Adding cover file:', coverFile.name, coverFile.size);
                formData.append('coverFile', coverFile);
            }

            // Массивы для треков
            tracks.forEach((track, index) => {
                if (track.audioFile) {
                    console.log(`🎵 Adding track ${index + 1}:`, track.title);

                    // Названия треков
                    formData.append('trackNames', track.title.trim());

                    // Аудио файлы
                    formData.append('trackAudioFiles', track.audioFile);

                    // ID жанра (временная заглушка)
                    formData.append('trackGenreIds', '1');
                }
            });

            console.log('📦 FormData contents:');
            for (let pair of formData.entries()) {
                if (pair[1] instanceof File) {
                    console.log(`  ${pair[0]}: ${pair[1].name} (${pair[1].size} bytes, ${pair[1].type})`);
                } else {
                    console.log(`  ${pair[0]}: ${pair[1]}`);
                }
            }

            const url = `${API_URL}/api/user/albums`;
            console.log('🌐 Sending to:', url);

            const response = await fetch(url, {
                method: 'POST',
                headers: token ? { 'Authorization': `Bearer ${token}` } : {},
                body: formData,
            });

            console.log('📡 Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Error response:', errorText);
                throw new Error(`Ошибка: ${response.status} ${errorText}`);
            }

            const result = await response.json();
            console.log('✅ Success:', result);

            alert('Альбом отправлен на модерацию');
            onClose();

        } catch (err: any) {
            console.error('❌ Error:', err);
            alert(err.message || 'Произошла ошибка при загрузке');
        } finally {
            setIsSubmitting(false);
        }
    };

    const addTrack = () => {
        const newTrack = {
            id: Date.now(),
            title: "",
            audioFile: null,
            audioFileName: null,
            duration: 0
        };
        setTracks([...tracks, newTrack]);
    };

    const removeTrack = (id) => {
        setTracks(tracks.filter(t => t.id !== id));
    };

    const updateTrackField = (id, field, value) => {
        setTracks(tracks.map(t => t.id === id ? { ...t, [field]: value } : t));
    };

    return (
        <div className="caotm-overlay" onClick={onClose}>
            <div
                ref={modalRef}
                className={`caotm-container ${isMobile ? 'mobile' : ''}`}
                style={{ left: `${position.x}px`, top: `${position.y}px` }}
                onMouseDown={handleMouseDown}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="caotm-header-centered">
                    <div className="caotm-title">Загрузка альбома</div>
                    <button className="caotm-close-btn" onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }} aria-label="Закрыть">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#ffffff" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="caotm-divider"></div>

                <div className={`caotm-cover-section ${isMobile ? 'vertical' : ''}`}>
                    <div className="caotm-cover-wrapper" onClick={handleCoverClick}>
                        {coverImage ? (
                            <img src={coverImage} alt="Обложка" className="caotm-cover-img" />
                        ) : (
                            <div className="caotm-cover-placeholder">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 156 156" width="156" height="156" fill="none" stroke="#f1f1f1" strokeWidth="5">
                                    <rect x="28" y="28" width="100" height="100" rx="10" />
                                    <path d="M52 52v64 M78 52v64 M104 52v64" />
                                </svg>
                            </div>
                        )}
                    </div>

                    <div className="caotm-file-input-wrapper">
                        <input
                            type="file"
                            id="cover-upload"
                            onChange={handleFileChange}
                            accept="image/*"
                            style={{ display: 'none' }}
                        />
                        <button className="caotm-file-btn-bordered" onClick={handleCoverClick}>
                            Выбрать обложку
                        </button>
                        <div className="caotm-file-format">
                            {coverFile ? `✅ ${coverFile.name}` : 'Поддерживаемые форматы: JPG, PNG...'}
                        </div>
                    </div>
                </div>

                <div className={`caotm-input-group ${isMobile ? 'vertical' : ''}`}>
                    <input
                        type="text"
                        className="caotm-input"
                        placeholder="Название альбома"
                        value={albumName}
                        onChange={(e) => setAlbumName(e.target.value)}
                    />
                </div>

                <div className={`caotm-add-track-section ${isMobile ? 'centered' : ''}`}>
                    <button className="caotm-add-track-btn" onClick={addTrack}>
                        Добавить трек
                    </button>
                </div>

                {tracks.length > 0 && (
                    <div className="caotm-tracks-list-container">
                        <div className="caotm-tracks-list">
                            {tracks.map((track, index) => (
                                <div
                                    key={track.id}
                                    className={`caotm-track-row ${draggedIndex === index ? 'dragging' : ''}`}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, index)}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, index)}
                                >
                                    <div className="caotm-track-number">{index + 1}.</div>
                                    <input
                                        type="text"
                                        className="caotm-input caotm-track-input"
                                        placeholder="Название трека"
                                        value={track.title}
                                        onChange={(e) => updateTrackField(track.id, 'title', e.target.value)}
                                        style={{ flex: 2 }}
                                    />

                                    <button
                                        className={`caotm-audio-btn ${track.audioFile ? 'has-audio' : ''}`}
                                        onClick={() => handleAudioFileSelect(track.id)}
                                        style={{
                                            background: track.audioFile ? '#4caf50' : '#444',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            padding: '8px 12px',
                                            cursor: 'pointer',
                                            fontSize: '13px',
                                            whiteSpace: 'nowrap',
                                            minWidth: '120px'
                                        }}
                                    >
                                        {track.audioFile ? `🎵 ${track.audioFileName || 'MP3'}` : '📁 Выбрать MP3'}
                                    </button>

                                    <input
                                        type="file"
                                        ref={(el) => {
                                            audioFileInputRefs.current[track.id] = el;
                                        }}
                                        onChange={(e) => handleAudioFileChange(track.id, e)}
                                        accept="audio/mpeg"
                                        style={{ display: 'none' }}
                                    />

                                    {track.duration > 0 && (
                                        <div style={{ fontSize: '12px', color: '#aaa', marginLeft: '8px', minWidth: '45px' }}>
                                            {formatTime(track.duration)}
                                        </div>
                                    )}

                                    <button className="caotm-trash-btn" onClick={() => removeTrack(track.id)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#aaa" strokeWidth="2">
                                            <path d="M3 6h18M19 6v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="caotm-before-submit-divider"></div>

                <div className={`caotm-submit-section-centered ${isMobile ? 'mobile-center' : ''}`}>
                    <button
                        className="caotm-submit-btn-no-arrow"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Загрузка...' : 'Загрузить альбом'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateAlbumOrTrackModal;
