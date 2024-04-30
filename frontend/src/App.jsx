import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MatchProvider } from './context/MatchContext';
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

function AppWrapper() {
    return (
        <AuthProvider>
            <MatchProvider>
                <App />
            </MatchProvider>
        </AuthProvider>
    );
}

function App() {
    const { user } = useAuth();
    const [isMenuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => setMenuOpen(!isMenuOpen);

    if (!user) {
        return (
            <Router>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="*" element={<Navigate replace to="/" />} />
                </Routes>
            </Router>
        );
    }

    return (
        <Router>
            <div className="App">
                <TopBar toggleMenu={toggleMenu} user={user} />
                <SideMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} user={user} />
                <Routes>
                    <Route path="/" element={<Navigate replace to="/home" />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/coin-flip" element={<CoinFlip />} />
                    <Route path="/betmates" element={<BetMates />} />
                    <Route path="/current-bets" element={<CurrentBets />} />
                    <Route path="/my-points" element={<MyPoints />} />
                </Routes>
            </div>
        </Router>
    );
}

export default AppWrapper;
