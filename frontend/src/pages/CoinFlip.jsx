import React, { useState } from 'react';
import { TbCoinRupeeFilled } from 'react-icons/tb';

function CoinFlip() {
    const [selectedOption, setSelectedOption] = useState('');
    const [betMate, setBetMate] = useState(null);
    const [result, setResult] = useState('');
    const [flipping, setFlipping] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const flipCoin = () => {
        setFlipping(true);
        setTimeout(() => {
            const outcomes = ['Heads', 'Tails'];
            const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
            setResult(randomOutcome);
            setFlipping(false);
            setShowModal(true);
        }, 5000);
    };

    const selectBetMate = (name) => {
        setBetMate({
            name: name,
            image: '/default-profile.jpg' // Placeholder for default profile picture
        });
        setSelectedOption('');
        setResult('');
    };

    return (
        <div className="pt-20 lg:pl-64 p-8 bg-gray-100 min-h-screen">
            <div className="max-w-4xl mx-auto shadow-lg p-6 bg-white rounded-lg">
                <div className="mb-4 text-center">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">Choose Your Betmate First</h1>
                    <input type="text" placeholder="Search for your Betmate..." className="text-gray-800 p-3 w-full rounded-lg border border-gray-400 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition"
                           onBlur={() => selectBetMate("John Doe")} />
                    {betMate && (
                        <div className="mt-6 flex items-center justify-center gap-8 text-gray-800">
                            <img src={betMate.image} alt="Bet Mate" className="w-20 h-20 rounded-full border-4 border-gray-300 shadow-lg"/>
                            <span className="text-2xl font-bold">{betMate.name} <span className="text-gray-500 mx-2">VS</span > <span className="text-2xl font-bold">You</span></span>
                            <img src="/default-profile.jpg" alt="Your Profile" className="w-20 h-20 rounded-full border-4 border-gray-300 shadow-lg"/>
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
                                    <button className="mx-2 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition-colors">Team1</button>
                                    <button className="mx-2 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition-colors">Team2</button>
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
