import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../apiConfig';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const response = await axios.get(API_ENDPOINTS.validate, { withCredentials: true });
                setUser(response.data.userId);
            } catch (error) {
                setUser(null);
            }
            setLoading(false);
        };
        verifyUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
