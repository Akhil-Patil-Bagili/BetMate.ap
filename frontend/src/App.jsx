import React, { useState } from 'react';
import TopBar from './components/TopBar';
import SideMenu from './components/SideMenu';
import HomePage from './pages/HomePage';

function App() {
    const [isMenuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => setMenuOpen(!isMenuOpen);

    return (
        <div className="App">
            <TopBar toggleMenu={toggleMenu} />
            <SideMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} />
            <HomePage/>
        </div>
    );
}

export default App;
