import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import axios from 'axios';
import TopBar from './components/TopBar';
import SideMenu from './components/SideMenu';
import HomePage from './pages/HomePage';
import CoinFlip from './pages/CoinFlip';
import BetMates from './pages/BetMates';
import CurrentBets from './pages/CurrentBets';
import MyPoints from './pages/MyPoints';
import LandingPage from './pages/LandingPage';
import {SignIn} from './pages/SignIn';
import {SignUp} from './pages/SignUp';
import { API_ENDPOINTS } from './apiConfig';

function AppWrapper() {
    return (
        <AuthProvider>
            <App />
        </AuthProvider>
    );
}

function App() {
    const { user, setUser } = useAuth();
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const toggleMenu = () => setMenuOpen(!isMenuOpen);

    useEffect(() => {
        axios.get(API_ENDPOINTS.validate, { withCredentials: true })
            .then(response => {
                console.log('Validation successful, user:', response.data);
                setUser(response.data.user);  // Update according to your actual response structure
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Authentication validation failed:', error);
                setIsLoading(false);
            });
    }, [setUser]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Router>
            <div className="App">
                {user && (
                    <>
                        <TopBar toggleMenu={toggleMenu} />
                        <SideMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} />
                    </>
                )}
                <Routes>
                    <Route path="/" element={user ? <Navigate to="/home" /> : <LandingPage />} />
                    <Route path="/signin" element={user ? <Navigate to="/home" /> : <SignIn />} />
                    <Route path="/signup" element={user ? <Navigate to="/home" /> : <SignUp />} />
                    <Route path="/home" element={user ? <HomePage /> : <Navigate to="/signin" />} />
                    <Route path="/coin-flip" element={user ? <CoinFlip /> : <Navigate to="/signin" />} />
                    <Route path="/betmates" element={user ? <BetMates /> : <Navigate to="/signin" />} />
                    <Route path="/current-bets" element={user ? <CurrentBets /> : <Navigate to="/signin" />} />
                    <Route path="/my-points" element={user ? <MyPoints /> : <Navigate to="/signin" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default AppWrapper;
