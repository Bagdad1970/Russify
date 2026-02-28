import React, { useState, useRef, useEffect } from 'react';
import './CreateAlbumOrTrackModal.css';

const CreateAlbumOrTrackModal = ({ isOpen, onClose, mode = "track" }) => {
    const [type, setType] = useState("track");
    const [coverImage, setCoverImage] = useState(null);
    const [trackName, setTrackName] = useState("");
    const [authorName, setAuthorName] = useState("");
    const [tracks, setTracks] = useState([]);
    const modalRef = useRef(null);
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (isOpen) {
            const appBarHeight = 56;
            const modalWidth = 600;
            const modalHeight = 500;
            const left = (window.innerWidth - modalWidth) / 2;
            const top = appBarHeight + (window.innerHeight - appBarHeight - modalHeight) / 2 - 120;
            setPosition({ x: left, y: top });
        }
    }, [isOpen]);

    const handleMouseDown = (e) => {
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
        if (!isDragging) return;

        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;

        const modalRect = modalRef.current.getBoundingClientRect();
        const w = modalRect.width;
        const h = modalRect.height;

        const clampedX = Math.max(0, Math.min(newX, window.innerWidth - w));
        const clampedY = Math.max(56, Math.min(newY, window.innerHeight - h));

        setPosition({ x: clampedX, y: clampedY });
    };

    const handleMouseUp = () => setIsDragging(false);

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, dragOffset]);

    if (!isOpen) return null;

    const handleCoverClick = () => {
        fileInputRef.current?.click();
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
        console.log("Создание:", { type, coverImage, trackName, authorName, tracks });
        onClose();
    };

    const addTrack = () => {
        setTracks([...tracks, { id: Date.now(), title: "", artist: "" }]);
    };

    const removeTrack = (id) => {
        setTracks(tracks.filter(track => track.id !== id));
    };

    const updateTrackField = (id, field, value) => {
        setTracks(tracks.map(track =>
            track.id === id ? { ...track, [field]: value } : track
        ));
    };

    const handleDragStart = (e, index) => {
        e.dataTransfer.setData("text/plain", index.toString());
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, dropIndex) => {
        e.preventDefault();
        const dragIndex = parseInt(e.dataTransfer.getData("text/plain"));

        if (dragIndex !== dropIndex) {
            const newTracks = [...tracks];
            const draggedTrack = newTracks[dragIndex];

            newTracks.splice(dragIndex, 1);
            newTracks.splice(dropIndex, 0, draggedTrack);

            setTracks(newTracks);
        }
    };

    const getTitle = () => {
        return type === "track" ? "Загрузка трека" : "Загрузка альбома";
    };

    return (
        <div className="caotm-overlay">
            <div
                ref={modalRef}
                className="caotm-container"
                style={{ left: `${position.x}px`, top: `${position.y}px` }}
                onMouseDown={handleMouseDown}
            >
                {/* Заголовок */}
                <div className="caotm-header">
                    <div className="caotm-title">{getTitle()}</div>
                    <button className="caotm-close-btn" onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#ffffff" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="caotm-divider"></div>

                {/* Переключатель Трек/Альбом */}
                <div className="caotm-type-selector">
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

                {/* Обложка и выбор файла */}
                <div className="caotm-cover-section-centered">
                    <div className="caotm-cover-wrapper" onClick={handleCoverClick}>
                        {coverImage ? (
                            <img src={coverImage} alt="Обложка" className="caotm-cover-img" />
                        ) : (
                            <div className="caotm-cover-placeholder">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 156 156" width="156" height="156" fill="none" stroke="#f1f1f1" strokeWidth="5">
                                    <rect x="28" y="28" width="100" height="100" rx="10" />
                                    <path d="M52 52v64" />
                                    <path d="M78 52v64" />
                                    <path d="M104 52v64" />
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
                            Поддерживаемые форматы: MP3...
                        </div>
                    </div>
                </div>

                {type === "track" && (
                    <>
                        {/* Поля ввода */}
                        <div className="caotm-input-group">
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
                    </>
                )}

                {type === "album" && (
                    <>
                        {/* Кнопка добавления трека */}
                        <div className="caotm-add-track-section">
                            <button className="caotm-add-track-btn" onClick={addTrack}>
                                Добавить трек
                            </button>
                        </div>

                        {/* Список треков */}
                        {tracks.length > 0 && (
                            <div className="caotm-tracks-list-container">
                                <div className="caotm-tracks-list">
                                    {tracks.map((track, index) => (
                                        <div
                                            key={track.id}
                                            className="caotm-track-row"
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

                {/* Кнопка загрузить */}
                <div className="caotm-submit-section-centered">
                    <button className="caotm-submit-btn-no-arrow" onClick={handleSubmit}>
                        Загрузить
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateAlbumOrTrackModal;