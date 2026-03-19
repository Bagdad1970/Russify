import { useState, useRef, useEffect } from 'react';
import '../assets/styles/components/RegistrationModal.css';
import type {CreateUserDto} from "../types/request/auth/CreateUserDto.ts";
import {AuthManager} from "../api/AuthManager.ts";

const RegistrationModal = ({ isOpen, onClose, onSwitchToLogin }) => {
    const [formData, setFormData] = useState<CreateUserDto>({
        username: '',
        email: '',
        password: '',
        passwordConfirm: ''
    });

    const authManager = new AuthManager();

    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [showRequirements, setShowRequirements] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [inputKey, setInputKey] = useState(Date.now());
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const modalRef = useRef(null);
    const passwordInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const [isPositionCalculated, setIsPositionCalculated] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setFormData({
                username: '',
                email: '',
                password: '',
                passwordConfirm: ''
            });
            setErrors({});
            setServerError('');
            setShowRequirements(false);
            setIsSubmitted(false);
            setInputKey(Date.now());
            setShowPassword(false);
            setShowConfirmPassword(false);

            const appBarHeight = 56;
            const modalWidth = 400;
            const modalHeight = 500;
            const left = (window.innerWidth - modalWidth) / 2;
            const top = appBarHeight + (window.innerHeight - appBarHeight - modalHeight) / 2 - 20;
            setPosition({ x: left, y: top });

            setIsPositionCalculated(true);
        } else {
            setIsPositionCalculated(false);
        }
    }, [isOpen]);

    const handleMouseDown = (e) => {
        if (e.target.closest('.regm-header') && !e.target.closest('.regm-close-btn')) {
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

    const validatePassword = (password) => {
        const minLength = password.length >= 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        return { minLength, hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar };
    };

    const validateForm = () => {
        const newErrors = {};

        if (isSubmitted) {
            if (!formData.username.trim()) {
                newErrors.username = 'Имя пользователя обязательно';
            } else if (formData.username.trim().length < 3) {
                newErrors.username = 'Имя пользователя должно быть от 3 до 50 символов';
            } else if (formData.username.trim().length > 50) {
                newErrors.username = 'Имя пользователя должно быть от 3 до 50 символов';
            }

            if (!formData.email.trim()) {
                newErrors.email = 'Email обязателен';
            } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                newErrors.email = 'Некорректный формат email';
            } else if (formData.email.length > 100) {
                newErrors.email = 'Email не должен превышать 100 символов';
            }

            const passwordValidation = validatePassword(formData.password);
            const isPasswordValid = Object.values(passwordValidation).every(Boolean);

            if (!formData.password) {
                newErrors.password = 'Пароль обязателен';
            } else if (!isPasswordValid) {
                newErrors.password = 'Пароль не соответствует требованиям';
            }

            if (!formData.passwordConfirm) {
                newErrors.passwordConfirm = 'Подтвердите пароль';
            } else if (formData.password !== formData.passwordConfirm) {
                newErrors.passwordConfirm = 'Пароли не совпадают';
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

        if (name === 'password') {
            setShowRequirements(value.length > 0);
        }

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

            'Username cannot be empty': 'Имя пользователя обязательно',
            'Имя пользователя должно быть от 3 до 50 символов': 'Имя пользователя должно быть от 3 до 50 символов',
            'Email cannot be empty': 'Email обязателен',
            'Incorrect email format': 'Некорректный формат email',
            'Email must not exceed 100 characters': 'Email не должен превышать 100 символов',
            'Password cannot be empty': 'Пароль обязателен',
            'Password must contain from 6 to 255 characters': 'Пароль должен содержать от 6 до 255 символов',

            'Password too short': 'Пароль слишком короткий',

            'Bad Request': 'Неверный запрос'
        };

        if (exactTranslations[message]) {
            return exactTranslations[message];
        }

        const lowerMessage = message.toLowerCase();

        const emailExistsMatch = message.match(/User with email (.+) already exists/i);
        if (emailExistsMatch) {
            const email = emailExistsMatch[1];
            return `Пользователь с email ${email} уже существует`;
        }

        const usernameExistsMatch = message.match(/User with username (.+) already exists/i);
        if (usernameExistsMatch) {
            const username = usernameExistsMatch[1];
            return `Пользователь с именем ${username} уже существует`;
        }

        if (lowerMessage.includes('email already exists') ||
            lowerMessage.includes('duplicate key') && lowerMessage.includes('email') ||
            lowerMessage.includes('users_email_key')) {

            const emailMatch = message.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
            if (emailMatch) {
                return `Пользователь с email ${emailMatch[0]} уже существует`;
            }
            return 'Пользователь с таким email уже существует';
        }

        if (lowerMessage.includes('username already exists') ||
            lowerMessage.includes('duplicate key') && lowerMessage.includes('username') ||
            lowerMessage.includes('users_username_key')) {

            const usernameMatch = message.match(/username[:\s]+([a-zA-Z0-9_]+)/i) ||
                message.match(/'([a-zA-Z0-9_]+)'/);
            if (usernameMatch) {
                return `Пользователь с именем ${usernameMatch[1]} уже существует`;
            }
            return 'Имя пользователя уже занято';
        }

        return message;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);
        setServerError('');

        const passwordValidation = validatePassword(formData.password);
        const isPasswordValid = Object.values(passwordValidation).every(Boolean);

        const isValid = !!(formData.username.trim() &&
            formData.email.trim() &&
            formData.password &&
            formData.passwordConfirm &&
            isPasswordValid &&
            formData.password === formData.passwordConfirm);

        if (isValid) {
            try {
                console.log('Регистрация:', formData);
                await authManager.register(formData);
                onClose();
            } catch (error: any) {
                console.error('Ошибка регистрации:', error);
                console.log('Response data:', error.response?.data);

                if (error.response?.data) {
                    const serverErrorData = error.response.data;

                    if (serverErrorData.message) {
                        const errorMessage = serverErrorData.message;

                        if (typeof errorMessage === 'string') {
                            const lowerMessage = errorMessage.toLowerCase();

                            if (lowerMessage.includes('email')) {
                                setErrors(prev => ({ ...prev, email: translateErrorMessage(errorMessage) }));
                            } else if (lowerMessage.includes('username')) {
                                setErrors(prev => ({ ...prev, username: translateErrorMessage(errorMessage) }));
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
                                } else if (lowerMsg.includes('username')) {
                                    newErrors.username = translatedMsg;
                                } else if (lowerMsg.includes('password')) {
                                    newErrors.password = translatedMsg;
                                }
                            });
                            setErrors(prev => ({ ...prev, ...newErrors }));
                        }
                    } else if (serverErrorData.error) {
                        setServerError(translateErrorMessage(serverErrorData.error));
                    } else {
                        setServerError('Ошибка при регистрации. Попробуйте позже.');
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

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    if (!isOpen) return null;

    const passwordValidation = validatePassword(formData.password);

    return (
        <div className="regm-overlay" style={{ opacity: isPositionCalculated ? 1 : 0 }}>
            <div
                ref={modalRef}
                className="regm-container"
                style={{ left: `${position.x}px`, top: `${position.y}px` }}
                onMouseDown={handleMouseDown}
            >

                {/* Заголовок */}
                <div className="regm-header">
                    <div className="regm-title">Регистрация</div>
                    <button className="regm-close-btn" onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Разделитель */}
                <div className="regm-divider"></div>

                {/* Форма */}
                <form className="regm-form" onSubmit={handleSubmit}>
                    {serverError && (
                        <div className="regm-server-error">
                            {serverError}
                        </div>
                    )}

                    <div className="regm-input-group">
                        <input
                            type="text"
                            name="username"
                            className={`regm-input ${errors.username ? 'error' : ''}`}
                            placeholder="Введите имя пользователя"
                            value={formData.username}
                            onChange={handleChange}
                            autoComplete="off"
                        />
                        {errors.username && <div className="regm-error">{errors.username}</div>}
                    </div>

                    <div className="regm-input-group">
                        <input
                            type="email"
                            name="email"
                            className={`regm-input ${errors.email ? 'error' : ''}`}
                            placeholder="Введите email"
                            value={formData.email}
                            onChange={handleChange}
                            autoComplete="off"
                        />
                        {errors.email && <div className="regm-error">{errors.email}</div>}
                    </div>

                    <div className="regm-input-group">
                        <div className="regm-password-wrapper">
                            <input
                                ref={passwordInputRef}
                                key={`password-${inputKey}`}
                                type={showPassword ? "text" : "password"}
                                name="password"
                                className={`regm-input regm-password-input ${errors.password ? 'error' : ''}`}
                                placeholder="Введите пароль"
                                value={formData.password}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                className="regm-password-toggle"
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
                        {errors.password && <div className="regm-error">{errors.password}</div>}

                        {showRequirements && (
                            <div className="regm-password-requirements">
                                {!passwordValidation.minLength && (
                                    <div className="req-item">
                                        • Минимум 8 символов
                                    </div>
                                )}
                                {!passwordValidation.hasUpperCase && (
                                    <div className="req-item">
                                        • Одна заглавная буква
                                    </div>
                                )}
                                {!passwordValidation.hasLowerCase && (
                                    <div className="req-item">
                                        • Одна строчная буква
                                    </div>
                                )}
                                {!passwordValidation.hasNumbers && (
                                    <div className="req-item">
                                        • Одна цифра
                                    </div>
                                )}
                                {!passwordValidation.hasSpecialChar && (
                                    <div className="req-item">
                                        • Один спецсимвол
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="regm-input-group">
                        <div className="regm-password-wrapper">
                            <input
                                key={`confirm-password-${inputKey}`}
                                type={showConfirmPassword ? "text" : "password"}
                                name="passwordConfirm"
                                className={`regm-input regm-password-input ${errors.passwordConfirm ? 'error' : ''}`}
                                placeholder="Повторите пароль"
                                value={formData.passwordConfirm}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                className="regm-password-toggle"
                                onClick={toggleConfirmPasswordVisibility}
                                tabIndex="-1"
                            >
                                {showConfirmPassword ? (
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
                        {errors.passwordConfirm && <div className="regm-error">{errors.passwordConfirm}</div>}
                    </div>

                    <button
                        type="submit"
                        className="regm-register-btn"
                        disabled={isSubmitted && Object.keys(errors).length > 0}
                    >
                        Зарегистрироваться
                    </button>
                </form>

                <div className="regm-divider"></div>

                {/* Ссылка на вход */}
                <div className="regm-login-link">
                    Уже есть аккаунт?{' '}
                    <button className="regm-switch-btn" onClick={onSwitchToLogin}>
                        Войти
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegistrationModal;