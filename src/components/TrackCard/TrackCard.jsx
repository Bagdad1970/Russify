import React from 'react';
import './TrackCard.css';

const TrackCard = ({ title = "Микс по настроениям", onClick }) => {
    return (
        <div className="track-card-full-width">
            <div className="side-panel left"></div>

            <div className="center-content">
                <div className="track-card-inner">
                    <div className="content-area">
                        <h2 className="track-title">{title}</h2>
                        <div className="track-image">
                            <div className="placeholder">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
                                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                                </svg>
                            </div>
                        </div>
                        <button className="listen-btn" onClick={onClick}>Слушать</button>
                    </div>
                </div>
            </div>

            <div className="side-panel right"></div>
        </div>
    );
};

export default TrackCard;