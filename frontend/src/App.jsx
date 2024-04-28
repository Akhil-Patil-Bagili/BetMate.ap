import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopBar from './components/TopBar';
import SideMenu from './components/SideMenu';
import HomePage from './pages/HomePage';
import CoinFlip from './pages/CoinFlip'; 
import BetMates from './pages/BetMates';
import CurrentBets from './pages/CurrentBets';
import MyPoints from './pages/MyPoints';

function App() {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => setMenuOpen(!isMenuOpen);

    return (
        <Router>
            <div className="App">
                <TopBar toggleMenu={toggleMenu} />
                <SideMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/coin-flip" element={<CoinFlip />} />
                    <Route path="/betmates" element={<BetMates/>} />
                    <Route path="/current-bets" element={<CurrentBets/>} />
                    <Route path="/my-points" element={<MyPoints/>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
