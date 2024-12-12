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
                if (response.data && response.data.userId) {
                    setUser({
                        userId: response.data.userId,
                        firstName: response.data.firstName, // Assuming these are part of the response
                        lastName: response.data.lastName,
                        isAdmin: response.data.isAdmin,
                    
                    });
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Error during user validation:", error);
                setUser(null);
            }
            setLoading(false);
        };

        verifyUser();

        return () => {
        };
    }, []);

    const logout = async () => {
        try {
            await axios.get(API_ENDPOINTS.logout, { withCredentials: true });
            setUser(null); // Clears the user upon logout
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
