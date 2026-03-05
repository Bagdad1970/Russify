import '../assets/styles/components/ColorTile.css';

const ColorTile = ({ color, title = "Название", onClick }) => (
    <div className="color-tile-wrapper" onClick={onClick}>
        <div className="color-tile" style={{ backgroundColor: color }} />
        <div className="tile-label">{title}</div>
    </div>
);

export default ColorTile;