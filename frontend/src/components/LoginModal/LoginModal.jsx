import React, { useState, useRef, useEffect } from 'react';
import './LoginModal.css';

const LoginModal = ({ isOpen, onClose, onSwitchToRegistration }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [inputKey, setInputKey] = useState(Date.now());

    const modalRef = useRef(null);
    const passwordInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (isOpen) {
            setFormData({
                username: '',
                password: ''
            });
            setErrors({});
            setIsSubmitted(false);
            setInputKey(Date.now());

            const appBarHeight = 56;
            const modalWidth = 400;
            const modalHeight = 400;
            const left = (window.innerWidth - modalWidth) / 2;
            const top = appBarHeight + (window.innerHeight - appBarHeight - modalHeight) / 2 - 20;
            setPosition({ x: left, y: top });
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
            if (!formData.username.trim()) {
                newErrors.username = 'Имя пользователя обязательно';
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
    };

    const handleKeyDown = (e) => {
        if (e.ctrlKey || e.metaKey) {
            const key = e.key.toLowerCase();
            if (['a', 'z', 'c', 'v', 'x'].includes(key)) {
                return;
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);

        const isValid = !!(formData.username.trim() && formData.password);

        if (isValid) {
            console.log('Вход:', formData);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="logm-overlay">
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
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#ffffff" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="logm-divider"></div>

                {/* Форма */}
                <form className="logm-form" onSubmit={handleSubmit}>
                    <div className="logm-input-group">
                        <input
                            type="text"
                            name="username"
                            className={`logm-input ${errors.username ? 'error' : ''}`}
                            placeholder="Введите имя пользователя"
                            value={formData.username}
                            onChange={handleChange}
                            autoComplete="off"
                        />
                        {errors.username && <div className="logm-error">{errors.username}</div>}
                    </div>

                    <div className="logm-input-group">
                        <input
                            ref={passwordInputRef}
                            key={`password-${inputKey}`}
                            type="password"
                            name="password"
                            className={`logm-input ${errors.password ? 'error' : ''}`}
                            placeholder="Введите пароль"
                            value={formData.password}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            autoComplete="new-password"
                        />
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

                {/* Ссылка на регистрацию */}
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