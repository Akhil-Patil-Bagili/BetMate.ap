import React, { useState, useEffect, useRef } from 'react';
import { TbCoinRupeeFilled } from 'react-icons/tb';
import axios from 'axios';
import { useMatch } from '../context/MatchContext';
import { API_ENDPOINTS } from '../apiConfig';
import { useAuth } from '../context/AuthContext';

function CoinFlip() {
    const { currentMatch } = useMatch();
    const [selectedOption, setSelectedOption] = useState('');
    const [betMate, setBetMate] = useState(null);
    const [result, setResult] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [flipping, setFlipping] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const {user} = useAuth();
    const searchRef = useRef(null);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [user]);

    const flipCoin = () => {
        setFlipping(true);
        setTimeout(() => {
            const outcomes = ['Heads', 'Tails'];
            const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
            setResult(randomOutcome);
            setFlipping(false);
            setShowModal(true);
        }, 2000);
    };

    const selectBetMate = (mate) => {
        setBetMate(mate);
        setSelectedOption('');
        setResult('');
        setSearchResults([]);
    };

    const handleSearch = async (e) => {
        setSearchTerm(e.target.value);
        if (e.target.value.length >= 1) {
            try {
                const response = await axios.get(`${API_ENDPOINTS.friends}/list/${user.userId}`, {
                    params: { query: e.target.value },
                    withCredentials: true 
                });
                setSearchResults(response.data.map(user => ({
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName
                })));
            } catch (error) {
                console.error('Error fetching search results:', error);
                setSearchResults([]);
            }
        } else {
            setSearchResults([]);
        }
    };

    const handleClickOutside = (event) => {
        if (searchRef.current && !searchRef.current.contains(event.target)) {
            setSearchResults([]);
        }
    };

    const placeBet = async (teamChoice) => {
        if (!betMate || !currentMatch) return;
    
        try {
            const response = await axios.post(`${API_ENDPOINTS.bets}/placeBet`, {
                userId: user.userId,
                opponentId: betMate.id, 
                matchId: currentMatch.id,
                choice: teamChoice,
            }, {
                withCredentials: true
            });
            console.log('Bet placed successfully:', response.data);
            setShowModal(false);
        } catch (error) {
            console.error('Failed to place bet:', error);
            alert('Failed to place bet. Please try again.');
        }
    };
    

    return (
        <div className="pt-20 lg:pl-64 p-8 bg-gray-100 min-h-screen">
            <div className="max-w-4xl mx-auto shadow-lg p-6 bg-white rounded-lg">
                <div className="mb-4 text-center">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">Choose Your Betmate First</h1>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearch}
                        placeholder="Search for your Betmate..."
                        className="text-gray-800 p-3 w-full rounded-lg border border-gray-400 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition"
                    />
                     <div ref={searchRef}>
                        {searchResults.length > 0 && (
                            <ul className="absolute w-72 mt-2 bg-white shadow-lg max-h-60 overflow-auto border border-gray-300 rounded-lg">
                                {searchResults.map(mate => (
                                    <li key={mate.id} className="flex justify-between items-center p-3 hover:bg-gray-100 cursor-pointer" onClick={() => selectBetMate(mate)}>
                                        <span>{mate.firstName} {mate.lastName} </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    {betMate && (
                        <div className="mt-6 flex items-center justify-center gap-8 text-gray-800">
                            <span className="text-2xl font-bold">{betMate.firstName}<span className="text-gray-500 mx-2">VS</span> You</span>
                        </div>
                    )}
                </div>

                <div className="flex justify-center items-center gap-6 mb-4">
                    <button onClick={() => setSelectedOption('Heads')} disabled={!betMate}
                            className={`px-6 py-3 text-lg font-medium rounded-full transition-colors w-36 text-center ${selectedOption === 'Heads' ? 'bg-gray-700 text-white' : 'bg-gray-300 text-gray-800'}`}>
                        Heads
                    </button>
                    <span className="text-gray-800 font-bold text-lg">OR</span>
                    <button onClick={() => setSelectedOption('Tails')} disabled={!betMate}
                            className={`px-6 py-3 text-lg font-medium rounded-full transition-colors w-36 text-center ${selectedOption === 'Tails' ? 'bg-gray-700 text-white' : 'bg-gray-300 text-gray-800'}`}>
                        Tails
                    </button>
                </div>

                <div className="flex flex-col items-center">
                    <TbCoinRupeeFilled className={`text-9xl text-gray-800 ${flipping ? 'animate-spin' : ''}`} />
                    <button onClick={flipCoin} disabled={flipping || !selectedOption || !betMate}
                            className="px-6 py-3 mt-4 bg-gray-700 text-white rounded-full shadow-lg hover:bg-gray-800 disabled:bg-gray-400 transition-colors">
                        Flip the Coin
                    </button>
                </div>

                {showModal && (
                    <div className={`fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center`}>
                        <div className="bg-white p-6 rounded-lg shadow-lg text-center md:ml-24">
                            <h2 className={`text-xl font-bold ${result === selectedOption ? 'text-green-500' : 'text-red-500'}`}>
                                {result === selectedOption ? 'Congratulations! You won the toss!' : 'Sorry, You lost the toss.'}
                            </h2>
                            {result === selectedOption && (
                                <div className="mt-4">
                                    <p className="mb-2">Choose your team now:</p>
                                    <button onClick={() => placeBet(currentMatch.team1)} className="mx-2 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition-colors">{currentMatch.team1}</button>
                                    <button onClick={() => placeBet(currentMatch.team2)} className="mx-2 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition-colors">{currentMatch.team2}</button>
                                    <button onClick={() => setShowModal(false)} className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Skip for now</button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CoinFlip;
