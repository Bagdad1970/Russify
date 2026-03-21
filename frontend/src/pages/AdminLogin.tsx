import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/pages/AdminLogin.css';
import { authManager } from '../api/AuthManager.ts';

const ADMIN_ROLE_ID = 1;

const resolveRoleId = (roleData: { roleId?: number; roleID?: number }) => {
    return roleData.roleId ?? roleData.roleID;
};

const AdminLogin = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [isCheckingAccess, setIsCheckingAccess] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            setIsCheckingAccess(false);
            return;
        }

        let isMounted = true;

        const resolveCurrentUser = async () => {
            try {
                const currentUser = await authManager.getCurrentUser();
                if (isMounted && resolveRoleId(currentUser) === ADMIN_ROLE_ID) {
                    navigate('/admin/dashboard', { replace: true });
                    return;
                }
            } catch (currentUserError) {
                console.error('Failed to resolve current user before admin login', currentUserError);
                localStorage.removeItem('auth_token');
                localStorage.removeItem('auth_user');
            } finally {
                if (isMounted) {
                    setIsCheckingAccess(false);
                }
            }
        };

        void resolveCurrentUser();

        return () => {
            isMounted = false;
        };
    }, [navigate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError('');
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            setError('Пожалуйста, заполните все поля');
            return;
        }

        try {
            await authManager.login({
                email: formData.email,
                password: formData.password
            });

            const currentUser = await authManager.getCurrentUser();
            if (resolveRoleId(currentUser) !== ADMIN_ROLE_ID) {
                await authManager.logout();
                setError('Недостаточно прав для входа в админ-панель');
                return;
            }

            navigate('/admin/dashboard', { replace: true });
        } catch (loginError) {
            console.error('Admin login failed', loginError);
            setError('Неверный email или пароль');
        }
    };

    if (isCheckingAccess) {
        return (
            <div className="admin-login-container">
                <div className="login-card">
                    <h1 className="login-title">Admin Panel</h1>
                    <div className="login-footer">Проверка доступа...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-login-container">
            <div className="login-card">
                <h1 className="login-title">Admin Panel</h1>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="form-input"
                            placeholder="Введите email"
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
