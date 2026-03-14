import { useState } from 'react';
import '../assets/styles/pages/SettingsPage.css';
import { AuthManager } from '../api/AuthManager.ts';

// Компоненты
import SettingsHeader from '../components/SettingsHeader.tsx';

const SettingsPage = () => {
    const [theme, setTheme] = useState("dark");
    const [language, setLanguage] = useState("ru");
    const authManager = new AuthManager();

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    const toggleLanguage = () => {
        setLanguage(language === "ru" ? "en" : "ru");
    };

    const handleAccountChange = () => {
        console.log("Сменить аккаунт");
    };

    const handleLogout = async () => {
        try {
            await authManager.logout();
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
            </div>
        </div>
    );
};

export default SettingsPage;