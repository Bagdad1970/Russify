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
    const [showRequirements, setShowRequirements] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [inputKey, setInputKey] = useState(Date.now());

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
            setShowRequirements(false);
            setIsSubmitted(false);
            setInputKey(Date.now());

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
            }

            if (!formData.email.trim()) {
                newErrors.email = 'Email обязателен';
            } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                newErrors.email = 'Некорректный email';
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
    };

    const handleKeyDown = (e) => {
        if (e.ctrlKey || e.metaKey) {
            const key = e.key.toLowerCase();
            if (['a', 'z', 'c', 'v', 'x'].includes(key)) {
                return;
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);

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
            } catch (error) {
                console.error('Ошибка регистрации:', error);
            }
        }
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
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#ffffff" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Разделитель */}
                <div className="regm-divider"></div>

                {/* Форма */}
                <form className="regm-form" onSubmit={handleSubmit}>
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
                        <input
                            ref={passwordInputRef}
                            key={`password-${inputKey}`}
                            type="password"
                            name="password"
                            className={`regm-input ${errors.password ? 'error' : ''}`}
                            placeholder="Введите пароль"
                            value={formData.password}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            autoComplete="new-password"
                        />
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
                        <input
                            key={`confirm-password-${inputKey}`}
                            type="password"
                            name="passwordConfirm"
                            className={`regm-input ${errors.passwordConfirm ? 'error' : ''}`}
                            placeholder="Повторите пароль"
                            value={formData.passwordConfirm}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            autoComplete="new-password"
                        />
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