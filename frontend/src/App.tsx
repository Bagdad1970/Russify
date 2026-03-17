import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import ProtectedRoute from './ProtectedRoute.tsx';
import HomePage from './pages/HomePage.tsx';
import FavoritesPage from './pages/FavoritesPage.tsx';
import ProfilePage from './pages/ProfilePage.tsx';
import SettingsPage from './pages/SettingsPage.tsx';

import AppBar from './components/AppBar.tsx';
import PlaylistModal from './components/PlaylistModal.tsx';
import SystemPlaylistModal from './components/SystemPlaylistModal.tsx';
import AlbumModal from './components/AlbumModal';
import CreatePlaylistModal from './components/CreatePlaylistModal';
import RegistrationModal from "./components/RegistrationModal.tsx";
import LoginModal from "./components/LoginModal.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import ModerationPage from "./pages/ModerationPage.tsx";
import SystemPlaylistsPage from "./pages/SystemPlaylistPage.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";

import { ThemeProvider } from './context/ThemeContext';
import {favoriteStore} from "./store/useFavoriteStore.ts";


function App() {
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSystemModalOpen, setIsSystemModalOpen] = useState(false);
    const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
    const [isCreatePlaylistModalOpen, setIsCreatePlaylistModalOpen] = useState(false);

    const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);


    useEffect(() => {
        favoriteStore.loadFavorites();
    }, []);

    const albums = [
        {
            name: "Альбом",
            author: "Автор",
            tracks: [
                { title: "Трек 1", artist: "Автор" },
                { title: "Трек 2", artist: "Автор" },
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
        localStorage.removeItem('auth_modal_open');
        setIsRegistrationModalOpen(false);
    };

    const closeLoginModal = () => {
        localStorage.removeItem('auth_modal_open');
        setIsLoginModalOpen(false);
    };

    const switchToLogin = () => {
        localStorage.removeItem('auth_modal_open');
        setIsRegistrationModalOpen(false);
        setIsLoginModalOpen(true);
    };

    const switchToRegistration = () => {
        localStorage.removeItem('auth_modal_open');
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

    const handlePlaylistUpdate = (playlist: any) => {
        console.log('Плейлист обновлён:', playlist);
        // Здесь можно добавить API-вызов или обновление состояния
    };

    const handlePlaylistDelete = (id: number) => {
        console.log('Плейлист удалён:', id);
        // Здесь можно добавить API-вызов
    };

    const handlePlaylistCreate = (playlist: any) => {
        console.log('Плейлист создан:', playlist);
        // Здесь можно добавить API-вызов
    };

    useEffect(() => {
    }, []);


    useEffect(() => {
        const handleOpenAuthModal = (event: CustomEvent) => {
            if (event.detail?.type === 'registration') {
                openRegistrationModal();
            }
        };

        window.addEventListener('openAuthModal', handleOpenAuthModal as EventListener);

        return () => {
            window.removeEventListener('openAuthModal', handleOpenAuthModal as EventListener);
        };
    }, []);

    return (
        <ThemeProvider>
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
                            <ProtectedRoute>
                                <FavoritesPage
                                    onOpenAlbumModal={openAlbumModal}
                                    onOpenPlaylistModal={openPlaylistModal}
                                />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <ProfilePage />
                            </ProtectedRoute>
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
                    <Route
                        path="/system-playlists"
                        element={
                            <SystemPlaylistsPage
                                onPlaylistUpdate={handlePlaylistUpdate}
                                onPlaylistDelete={handlePlaylistDelete}
                                onPlaylistCreate={handlePlaylistCreate}
                            />
                        }
                    />
                    <Route path="/admin/dashboard"
                           element={<AdminDashboard />}
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
        </ThemeProvider>
    );
}

export default App;