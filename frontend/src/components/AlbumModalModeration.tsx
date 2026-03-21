import '../assets/styles/components/AlbumModalModeration.css';

interface AlbumModalModerationProps {
    album: any;
    onClose: () => void;
    onApprove: (album: any) => void | Promise<void>;
    onReject: (album: any) => void | Promise<void>;
    isLoading?: boolean;
}

const AlbumModalModeration = ({ album, onClose, onApprove, onReject, isLoading = false }: AlbumModalModerationProps) => {
    if (!album) return null;

    // Заглушка для треков (в реальности будут приходить из API или пропсов)
    const tracks = [
        { id: 1, title: 'Название трека', duration: '01:00' },
        { id: 2, title: 'Название трека', duration: '01:00' },
        { id: 3, title: 'Название трека', duration: '01:00' },
        { id: 4, title: 'Название трека', duration: '01:00' },
        { id: 5, title: 'Название трека', duration: '01:00' },
    ];

    const totalDuration = '27 минут 38 секунд';
    const totalTracks = tracks.length;

    return (
        <div className="album-modal-overlay" onClick={onClose}>
            <div className="album-modal-content" onClick={(e) => e.stopPropagation()}>
                {/* Кнопка закрытия */}
                <button className="modal-close-btn" onClick={onClose}>
                    ×
                </button>

                {/* Шапка модалки */}
                <div className="modal-header">
                    <div className="modal-album-cover">
                        {album.cover ? (
                            <img src={album.cover} alt={album.title} />
                        ) : (
                            <div className="album-cover-placeholder">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
                                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"></path>
                                </svg>
                            </div>
                        )}
                    </div>

                    <div className="modal-album-info">
                        <h2 className="modal-album-title">{album.title}</h2>
                        <p className="modal-album-artist">{album.artist}</p>
                        <div className="modal-album-meta">
                            <span>{totalTracks} аудиозаписей</span>
                            <span>•</span>
                            <span>{totalDuration}</span>
                        </div>
                    </div>
                </div>

                {/* Список треков */}
                <div className="modal-tracks-list">
                    {tracks.map((track) => (
                        <div key={track.id} className="modal-track-item">
                            <div className="track-cover-placeholder">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"></path>
                                </svg>
                            </div>
                            <div className="track-info">
                                <span className="track-title">{track.title}</span>
                            </div>
                            <span className="track-duration">{track.duration}</span>
                        </div>
                    ))}
                </div>

                {/* Поле для комментариев */}
                <div className="modal-comment-section">
          <textarea
              className="modal-comment-input"
              placeholder="Комментарий к решению (необязательно)"
              rows={3}
          />
                </div>

                {/* Кнопки действий */}
                <div className="modal-actions">
                    <button
                        className="modal-btn modal-btn-reject"
                        onClick={() => onReject(album)}
                        disabled={isLoading}
                    >
                        Отклонить
                    </button>
                    <button
                        className="modal-btn modal-btn-approve"
                        onClick={() => onApprove(album)}
                        disabled={isLoading}
                    >
                        Одобрить
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlbumModalModeration;
