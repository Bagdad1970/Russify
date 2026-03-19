import { useState, useRef, useEffect } from 'react';
import '../assets/styles/components/LoginModal.css';
import type {LoginUserDto} from "../types/request/auth/LoginUserDto.ts";
import {AuthManager} from "../api/AuthManager.ts";

const LoginModal = ({ isOpen, onClose, onSwitchToRegistration }) => {
    const [formData, setFormData] = useState<LoginUserDto>({
        email: '',
        password: ''
    });

    const authManager = new AuthManager();

    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [inputKey, setInputKey] = useState(Date.now());
    const [showPassword, setShowPassword] = useState(false);

    const modalRef = useRef(null);
    const passwordInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const [isPositionCalculated, setIsPositionCalculated] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setFormData({
                email: '',
                password: ''
            });
            setErrors({});
            setServerError('');
            setIsSubmitted(false);
            setInputKey(Date.now());
            setShowPassword(false);

            const appBarHeight = 56;
            const modalWidth = 400;
            const modalHeight = 400;
            const left = (window.innerWidth - modalWidth) / 2;
            const top = appBarHeight + (window.innerHeight - appBarHeight - modalHeight) / 2 - 20;
            setPosition({ x: left, y: top });

            setIsPositionCalculated(true);
        } else {
            setIsPositionCalculated(false);
        }
    }, [isOpen]);

    const handleMouseDown = (e) => {
        if (e.target.closest('.logm-header') && !e.target.closest('.logm-close-btn')) {
            setIsDragging(true);
            const rect = modalRef.current.getBoundingClientRect();
            setDragOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
        }
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;

        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;

        const modalRect = modalRef.current.getBoundingClientRect();
        const w = modalRect.width;
        const h = modalRect.height;

        const clampedX = Math.max(0, Math.min(newX, window.innerWidth - w));
        const clampedY = Math.max(56, Math.min(newY, window.innerHeight - h));

        setPosition({ x: clampedX, y: clampedY });
    };

    const handleMouseUp = () => setIsDragging(false);

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, dragOffset]);

    const validateForm = () => {
        const newErrors = {};

        if (isSubmitted) {
            if (!formData.email.trim()) {
                newErrors.email = 'Email обязателен';
            }

            if (!formData.password) {
                newErrors.password = 'Пароль обязателен';
            }
        }

        setErrors(newErrors);
    };

    useEffect(() => {
        validateForm();
    }, [formData, isSubmitted]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        setServerError('');
    };

    const handleKeyDown = (e) => {
        if (e.ctrlKey || e.metaKey) {
            const key = e.key.toLowerCase();
            if (['a', 'z', 'c', 'v', 'x'].includes(key)) {
                return;
            }
        }
    };

    const translateErrorMessage = (message: string): string => {
        const exactTranslations: { [key: string]: string } = {
            'Invalid email format': 'Некорректный формат email',
            'Email cannot be empty': 'Email обязателен',
            'Password cannot be empty': 'Пароль обязателен',

            'Bad credentials': 'Неверный email или пароль',
            'User not found': 'Пользователь не найден',
            'Invalid password': 'Неверный пароль',
            'Invalid email or password': 'Неверный email или пароль',

            'Bad Request': 'Неверный запрос',
            'Unauthorized': 'Неавторизованный доступ'
        };

        if (exactTranslations[message]) {
            return exactTranslations[message];
        }

        const lowerMessage = message.toLowerCase();

        const emailNotFoundMatch = message.match(/User with email (.+) not found/i);
        if (emailNotFoundMatch) {
            const email = emailNotFoundMatch[1];
            return `Пользователь с email ${email} не найден`;
        }

        const altEmailNotFoundMatch = message.match(/User not found with email (.+)/i);
        if (altEmailNotFoundMatch) {
            const email = altEmailNotFoundMatch[1];
            return `Пользователь с email ${email} не найден`;
        }

        const invalidPasswordMatch = message.match(/Invalid password for user (.+)/i);
        if (invalidPasswordMatch) {
            return 'Неверный пароль';
        }

        const emailExistsMatch = message.match(/User with email (.+) already exists/i);
        if (emailExistsMatch) {
            return 'Пользователь с таким email уже существует';
        }

        if (lowerMessage.includes('email not found') ||
            lowerMessage.includes('user not found')) {
            return 'Пользователь не найден';
        }

        if (lowerMessage.includes('invalid password') ||
            lowerMessage.includes('bad credentials') ||
            lowerMessage.includes('invalid email or password')) {
            return 'Неверный email или пароль';
        }

        return message;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitted(true);
        setServerError('');

        const isValid = !!(formData.email.trim() && formData.password);

        if (isValid) {
            try {
                console.log('Вход:', formData);
                await authManager.login(formData);
                onClose();
            } catch (error: any) {
                console.error('Ошибка входа:', error);
                console.log('Response data:', error.response?.data);

                if (error.response?.data) {
                    const serverErrorData = error.response.data;

                    if (serverErrorData.message) {
                        const errorMessage = serverErrorData.message;

                        if (typeof errorMessage === 'string') {
                            const lowerMessage = errorMessage.toLowerCase();

                            if (lowerMessage.includes('email')) {
                                setErrors(prev => ({ ...prev, email: translateErrorMessage(errorMessage) }));
                            } else if (lowerMessage.includes('password')) {
                                setErrors(prev => ({ ...prev, password: translateErrorMessage(errorMessage) }));
                            } else {
                                setServerError(translateErrorMessage(errorMessage));
                            }
                        } else if (Array.isArray(errorMessage)) {
                            const newErrors = {};
                            errorMessage.forEach((msg: string) => {
                                const translatedMsg = translateErrorMessage(msg);
                                const lowerMsg = msg.toLowerCase();

                                if (lowerMsg.includes('email')) {
                                    newErrors.email = translatedMsg;
                                } else if (lowerMsg.includes('password')) {
                                    newErrors.password = translatedMsg;
                                }
                            });
                            setErrors(prev => ({ ...prev, ...newErrors }));
                        }
                    } else if (serverErrorData.error) {
                        setServerError(translateErrorMessage(serverErrorData.error));
                    } else {
                        setServerError('Ошибка при входе. Попробуйте позже.');
                    }
                } else {
                    setServerError('Ошибка соединения с сервером');
                }
            }
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    if (!isOpen) return null;

    return (
        <div className="logm-overlay" style={{ opacity: isPositionCalculated ? 1 : 0 }}>
            <div
                ref={modalRef}
                className="logm-container"
                style={{ left: `${position.x}px`, top: `${position.y}px` }}
                onMouseDown={handleMouseDown}
            >
                {/* Заголовок */}
                <div className="logm-header">
                    <div className="logm-title">Вход</div>
                    <button className="logm-close-btn" onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                            fill="none"
                            strokeWidth="2"
                        >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="logm-divider"></div>

                {/* Форма */}
                <form className="logm-form" onSubmit={handleSubmit}>
                    {serverError && (
                        <div className="logm-server-error">
                            {serverError}
                        </div>
                    )}

                    <div className="logm-input-group">
                        <input
                            type="email"
                            name="email"
                            className={`logm-input ${errors.email ? 'error' : ''}`}
                            placeholder="Введите email"
                            value={formData.email}
                            onChange={handleChange}
                            autoComplete="off"
                        />
                        {errors.email && <div className="logm-error">{errors.email}</div>}
                    </div>

                    <div className="logm-input-group">
                        <div className="logm-password-wrapper">
                            <input
                                ref={passwordInputRef}
                                key={`password-${inputKey}`}
                                type={showPassword ? "text" : "password"}
                                name="password"
                                className={`logm-input logm-password-input ${errors.password ? 'error' : ''}`}
                                placeholder="Введите пароль"
                                value={formData.password}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                className="logm-password-toggle"
                                onClick={togglePasswordVisibility}
                                tabIndex="-1"
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                        <line x1="1" y1="1" x2="23" y2="23"></line>
                                    </svg>
                                )}
                            </button>
                        </div>
                        {errors.password && <div className="logm-error">{errors.password}</div>}
                    </div>

                    <button
                        type="submit"
                        className="logm-login-btn"
                        disabled={isSubmitted && Object.keys(errors).length > 0}
                    >
                        Войти
                    </button>
                </form>

                <div className="logm-divider"></div>

                <div className="logm-register-link">
                    Нет аккаунта?{' '}
                    <button className="logm-switch-btn" onClick={onSwitchToRegistration}>
                        Зарегистрироваться
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;