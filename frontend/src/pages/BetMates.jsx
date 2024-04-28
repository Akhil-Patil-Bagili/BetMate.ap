import React, { useState, useEffect, useRef } from 'react';
import { HiOutlineUserAdd, HiCheck, HiX, HiOutlineClock } from 'react-icons/hi';
import { AiOutlineCheckCircle } from 'react-icons/ai';

function BetMates() {
    const [betMates, setBetMates] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [requestSent, setRequestSent] = useState({});
    const searchRef = useRef(null);  // Ref for the search results container

    useEffect(() => {
        setBetMates([
            { id: 1, name: "John Doe", image: "/default-profile.jpg" },
            { id: 2, name: "Jane Smith", image: "/default-profile.jpg" }
        ]);
        setPendingRequests([
            { id: 5, name: "Charlie Puth", image: "/default-profile.jpg" }
        ]);

        // Event listener to close search results when clicking outside
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setSearchResults([]);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        if (e.target.value.length > 1) {
            setSearchResults([
                { id: 3, name: "Alice Johnson", image: "/default-profile.jpg" },
                { id: 4, name: "Bob Brown", image: "/default-profile.jpg" }
            ]);
        } else {
            setSearchResults([]);
        }
    };

    const addBetMate = (id) => {
        setRequestSent(prev => ({ ...prev, [id]: true }));
        setTimeout(() => setRequestSent(prev => ({ ...prev, [id]: true })), 5000); // Keep the check icon for 5 seconds
    };

    const handleApproval = (id) => {
        console.log(`Approval for request ${id}`);
    };

    const handleRejection = (id) => {
        console.log(`Rejection for request ${id}`);
    };

    return (
        <div className="pt-20 lg:pl-64 px-8 bg-gray-100 min-h-screen">
            <div className="max-w-4xl mx-auto shadow-lg p-6 bg-white rounded-lg">
                <div className="mb-6 text-left">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">Add Betmates</h1>
                    <input
                        type="text"
                        placeholder="Search by username..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 transition"
                    />
                    <div ref={searchRef}>
                        {searchResults.length > 0 && (
                            <ul className="absolute w-72 mt-2 bg-white shadow-lg max-h-60 overflow-auto border border-gray-300 rounded-lg">
                                {searchResults.map(user => (
                                    <li key={user.id} className="flex justify-between items-center p-3 hover:bg-gray-100">
                                        <span>{user.name}</span>
                                        <button onClick={() => addBetMate(user.id)} className="text-gray-500 hover:text-gray-700">
                                            {requestSent[user.id] ? <HiOutlineClock className="text-yellow-500 text-xl" /> : <HiOutlineUserAdd className="text-xl" />}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mt-12  mb-3">Pending Requests</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                    {pendingRequests.map(request => (
                        <div key={request.id} className="flex items-center p-4 bg-gray-50 rounded-lg shadow">
                            <img src={request.image} alt={request.name} className="w-12 h-12 rounded-full mr-3"/>
                            <div className="flex-grow">
                                <h5 className="font-semibold">{request.name}</h5>
                            </div>
                            <div className="flex space-x-3">
                                <button onClick={() => handleApproval(request.id)} className="text-green-500 hover:text-green-600"><HiCheck className="text-xl" /></button>
                                <button onClick={() => handleRejection(request.id)} className="text-red-500 hover:text-red-600"><HiX className="text-xl" /></button>
                            </div>
                        </div>
                    ))}
                </div>

                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mt-12 mb-3">My Betmates</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                    {betMates.map(betMate => (
                        <div key={betMate.id} className="flex items-center p-4 bg-gray-50 rounded-lg shadow">
                            <img src={betMate.image} alt={betMate.name} className="w-12 h-12 rounded-full mr-3"/>
                            <div className="flex-grow">
                                <h5 className="font-semibold">{betMate.name}</h5>
                            </div>
                            <AiOutlineCheckCircle className="text-green-500" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default BetMates;
