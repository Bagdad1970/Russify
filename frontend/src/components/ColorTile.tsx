import '../assets/styles/components/ColorTile.css';

interface ColorTileProps {
    color?: string;
    title?: string;
    subtitle?: string;
    imageUrl?: string;
    onClick?: () => void;
}

const ColorTile = ({ color, title = "Название", subtitle, imageUrl, onClick }: ColorTileProps) => (
    <div className="color-tile-wrapper" onClick={onClick}>
        <div className="color-tile">
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt={title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
                        fallback?.style.setProperty('display', 'block');
                    }}
                />
            ) : null}
            <div
                style={{
                    backgroundColor: color || '#2c2c2c',
                    width: '100%',
                    height: '100%',
                    display: imageUrl ? 'none' : 'block'
                }}
            />
        </div>
        <div className="tile-label">{title}</div>
    </div>
);

export default ColorTile;
