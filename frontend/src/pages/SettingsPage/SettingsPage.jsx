import React, { useState } from 'react';
import './SettingsPage.css';

// Компоненты
import SettingsHeader from '../../components/SettingsHeader/SettingsHeader';

const SettingsPage = () => {
    const [theme, setTheme] = useState("dark");
    const [language, setLanguage] = useState("ru");

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    const toggleLanguage = () => {
        setLanguage(language === "ru" ? "en" : "ru");
    };

    const handleAccountChange = () => {
        console.log("Сменить аккаунт");
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
                        <button className="settings-logout-btn">Выйти</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;