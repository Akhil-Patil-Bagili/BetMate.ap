import React, { useState, useEffect, useRef } from 'react';
import { HiOutlineUserAdd, HiCheck, HiX, HiOutlineClock } from 'react-icons/hi';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import axios from 'axios';
import { API_ENDPOINTS } from "../apiConfig"
import { useAuth } from '../context/AuthContext'

function BetMates() {
    const [betMates, setBetMates] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [requestSent, setRequestSent] = useState({});
    const searchRef = useRef(null);  
    const { user } = useAuth();

    useEffect(() => {
        fetchBetMates();
        fetchPendingRequests();
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [user]);

    const fetchBetMates = async () => {
        if (!user) return;
        try {
            const response = await axios.get(`${API_ENDPOINTS.friends}/list/${user.userId}`, {
                withCredentials: true
            });
            setBetMates(response.data.map(betMate => ({
                id: betMate.id,
                name: `${betMate.firstName} ${betMate.lastName}`,
                username: betMate.username
            })));
        } catch (error) {
            console.error('Failed to fetch betmates:', error);
        }
    };

    const fetchPendingRequests = async () => {
        if (!user) return;
        try {
            const response = await axios.get(`${API_ENDPOINTS.friends}/pendingRequests`, {
                withCredentials: true
            });
            setPendingRequests(response.data);
        } catch (error) {
            console.error('Failed to fetch pending requests:', error);
        }
    };

    const handleSearch = async (e) => {
        setSearchTerm(e.target.value);
        if (e.target.value.length >= 1) {
            try {
                const response = await axios.get(`${API_ENDPOINTS.users}/search`, {
                    params: { query: e.target.value },
                    withCredentials: true 
                });
                setSearchResults(response.data.map(user => ({
                    id: user.id,
                    name: `${user.firstName} ${user.lastName}`,
                })));
            } catch (error) {
                console.error('Error fetching search results:', error);
                setSearchResults([]);
            }
        } else {
            setSearchResults([]);
        }
    };
    const addBetMate = async (addresseeId) => {
        if (requestSent[addresseeId]) {
            console.warn('Request already sent!');
            return; 
        }
    
        try {
            const requesterId = user.userId; 
            const response = await axios.post(API_ENDPOINTS.friends + '/sendRequest', {
                requesterId,
                addresseeId
            }, { withCredentials: true });
            setRequestSent(prev => ({ ...prev, [addresseeId]: true }));
            console.log('Request sent successfully:', response.data);
        } catch (error) {
            console.error('Failed to send friend request:', error);
            alert('Failed to send friend request. Please try again.');
        }
    };

    const handleApproval = async (requestId) => {
        try {
            await axios.put(`${API_ENDPOINTS.friends}/acceptRequest/${requestId}`, {}, { withCredentials: true });
            console.log('Approval successful');
            fetchBetMates();
            fetchPendingRequests();
        } catch (error) {
            console.error('Failed to approve friend request:', error);
            alert('Failed to approve friend request. Please try again.');
        }
    };
    
    const handleRejection = async (requestId) => {
        try {
            await axios.put(`${API_ENDPOINTS.friends}/declineRequest/${requestId}`, {}, { withCredentials: true });
            console.log('Rejection successful');
    
            fetchPendingRequests();
        } catch (error) {
            console.error('Failed to decline friend request:', error);
            alert('Failed to decline friend request. Please try again.');
        }
    };


    const handleClickOutside = (event) => {
        if (searchRef.current && !searchRef.current.contains(event.target)) {
            setSearchResults([]);
        }
    };

    return (
        <div className="pt-20 lg:pl-64 px-8 bg-gray-100 min-h-screen">
            <div className="max-w-4xl mx-auto shadow-lg p-6 bg-white rounded-lg">
                <div className="mb-6 text-left">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">Add Betmates</h1>
                    <input
                        type="text"
                        placeholder="Search for a betmate... "
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 transition"
                    />
                    <div ref={searchRef}>
                        {searchResults.length > 0 && (
                            <ul className="absolute w-72 mt-2 bg-white shadow-lg max-h-60 overflow-auto border border-gray-300 rounded-lg">
                                {searchResults.map(addresseUser => (
                                    <li key={addresseUser.id} className="flex justify-between items-center p-3 hover:bg-gray-100">
                                        <span>{addresseUser.name}</span>
                                        <button onClick={() => addBetMate(addresseUser.id)} className="text-gray-500 hover:text-gray-700">
                                            {requestSent[addresseUser.id] ? <HiOutlineClock className="text-yellow-500 text-xl" /> : <HiOutlineUserAdd className="text-xl" />}
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
