import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
    const token = localStorage.getItem('auth_token');

    if (!token) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
