import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/components/CreateAlbumOrTrackModal.css';

const CreateAlbumOrTrackModal = ({ isOpen, onClose, mode = "track" }) => {
    const navigate = useNavigate();
    const modalRef = useRef(null);
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const [type, setType] = useState(mode);
    const [coverImage, setCoverImage] = useState(null);
    const [trackName, setTrackName] = useState("");
    const [authorName, setAuthorName] = useState("");
    const [albumName, setAlbumName] = useState("");
    const [tracks, setTracks] = useState([]);
    const [draggedIndex, setDraggedIndex] = useState(null);

    const [availableTracks, setAvailableTracks] = useState([
        { id: 1, title: "Трек 1", artist: "Исполнитель A", duration: 180 },
        { id: 2, title: "Трек 2", artist: "Исполнитель B", duration: 210 },
        { id: 3, title: "Трек 3", artist: "Исполнитель C", duration: 150 },
        { id: 4, title: "Трек 4", artist: "Исполнитель D", duration: 200 },
        { id: 5, title: "Трек 5", artist: "Исполнитель E", duration: 170 },
        { id: 6, title: "Трек 6", artist: "Исполнитель F", duration: 190 },
        { id: 7, title: "Трек 7", artist: "Исполнитель G", duration: 220 },
        { id: 8, title: "Трек 8", artist: "Исполнитель H", duration: 160 },
        { id: 9, title: "Трек 9", artist: "Исполнитель I", duration: 200 },
        { id: 10, title: "Трек 10", artist: "Исполнитель J", duration: 180 },
    ]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    useEffect(() => {
        if (!isOpen) return;

        const updateLayout = () => {
            const w = window.innerWidth;
            setIsMobile(w < 768);

            let modalWidth = 600;
            if (w < 768) modalWidth = w - 24;

            const modalHeight = Math.min(500, window.innerHeight - 112);
            const left = (window.innerWidth - modalWidth) / 2;
            const top = Math.max(40, (window.innerHeight - modalHeight) / 2 - 100);

            setPosition({ x: left, y: top });
        };

        updateLayout();
        window.addEventListener('resize', updateLayout);
        return () => window.removeEventListener('resize', updateLayout);
    }, [isOpen]);

    const handleMouseDown = (e) => {
        if (window.innerWidth < 1024) return;
        if (e.target.closest('.caotm-header') && !e.target.closest('.caotm-close-btn')) {
            setIsDragging(true);
            const rect = modalRef.current.getBoundingClientRect();
            setDragOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
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
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setCoverImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = () => {
        console.log("Создание:", {
            type,
            coverImage,
            trackName,
            authorName,
            albumName,
            tracks
        });
        onClose();
    };

    const addTrack = () => {
        setTracks([...tracks, { id: Date.now(), title: "", artist: "" }]);
    };

    const removeTrack = (id) => {
        setTracks(tracks.filter(t => t.id !== id));
    };

    const updateTrackField = (id, field, value) => {
        setTracks(tracks.map(t => t.id === id ? { ...t, [field]: value } : t));
    };

    const getTitle = () => {
        return type === "track" ? "Загрузка трека" : "Загрузка альбома";
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
                    <div className="caotm-title">{getTitle()}</div>
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

                <div className="caotm-type-selector-centered">
                    <button
                        className={`caotm-type-btn ${type === "track" ? "active" : ""}`}
                        onClick={() => setType("track")}
                    >
                        Трек
                    </button>
                    <button
                        className={`caotm-type-btn ${type === "album" ? "active" : ""}`}
                        onClick={() => setType("album")}
                    >
                        Альбом
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
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            style={{ display: 'none' }}
                        />
                        <button className="caotm-file-btn-bordered" onClick={handleCoverClick}>
                            Выбрать файл
                        </button>
                        <div className="caotm-file-format">
                            Поддерживаемые форматы: JPG, PNG...
                        </div>
                    </div>
                </div>

                {type === "track" && (
                    <div className={`caotm-input-group ${isMobile ? 'vertical' : ''}`}>
                        <input
                            type="text"
                            className="caotm-input"
                            placeholder="Название трека"
                            value={trackName}
                            onChange={(e) => setTrackName(e.target.value)}
                        />
                        <input
                            type="text"
                            className="caotm-input"
                            placeholder="Имя автора"
                            value={authorName}
                            onChange={(e) => setAuthorName(e.target.value)}
                        />
                    </div>
                )}

                {type === "album" && (
                    <>
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
                                                placeholder="Трек"
                                                value={track.title}
                                                onChange={(e) => updateTrackField(track.id, 'title', e.target.value)}
                                            />
                                            <input
                                                type="text"
                                                className="caotm-input caotm-track-input"
                                                placeholder="Автор"
                                                value={track.artist}
                                                onChange={(e) => updateTrackField(track.id, 'artist', e.target.value)}
                                            />
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
                    </>
                )}

                <div className="caotm-before-submit-divider"></div>

                <div className={`caotm-submit-section-centered ${isMobile ? 'mobile-center' : ''}`}>
                    <button className="caotm-submit-btn-no-arrow" onClick={handleSubmit}>
                        Загрузить
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateAlbumOrTrackModal;