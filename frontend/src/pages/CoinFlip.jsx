import React, { useState, useEffect } from 'react';
import { TbCoinRupeeFilled } from 'react-icons/tb';
import axios from 'axios';
import { useMatch } from '../context/MatchContext';
import { API_ENDPOINTS } from '../apiConfig';
import { useAuth } from '../context/AuthContext';
import TeamSelectionModal from '../modals/TeamSelectionModal';

function CoinFlip() {
    const { currentMatch, setMatch } = useMatch();
    const [selectedOption, setSelectedOption] = useState('');
    const [result, setResult] = useState('');
    const [flipping, setFlipping] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const { user } = useAuth();


    const flipCoin = async () => {
        if (!currentMatch || !currentMatch.selectedBetmate) {
            alert('Please select a match and a betmate first.');
            return;
        }

        setFlipping(true);

        try {
            console.log("currentMatch checking")
            console.log(currentMatch)
            const response = await axios.post(`${API_ENDPOINTS.bets}/initiateToss`, {
                userId: user.userId,
                betmateId: currentMatch.selectedBetmate.id,
                matchId: currentMatch.id
            }, {
                withCredentials: true
            });

            console.log("responseeeeeee")
            console.log(response)

            if (response.data && response.data.matchBetmate) {
                const tossWinnerId = response.data.matchBetmate.tossWinnerId;
                setResult(tossWinnerId === user.userId ? 'win' : 'lose');
                setShowModal(true);

                // setMatch((prevMatch) => ({
                //     ...prevMatch,
                //     matchBetmates: (prevMatch.matchBetmates || []).map((mb) => 
                //         mb.betmateId === currentMatch.selectedBetmate.id
                //             ? { ...mb, status: tossWinnerId === user.userId ? 'toss_won' : 'toss_lose' }
                //             : mb
                //     ),
                // }));
            } else {
                alert('Failed to initiate toss or toss already initiated. Please try again.');
                setFlipping(false);
            }
        } catch (error) {
            console.error('Error initiating toss:', error);
            alert('Failed to initiate toss. Please try again.');
            setFlipping(false);
        }
    };

    const placeBet = async (teamChoice) => {
        if (!currentMatch || !currentMatch.selectedBetmate) {
            alert('Please select a match and a betmate first.');
            return;
        }

        try {
            const response = await axios.post(`${API_ENDPOINTS.bets}/chooseTeam`, {
                userId: user.userId,
                matchId: currentMatch.id,
                betmateId: currentMatch.selectedBetmate.id,
                teamChoice
            }, {
                withCredentials: true
            });

            setMatch((prevMatch) => ({
                ...prevMatch,
                matchBetmates: prevMatch.matchBetmates.map((mb) =>
                    mb.betmateId === currentMatch.selectedBetmate.id
                        ? { ...mb, status: 'team_chosen' }
                        : mb
                ),
            }));
            
            setShowModal(false);

        } catch (error) {
            console.error('Failed to place bet:', error);
            alert('Failed to choose team. Please try again.');
        }
    };

    return (
        <div className="pt-20 lg:pl-64 p-8 bg-gray-100 min-h-screen">
            <div className="max-w-4xl mx-auto shadow-lg p-6 bg-white rounded-lg">
                <div className="mb-4 text-center">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
                        {result === '' ? 'Flip the Coin' : 'Result'}
                    </h1>
                </div>

                <div className="flex justify-center items-center gap-6 mb-4">
                    <button onClick={() => setSelectedOption('Heads')} disabled={flipping || result !== ''}
                        className={`px-6 py-3 text-lg font-medium rounded-full transition-colors w-36 text-center ${selectedOption === 'Heads' ? 'bg-gray-700 text-white' : 'bg-gray-300 text-gray-800'}`}>
                        Heads
                    </button>
                    <span className="text-gray-800 font-bold text-lg">OR</span>
                    <button onClick={() => setSelectedOption('Tails')} disabled={flipping || result !== ''}
                        className={`px-6 py-3 text-lg font-medium rounded-full transition-colors w-36 text-center ${selectedOption === 'Tails' ? 'bg-gray-700 text-white' : 'bg-gray-300 text-gray-800'}`}>
                        Tails
                    </button>
                </div>

                <div className="flex flex-col items-center">
                    <TbCoinRupeeFilled className={`text-9xl text-gray-800 ${flipping ? 'animate-spin' : ''}`} />
                    <button onClick={flipCoin} disabled={flipping || !selectedOption || result !== ''}
                            className="px-6 py-3 mt-4 bg-gray-700 text-white rounded-full shadow-lg hover:bg-gray-800 disabled:bg-gray-400 transition-colors">
                        Flip the Coin
                    </button>
                </div>

                <TeamSelectionModal
                    showModal={showModal}
                    result={result}
                    currentMatch={currentMatch}
                    placeBet={placeBet}
                    setShowModal={setShowModal}
                />
            </div>
        </div>
    );
}

export default CoinFlip;
