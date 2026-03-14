import { useCallback } from 'react';

export const useAuthModal = () => {
    const requireAuth = useCallback((action: () => void) => {
        const token = localStorage.getItem('auth_token');

        if (token) {
            action();
        } else {
            const isModalOpen = localStorage.getItem('auth_modal_open');

            if (!isModalOpen) {
                localStorage.setItem('auth_modal_open', 'true');

                const event = new CustomEvent('openAuthModal', {
                    detail: { type: 'registration' }
                });
                window.dispatchEvent(event);
            }
        }
    }, []);

    return { requireAuth };
};