import React from 'react';

function TeamSelectionModal({ showModal, result, currentMatch, placeBet, setShowModal }) {
  if (!currentMatch) {
    console.log("currentMatch in the Team Selection Modal")
    console.log(currentMatch)
    return null; // Do not render if currentMatch is not available
  }
  return (
    showModal && (
      <div className={`fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center`}>
        <div className="bg-white p-6 rounded-lg shadow-lg text-center md:ml-24">
          <h2 className={`text-xl font-bold ${result === 'win' ? 'text-green-700' : 'text-red-600'}`}>
            {result === 'win' ? 'Congratulations! You won the toss!' : 'Sorry, You lost the toss.'}
          </h2>
          {result === 'win' ? (
                <div className="mt-4 flex flex-col items-center">
                    <p className="mb-2">Choose your team now:</p>
                    <div className="flex justify-center gap-4 w-full">
                    <button
                        onClick={() => placeBet(currentMatch.team1)}
                        className="flex-1 px-4 py-2 font-medium text-center text-white bg-gray-800 rounded-lg hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-blue-300"
                    >
                        {currentMatch.team1}
                    </button>
                    <button
                        onClick={() => placeBet(currentMatch.team2)}
                        className="flex-1 px-4 py-2 font-medium text-center text-white bg-gray-800 rounded-lg hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-blue-300"
                    >
                        {currentMatch.team2}
                    </button>
                    </div>
                    <button
                    onClick={() => setShowModal(false)}
                    className="mt-4 w-full px-4 py-2 font-medium text-center bg-red-500 text-white rounded-lg hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300"
                    >
                    Skip for now
                    </button>
                </div>
          ) : (
            <div className="mt-4">
              <p className="mb-2">Wait for your opponent to choose their team.</p>
              <button
                onClick={() => setShowModal(false)}
                className="mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
              >
                Okay
              </button>
            </div>
          )}
        </div>
      </div>
    )
  );
}

export default TeamSelectionModal;
