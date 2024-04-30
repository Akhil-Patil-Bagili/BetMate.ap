import logo from "../assets/logo.png";
import { HiHome, HiBell } from "react-icons/hi";
import { useEffect, useRef, useState } from 'react';
import { Link } from "react-router-dom";

function TopBar({ toggleMenu }) {
    const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
    const submenuRef = useRef(); 

    const toggleSubmenu = () => {
        setIsSubmenuOpen(!isSubmenuOpen);
    };

    const handleClickOutside = (event) => {
        if (submenuRef.current && !submenuRef.current.contains(event.target)) {
            setIsSubmenuOpen(false);
        }
    };

    useEffect(() => {
        if (isSubmenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSubmenuOpen]);


    return (
        <div className="bg-gray-800 text-white flex justify-between items-center px-4 py-2 fixed w-full z-50">
            <div className="flex items-center space-x-4">
                <button onClick={toggleMenu} className="md:hidden p-2 mr-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                </button>
                <Link to="/home">
                    <img src={logo} alt="Bet Mate Logo" className="h-12 w-auto hover:opacity-75"/>
                </Link>
            </div>
            <div className="flex-grow flex justify-end items-center space-x-6">
                <Link to="/home" className="hidden md:flex items-center hover:text-gray-300">
                    <HiHome className="w-6 h-6" fill="currentColor" />
                </Link>
                <Link to="#notifications" className="flex items-center hover:text-gray-300">
                    <HiBell className="w-6 h-6" fill="currentColor" />
                </Link>
                <div className="relative">
                    <button onClick={toggleSubmenu} className="block">
                        <img src="/profile.jpg" alt="Profile" className="h-8 w-8 rounded-full hover:opacity-75" />
                    </button>
                    {isSubmenuOpen && (
                        <div className="absolute right-0 w-48 bg-gray-700 mt-2 py-2 rounded shadow-lg z-50">
                            <Link to="#profile" className="block px-4 py-2 text-sm text-white hover:bg-gray-600">Profile</Link>
                            <Link to="#logout" className="block px-4 py-2 text-sm text-white hover:bg-gray-600">Logout</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TopBar;
