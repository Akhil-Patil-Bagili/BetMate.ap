import { Link } from 'react-router-dom';
import heroImage from '../assets/heroImage.png';

const HeroSection = () => (
    <div className="flex flex-col md:flex-row items-center justify-between bg-gray-200 text-black pt-16 md:pt-0">
        <div className="md:w-1/2 p-4 md:p-6 md:py-16">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-8">Experience the Thrill of IPL Betting</h2>
            <p className="mb-4 md:mb-8 text-sm md:text-lg">Join now to place bets with your friends on upcoming IPL matches!</p>
            <div className="flex space-x-4">
                <Link to="/login" className="bg-gray-500 text-white px-6 py-2 rounded shadow hover:bg-gray-400 transition-colors">Login</Link>
                <Link to="/register" className="bg-gray-800 text-white px-6 py-2 rounded shadow hover:bg-gray-700 transition-colors">Get Started</Link>
            </div>
        </div>
        <div className="md:w-1/2 flex justify-center items-center p-4 md:p-20 bg-gray-200 md:mt-6">
            <img src={heroImage} alt="IPL Betting" className="max-w-xs md:max-w-full h-auto rounded-lg"/>
        </div>
    </div>
);


export default HeroSection;
