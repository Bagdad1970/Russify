import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

import HomePage from './pages/HomePage/HomePage';
import FavoritesPage from './pages/FavoritesPage/FavoritesPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import SettingsPage from './pages/SettingsPage/SettingsPage';

import AppBar from './components/AppBar/AppBar';
import PlaylistModal from './components/PlaylistModal/PlaylistModal';
import SystemPlaylistModal from './components/SystemPlaylistModal/SystemPlaylistModal';
import AlbumModal from './components/AlbumModal/AlbumModal';
import CreatePlaylistModal from './components/CreatePlaylistModal/CreatePlaylistModal';
import RegistrationModal from "./components/RegistrationModal/RegistrationModal";
import LoginModal from "./components/LoginModal/LoginModal";
import AdminLogin from "./pages/AdminLogin/AdminLogin";
import ModerationPage from "./pages/ModerationPage/ModerationPage.tsx";

function App() {
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSystemModalOpen, setIsSystemModalOpen] = useState(false);
    const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
    const [isCreatePlaylistModalOpen, setIsCreatePlaylistModalOpen] = useState(false);

    const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(true);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const playlists = [
        { id: 1, color: '#00f0ff', title: 'Системный плейлист', author: 'Автор 1', tracks: [{ title: 'Трек 1', artist: 'Исполнитель A' }, { title: 'Трек 2', artist: 'Исполнитель B' }] },
        { id: 2, color: '#ff0000', title: 'Плейлист 2', author: 'Автор 2', tracks: [{ title: 'Трек 3', artist: 'Исполнитель C' }] },
        { id: 3, color: '#8000ff', title: 'Плейлист 3', author: 'Автор 3', tracks: [] },
        { id: 4, color: '#7fff7f', title: 'Плейлист 4', author: 'Автор 4', tracks: [{ title: 'Трек 4', artist: 'Исполнитель D' }, { title: 'Трек 5', artist: 'Исполнитель E' }] },
        { id: 5, color: '#00f0ff', title: 'Плейлист 5', author: 'Автор 5', tracks: [] },
        { id: 6, color: '#ff0000', title: 'Плейлист 6', author: 'Автор 6', tracks: [] },
        { id: 7, color: '#8000ff', title: 'Плейлист 7', author: 'Автор 7', tracks: [] },
        { id: 8, color: '#7fff7f', title: 'Плейлист 8', author: 'Автор 8', tracks: [] },
    ];

    const albums = [
        {
            name: "Альбом",
            author: "Автор",
            tracks: [
                { title: "Трек 1", artist: "Автор", duration: 180 },
                { title: "Трек 2", artist: "Автор", duration: 210 },
            ]
        }
    ];

    const openPlaylistModal = (playlist) => {
        setSelectedPlaylist(playlist);
        setIsModalOpen(true);
    };

    const openSystemModal = (playlist) => {
        setSelectedPlaylist(playlist);
        setIsSystemModalOpen(true);
    };

    const openAlbumModal = () => {
        setIsAlbumModalOpen(true);
    };

    const openCreatePlaylistModal = () => {
        setIsCreatePlaylistModalOpen(true);
    };

    const openRegistrationModal = () => {
        setIsRegistrationModalOpen(true);
    };

    const openLoginModal = () => {
        setIsLoginModalOpen(true);
    };

    const closeRegistrationModal = () => {
        setIsRegistrationModalOpen(false);
    };

    const closeLoginModal = () => {
        setIsLoginModalOpen(false);
    };

    const switchToLogin = () => {
        setIsRegistrationModalOpen(false);
        setIsLoginModalOpen(true);
    };

    const switchToRegistration = () => {
        setIsLoginModalOpen(false);
        setIsRegistrationModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsSystemModalOpen(false);
        setIsAlbumModalOpen(false);
        setIsCreatePlaylistModalOpen(false);
        setSelectedPlaylist(null);
    };

    useEffect(() => {
    }, []);

    return (
        <Router>
            <div className="app">
                <AppBar
                    activeTab="Главная"
                    trackTitle="Трек дня"
                    artistName="Исполнитель"
                    onFavoritesClick={openCreatePlaylistModal}
                    onRegistrationClick={openRegistrationModal}
                    onLoginClick={openLoginModal}
                />

                <Routes>
                    <Route
                        path="/"
                        element={
                            <HomePage
                                playlists={playlists}
                                albums={albums}
                                onOpenPlaylistModal={openPlaylistModal}
                                onOpenSystemModal={openSystemModal}
                                onOpenAlbumModal={openAlbumModal}
                                onOpenCreatePlaylistModal={openCreatePlaylistModal}
                            />
                        }
                    />
                    <Route
                        path="/favorites"
                        element={
                            <FavoritesPage
                                onOpenAlbumModal={openAlbumModal}
                                onOpenPlaylistModal={openPlaylistModal}
                            />
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <ProfilePage />
                        }
                    />
                    <Route
                        path="/settings"
                        element={
                            <SettingsPage />
                        }
                    />
                    <Route
                        path="/admin"
                        element={
                            <AdminLogin />
                        }
                    />
                    <Route
                        path="/moderation"
                        element={
                            <ModerationPage
                                onOpenAlbumModal={openAlbumModal}
                                onModerateAlbum={(album) => console.log('Модерировать:', album)}
                            />
                        }
                    />
                </Routes>

                {/* Модальные окна */}
                <PlaylistModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    playlistName={selectedPlaylist?.title || "Плейлист"}
                    authorName={selectedPlaylist?.author || "Автор"}
                    tracks={selectedPlaylist?.tracks || []}
                />

                <SystemPlaylistModal
                    isOpen={isSystemModalOpen}
                    onClose={closeModal}
                    playlistName={selectedPlaylist?.title || "Плейлист"}
                    tracks={selectedPlaylist?.tracks || []}
                />

                <AlbumModal
                    isOpen={isAlbumModalOpen}
                    onClose={closeModal}
                    albumName={albums[0]?.name || "Альбом"}
                    authorName={albums[0]?.author || "Автор"}
                    tracks={albums[0]?.tracks || []}
                />

                <CreatePlaylistModal
                    isOpen={isCreatePlaylistModalOpen}
                    onClose={closeModal}
                />

                <RegistrationModal
                    isOpen={isRegistrationModalOpen}
                    onClose={closeRegistrationModal}
                    onSwitchToLogin={switchToLogin}
                />

                <LoginModal
                    isOpen={isLoginModalOpen}
                    onClose={closeLoginModal}
                    onSwitchToRegistration={switchToRegistration}
                />
            </div>
        </Router>
    );
}

export default App;