import '../assets/styles/components/ColorTile.css';

const ColorTile = ({ color, title = "Название", subtitle, imageUrl, onClick }) => (
    <div className="color-tile-wrapper" onClick={onClick}>
        <div className="color-tile">
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt={title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextSibling?.style?.setProperty('display', 'flex');
                    }}
                />
            ) : null}
            {!imageUrl && (
                <div style={{ backgroundColor: color || '#2c2c2c', width: '100%', height: '100%' }} />
            )}
        </div>
        <div className="tile-label">{title}</div>
    </div>
);

export default ColorTile;