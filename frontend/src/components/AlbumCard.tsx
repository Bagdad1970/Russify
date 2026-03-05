import '../assets/styles/components/AlbumCard.css';

const AlbumCard = ({ title, artist, year, cover, onClick }) => {
    return (
        <div className="album-card" onClick={onClick}>
            <div className="album-cover">
                {cover ? (
                    <img src={cover} alt={title} />
                ) : (
                    <div className="album-cover-placeholder">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                        </svg>
                    </div>
                )}
            </div>
            <div className="album-info">
                <h3 className="album-title">{title}</h3>
                <p className="album-artist">{artist}</p>
                <p className="album-year">{year}</p>
            </div>
            <div className="album-status">
                <span className="status-badge pending">На модерации</span>
            </div>
        </div>
    );
};

export default AlbumCard;