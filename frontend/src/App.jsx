import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopBar from './components/TopBar';
import SideMenu from './components/SideMenu';
import HomePage from './pages/HomePage';
import CoinFlip from './pages/CoinFlip';
import BetMates from './pages/BetMates';
import CurrentBets from './pages/CurrentBets';
import MyPoints from './pages/MyPoints';
import LandingPage from './pages/LandingPage'; // Import the new LandingPage component

function App() {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track if user is logged in
    const toggleMenu = () => setMenuOpen(!isMenuOpen);

    // Simulated function to handle login (you'll replace this with your actual login logic)
    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    return (
        <Router>
            <div className="App">
                {isLoggedIn ? (
                    <>
                        <TopBar toggleMenu={toggleMenu} />
                        <SideMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} />
                    </>
                ) : null}
                <Routes>
                    <Route path="/" element={<LandingPage handleLogin={handleLogin} />} />
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

export default App;
