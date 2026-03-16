import { useState, useEffect } from 'react';
import '../assets/styles/pages/SettingsPage.css';
import { AuthManager } from '../api/AuthManager.ts';
import { useTheme } from '../hooks/useTheme';

import SettingsHeader from '../components/SettingsHeader.tsx';

const SettingsPage = () => {
    const { theme, toggleTheme } = useTheme();
    const [language, setLanguage] = useState("ru");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const authManager = new AuthManager();

    const checkAuth = () => {
        const token = localStorage.getItem('auth_token');
        setIsAuthenticated(!!token);
    };

    useEffect(() => {
        checkAuth();

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'auth_token' || e.key === null) {
                checkAuth();
            }
        };

        const handleAuthChange = () => {
            checkAuth();
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('authChange', handleAuthChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('authChange', handleAuthChange);
        };
    }, []);

    const toggleLanguage = () => {
        setLanguage(language === "ru" ? "en" : "ru");
    };

    const handleAccountChange = () => {
        console.log("Сменить аккаунт");
    };

    const openRegistrationModal = () => {
        const event = new CustomEvent('openAuthModal', {
            detail: { type: 'registration' }
        });
        window.dispatchEvent(event);
    };

    const handleLogout = async () => {
        try {
            await authManager.logout();
            // После выхода вызываем событие для обновления
            window.dispatchEvent(new Event('authChange'));
        } catch (error) {
            console.error('Ошибка при выходе:', error);
        }
    };

    return (
        <div className="settings-page-container">
            <SettingsHeader />

            <div className="settings-bottom-section">
                <div className="settings-section">
                    <div className="settings-section-title">Общие</div>

                    <div className="settings-option">
                        <div className="settings-option-label">Тема оформления</div>
                        <button
                            className="settings-toggle-btn"
                            onClick={toggleTheme}
                        >
                            {theme === "dark" ? "Темная" : "Светлая"}
                        </button>
                    </div>

                    <div className="settings-option">
                        <div className="settings-option-label">Язык</div>
                        <button
                            className="settings-select-btn"
                            onClick={toggleLanguage}
                        >
                            {language === "ru" ? "Русский" : "English"}
                        </button>
                    </div>
                </div>


                {/* Блок для неавторизованных */}
                {!isAuthenticated && (
                    <div className="settings-section">
                        <div className="settings-section-title">Профиль</div>

                        <div className="settings-option">
                            <button
                                className="settings-login-btn"
                                onClick={openRegistrationModal}
                            >
                                Войти в аккаунт
                            </button>
                        </div>
                    </div>
                )}

                {/* Блок профиля для авторизованных */}
                {isAuthenticated && (
                    <div className="settings-section">
                        <div className="settings-section-title">Профиль</div>

                        <div className="settings-option">
                            <div className="settings-option-label">Аватар</div>
                            <div className="settings-avatar-change">
                                <button className="settings-avatar-btn">Сменить</button>
                            </div>
                        </div>

                        <div className="settings-option">
                            <div className="settings-option-label">Сменить аккаунт</div>
                            <button
                                className="settings-account-btn"
                                onClick={handleAccountChange}
                            >
                                Сменить
                            </button>
                        </div>

                        <div className="settings-option">
                            <button
                                className="settings-logout-btn"
                                onClick={handleLogout}
                            >
                                Выйти
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SettingsPage;