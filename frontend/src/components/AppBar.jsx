import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';
import logo from '../assets/logo.png';

const AppBar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-gray-800 text-white flex justify-between items-center px-4 py-2 fixed w-full z-50">
            <div className="flex items-center space-x-4">
                <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2">
                    {isOpen ? <HiX className="w-6 h-6"/> : <HiMenu className="w-6 h-6"/>}
                </button>
                <a href="/">
                    <img src={logo} alt="FriendlyBet Logo" className="h-12 w-auto hover:opacity-75" />
                </a>
                
            </div>
            <nav className={`${isOpen ? 'flex' : 'hidden'} flex-col md:flex md:flex-row space-x-0 md:space-x-6 fixed md:relative md:top-0 top-14 left-0 md:w-auto w-3/4 h-full bg-gray-800 md:bg-transparent z-40`}>
                <Link to="/" className="hover:text-gray-400 text-gray-200 font-normal p-2">Home</Link>
                <Link to="/about" className="hover:text-gray-400 text-gray-200 font-normal p-2">About</Link>
                <Link to="/contact" className="hover:text-gray-400 text-gray-200 font-normal p-2">Contact</Link>
                <Link to="/signin" className="hover:text-gray-400 text-gray-200 font-normal p-2">Login</Link>
                <Link to="/signup" className="hover:text-gray-400 text-gray-200 font-normal p-2">Register</Link>
            </nav>
            {isOpen && <div className="fixed inset-0 bg-black opacity-50 md:hidden" onClick={() => setIsOpen(false)}></div>}
        </div>
    );
};

export default AppBar;
