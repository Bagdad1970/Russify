import '../assets/styles/components/ProfileHeader.css';

const ProfileHeader = () => {
    const user = {
        avatar: "",
        firstName: "Иван",
        lastName: "Иванов",
        registrationDate: "2024-05-15",
        monthlyPlays: 1234
    };

    const formatDate = (dateStr) => {
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
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120" fill="#f1f1f1">
                                <circle cx="60" cy="48" r="24" />
                                <path d="M36 96c0-18 12-30 24-30s24 12 24 30" />
                            </svg>
                        </div>
                    </div>
                    <div className="profile-info">
                        <div className="profile-name-line">
                            <div className="profile-full-name">
                                {user.firstName} {user.lastName}
                            </div>
                        </div>
                        <div className="profile-registration-line">
                            Дата регистрации: {formatDate(user.registrationDate)}
                        </div>
                        <div className="profile-monthly-plays-line">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="#aaa" style={{ marginRight: '8px' }}>
                                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                            </svg>
                            {user.monthlyPlays} прослушиваний в месяц
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;