import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/pages/AdminLogin.css';

const AdminLogin = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.username || !formData.password) {
            setError('Пожалуйста, заполните все поля');
            return;
        }

        // Здесь будет логика аутентификации
        console.log('Попытка входа:', formData);

        // Пример проверки (замените на реальную логику)
        if (formData.username === 'admin' && formData.password === 'admin123') {
            navigate('/admin/dashboard');
        } else {
            setError('Неверное имя пользователя или пароль');
        }
    };

    return (
        <div className="admin-login-container">
            <div className="login-card">
                <h1 className="login-title">Admin Panel</h1>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="username" className="form-label">
                            Имя пользователя
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="form-input"
                            placeholder="Введите имя пользователя"
                            autoComplete="off"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">
                            Пароль
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="form-input"
                            placeholder="Введите пароль"
                        />
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="login-button"
                    >
                        Войти
                    </button>
                </form>

                <div className="login-footer">

                </div>
            </div>
        </div>
    );
};

export default AdminLogin;