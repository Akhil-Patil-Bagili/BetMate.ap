import { HiOutlineLogout } from "react-icons/hi";
import {Link} from "react-router-dom"
import axios from "axios";
import { useAuth } from '../context/AuthContext';
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../apiConfig";

function SideMenu({ isOpen, toggleMenu }) {
  const topBarHeight = '64px'; 
  const navigate = useNavigate();
  const { setUser } = useAuth();

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
  

  return (
    <div className={`bg-gray-700 text-white w-64 space-y-2 py-2 fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:fixed transition duration-300 ease-in-out h-full`}
         style={{ top: topBarHeight }}>
      <button onClick={toggleMenu} className="text-white p-2 absolute right-2 top-2 md:hidden">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
      <Link to="/home" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-600">Home</Link>
      <Link to="/betmates" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-600">Betmates</Link>
      <Link to="/current-bets" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-600">Current Bets</Link>
      <Link to="/my-points" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-600">My Points</Link>
      <Link to="#analytics" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-600">Analytics (Coming Soon)</Link>
      <button onClick={handleLogout} className="mt-10 flex items-center justify-start w-full text-left py-2.5 px-4 rounded transition duration-200 hover:bg-gray-600">
        <HiOutlineLogout className="mr-2" size={24} />
        Logout
      </button>
    </div>
  );
}

export default SideMenu;
