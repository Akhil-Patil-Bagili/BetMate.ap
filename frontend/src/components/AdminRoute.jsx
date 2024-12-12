import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AdminRoute({ children }) {
    const { user } = useAuth();

    if (!user || !user.isAdmin) {
        return <Navigate to="/signin" />;
    }

    return children;
}

export default AdminRoute;