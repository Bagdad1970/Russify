import type { KeyboardEventHandler, MouseEventHandler } from 'react';
import '../assets/styles/components/SearchBar.css';

interface SearchBarProps {
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
    onClick?: MouseEventHandler<HTMLInputElement>;
}

const SearchBar = ({ placeholder, value, onChange, onKeyDown, onClick }: SearchBarProps) => {
    return (
        <div className="search-bar-container">
            <input
                type="text"
                className="search-input"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={onKeyDown}
                onClick={onClick}
            />
        </div>
    );
};

export default SearchBar;
