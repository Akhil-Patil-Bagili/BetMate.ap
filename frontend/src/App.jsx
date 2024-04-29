import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import { PrivateRoute } from './components/PrivateRoute';

function App() {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Assume user is not logged in initially

    const toggleMenu = () => setMenuOpen(!isMenuOpen);

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem("token"); // Clear token on logout
    };

    return (
        <Router>
            <div className="App">
                {isLoggedIn && (
                    <>
                        <TopBar toggleMenu={toggleMenu} handleLogout={handleLogout} />
                        <SideMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} />    
                    </>
                )}
                <Routes>
                    <Route path="/" element={!isLoggedIn ? <LandingPage /> : <Navigate to="/home" />} />
                    <Route path="/signin" element={<SignIn handleLogin={handleLogin} />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/home" element={<PrivateRoute isLoggedIn={isLoggedIn}><HomePage /></PrivateRoute>} />
                    <Route path="/coin-flip" element={<PrivateRoute isLoggedIn={isLoggedIn}><CoinFlip /></PrivateRoute>} />
                    <Route path="/betmates" element={<PrivateRoute isLoggedIn={isLoggedIn}><BetMates /></PrivateRoute>} />
                    <Route path="/current-bets" element={<PrivateRoute isLoggedIn={isLoggedIn}><CurrentBets /></PrivateRoute>} />
                    <Route path="/my-points" element={<PrivateRoute isLoggedIn={isLoggedIn}><MyPoints /></PrivateRoute>} />
                </Routes>
            </div>
        </Router>
    );
}


export default App;
