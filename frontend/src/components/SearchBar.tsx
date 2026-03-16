import '../assets/styles/components/SearchBar.css';

const SearchBar = ({ placeholder, value, onChange, onKeyDown }) => {
    return (
        <div className="search-bar-container">
            <input
                type="text"
                className="search-input"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={onKeyDown}
            />
        </div>
    );
};

export default SearchBar;