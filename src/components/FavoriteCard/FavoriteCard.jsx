import React, { useState, useEffect } from 'react';
import './FavoriteCard.css';

const FavoriteCard = ({ title = "Избранное", onCategoryChange, initialCategory = "Треки" }) => {
    const items = ["Альбомы", "Плейлисты", "Треки"];

    const [currentIndex, setCurrentIndex] = useState(() => {
        const index = items.indexOf(initialCategory);
        if (index >= 0) {
            return index;
        }
        return 2;
    });

    useEffect(() => {
        const index = items.indexOf(initialCategory);
        if (index >= 0 && index !== currentIndex) {
            setCurrentIndex(index);
        }
    }, [initialCategory]);

    const [isAnimating, setIsAnimating] = useState(false);

    const handleLeftClick = () => {
        if (isAnimating) return;

        setIsAnimating(true);

        setTimeout(() => {
            const newIndex = (currentIndex - 1 + items.length) % items.length;
            setCurrentIndex(newIndex);
            onCategoryChange(items[newIndex]);

            setTimeout(() => {
                setIsAnimating(false);
            }, 400);
        }, 400);
    };

    const handleRightClick = () => {
        if (isAnimating) return;

        setIsAnimating(true);

        setTimeout(() => {
            const newIndex = (currentIndex + 1) % items.length;
            setCurrentIndex(newIndex);
            onCategoryChange(items[newIndex]);

            setTimeout(() => {
                setIsAnimating(false);
            }, 400);
        }, 400);
    };

    const leftItem = items[(currentIndex - 1 + items.length) % items.length];
    const centerItem = items[currentIndex];
    const rightItem = items[(currentIndex + 1) % items.length];

    return (
        <div className="favorite-card-full-width">
            <div className="content-area">
                <div className="carousel-row">
                    <button className="nav-button carousel-btn" onClick={handleLeftClick}>
                        <span className="button-text">{leftItem}</span>
                    </button>
                    <div className="title-text">{title}</div>
                    <button className="nav-button carousel-btn" onClick={handleRightClick}>
                        <span className="button-text">{rightItem}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FavoriteCard;