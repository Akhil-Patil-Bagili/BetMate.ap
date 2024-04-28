import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopBar from './components/TopBar';
import SideMenu from './components/SideMenu';
import HomePage from './pages/HomePage';
import CoinFlip from './pages/CoinFlip';
import BetMates from './pages/BetMates';
import CurrentBets from './pages/CurrentBets';
import MyPoints from './pages/MyPoints';
import LandingPage from './pages/LandingPage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Footer from './components/Footer'; // Ensure you have a Footer component

function App() {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(true); // State to track if user is logged in

    const toggleMenu = () => setMenuOpen(!isMenuOpen);

    // Function to handle login (this should be adjusted to your actual login logic)
    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    // Function to handle logout
    const handleLogout = () => {
        setIsLoggedIn(false); // Update state to reflect logout
        // Here you would typically clear tokens or other session data
    };

    return (
        <Router>
            <div className="App">
                {isLoggedIn && (
                    <>
                        <TopBar toggleMenu={toggleMenu} />
                        <SideMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} />
                    </>
                )}
                <Routes>
                    <Route path="/" element={!isLoggedIn ? <LandingPage /> : <HomePage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/coin-flip" element={<CoinFlip />} />
                    <Route path="/betmates" element={<BetMates />} />
                    <Route path="/current-bets" element={<CurrentBets />} />
                    <Route path="/my-points" element={<MyPoints />} />
                    <Route path="/signin" element={<SignIn handleLogin={handleLogin} />} />
                    <Route path="/signup" element={<SignUp />} />
                </Routes>
                {/* {isLoggedIn && <Footer />} */}
            </div>
        </Router>
    );
}

export default App;
