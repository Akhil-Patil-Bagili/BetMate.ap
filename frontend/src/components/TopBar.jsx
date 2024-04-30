import logo from "../assets/logo.png";
import { HiHome, HiBell } from "react-icons/hi";
import { useEffect, useRef, useState } from 'react';
import { Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../apiConfig";
import axios from "axios";

function TopBar({ toggleMenu, user}) {
    const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const submenuRef = useRef();
    console.log(user); 
    const initials = user && user.firstName && user.lastName ? `${user.firstName[0]}${user.lastName[0]}` : "??";

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

    const handleLogout = async () => {
        try {
          console.log("Attempting to logout...");
          await axios.get(API_ENDPOINTS.logout);
          setUser(null);
          console.log("Logout successful, navigating to signin...");
          navigate("/signin");
        } catch (error) {
          console.error("Logout failed:", error);
        }
      };

      const handleProfile =() => {
        console.log("profile clicked")
      }


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
                    <button onClick={toggleSubmenu} className="block bg-gray-100 text-black rounded-full w-9 h-9 flex justify-center items-center">
                        {initials}
                    </button>
                    {isSubmenuOpen && (
                        <div className="absolute right-0 w-48 bg-gray-700 mt-2 py-2 rounded shadow-lg z-50">
                            <ul className="py-1">
                                <li className="block px-4 py-2 text-sm text-white hover:bg-gray-600 cursor-pointer" onClick={handleProfile}>Profile</li>
                                <li className="block px-4 py-2 text-sm text-white hover:bg-gray-600 cursor-pointer" onClick={handleLogout}>Logout</li>
                            </ul>
                        </div>  
                    )}
                </div>
            </div>
        </div>
    );
}

export default TopBar;
