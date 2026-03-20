import '../assets/styles/components/ProfileHeader.css';
import { useEffect, useState } from "react";
import type { MeResponse } from "../types/request/auth/MeResponse.ts";
import { AuthManager } from "../api/AuthManager.ts";
import { FileManager } from "../api/FileManager.ts";
import defaultAvatar from '../assets/images/no-cover.svg';

const ProfileHeader = () => {
    const [userData, setUserData] = useState<MeResponse>();
    const [avatarUrl, setAvatarUrl] = useState<string>("");
    const authManager = new AuthManager();
    const fileManager = new FileManager();

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const data = await authManager.getCurrentUser();
                setUserData(data);
                if (data.avatarHash) {
                    try {
                        const avatar = await fileManager.getFileUrl("images", data.avatarHash);
                        if (avatar) {
                            setAvatarUrl(avatar);
                        }
                    } catch (err) {
                        console.error('Error loading avatar:', err);
                    }
                }
            } catch (err) {
                console.log("Error loading user data:", err);
            }
        };

        loadUserData();
    }, []);

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return "";
        const months = [
            "января", "февраля", "марта", "апреля", "мая", "июня",
            "июля", "августа", "сентября", "октября", "ноября", "декабря"
        ];
        const d = new Date(dateStr);
        const day = String(d.getDate()).padStart(2, '0');
        const month = months[d.getMonth()];
        const year = d.getFullYear();
        return `${day} ${month} ${year}`;
    };

    return (
        <div className="profile-header-full-width">
            <div className="content-area">
                <div className="profile-header">
                    <div className="profile-avatar">
                        <div className="avatar-image">
                            {avatarUrl ? (
                                <img
                                    src={avatarUrl}
                                    alt="Avatar"
                                    width="120"
                                    height="120"
                                    style={{ borderRadius: '50%', objectFit: 'cover' }}
                                    onError={(e) => {
                                        console.log('Avatar load error, using default');
                                        e.currentTarget.src = defaultAvatar;
                                    }}
                                />
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120" fill="#f1f1f1">
                                    <circle cx="60" cy="48" r="24" />
                                    <path d="M36 96c0-18 12-30 24-30s24 12 24 30" />
                                </svg>
                            )}
                        </div>
                    </div>
                    <div className="profile-info">
                        <div className="profile-name-line">
                            <div className="profile-full-name">
                                {userData?.username || "Пользователь"}
                            </div>
                        </div>
                        {userData?.createdAt && (
                            <div className="profile-registration-line">
                                Дата регистрации: {formatDate(userData.createdAt)}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;