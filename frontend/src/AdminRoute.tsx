import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { authManager } from './api/AuthManager.ts';
import type { MeResponse } from './types/request/auth/MeResponse.ts';

const ADMIN_ROLE_ID = 1;

const resolveRoleId = (user: MeResponse | null): number | undefined => {
    return user?.roleId ?? user?.roleID;
};

const AdminRoute = ({ children }: { children: React.ReactElement }) => {
    const token = localStorage.getItem('auth_token');
    const [user, setUser] = useState<MeResponse | null>(() => {
        const cached = localStorage.getItem('auth_user');
        return cached ? JSON.parse(cached) as MeResponse : null;
    });
    const [isLoading, setIsLoading] = useState(Boolean(token) && !user);

    useEffect(() => {
        if (!token || user) {
            return;
        }

        let isMounted = true;

        const hydrateUser = async () => {
            try {
                const currentUser = await authManager.getCurrentUser();
                if (isMounted) {
                    setUser(currentUser);
                }
            } catch (error) {
                console.error('Failed to resolve current user for admin route', error);
                localStorage.removeItem('auth_token');
                localStorage.removeItem('auth_user');
                if (isMounted) {
                    setUser(null);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        void hydrateUser();

        return () => {
            isMounted = false;
        };
    }, [token, user]);

    if (!token) {
        return <Navigate to="/admin" replace />;
    }

    if (isLoading) {
        return <div style={{ padding: '24px' }}>Проверка доступа...</div>;
    }

    if (!user || resolveRoleId(user) !== ADMIN_ROLE_ID) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminRoute;
