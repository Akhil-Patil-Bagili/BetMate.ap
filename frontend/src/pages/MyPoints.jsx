import React, { useState, useEffect, useRef } from 'react';

function MyPoints() {
  const [betMates, setBetMates] = useState([]);
  const [selectedBetMate, setSelectedBetMate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [userPoints, setUserPoints] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setBetMates([
      { id: 1, name: "John Doe", image: "/default-profile.jpg" },
      { id: 2, name: "Jane Smith", image: "/default-profile.jpg" }
    ]);

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectBetMate = (betMate) => {
    event.stopPropagation(); // Stop the event from propagating to avoid unwanted closing
    console.log("Betmate selected:", betMate.name);
    setSelectedBetMate(betMate);
    setSearchTerm(betMate.name);
    setUserPoints(Math.floor(Math.random() * 20) - 10); // Simulate random points calculation
  };

  return (
    <div className="bg-gray-100 min-w-full mx-auto pt-16">
      <div className="container mx-auto min-w-full px-2 lg:pl-64">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 ml-2">My Points</h1>
        <div className="flex items-center mb-4">
          <label className="text-gray-700 text-base font-bold ml-2 mr-2">
            You VS:
          </label>
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Choose your Betmate"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {searchTerm && (
              <ul ref={dropdownRef} className="absolute z-10 w-full bg-white shadow-md max-h-60 overflow-auto border border-gray-300 rounded-lg mt-1">
                {betMates.filter(betMate => betMate.name.toLowerCase().includes(searchTerm.toLowerCase())).map(betMate => (
                  <li key={betMate.id} className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleSelectBetMate(betMate)}>
                    {betMate.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        {selectedBetMate && (
          <>
            <p className="text-center text-xl p-4 bg-gray-800 text-white rounded-lg shadow-md ml-2">
              {userPoints >= 0 ? `You are leading by ${userPoints} points!` : `You are trailing by ${Math.abs(userPoints)} points. Time for a comeback!`}
            </p>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-3 ml-2">Match Details (You VS {selectedBetMate.name})</h2>
              <table className="min-w-full leading-normal table-auto">
                <thead>
                  <tr>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Match Number
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Teams
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Your Team
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Match Status
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Points
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Dummy data for table rows */}
                  <tr className="bg-white border-b">
                    <td className="px-5 py-2 border-b border-gray-200 bg-white text-sm">
                      2024-04-30
                    </td>
                    <td className="px-5 py-2 border-b border-gray-200 bg-white text-sm">
                      24
                    </td>
                    <td className="px-5 py-2 border-b border-gray-200 bg-white text-sm">
                      CSK vs MI
                    </td>
                    <td className="px-5 py-2 border-b border-gray-200 bg-white text-sm">
                      CSK
                    </td>
                    <td className="px-5 py-2 border-b border-gray-200 bg-white text-sm">
                      Won
                    </td>
                    <td className="px-5 py-2 border-b border-gray-200 bg-white text-sm">
                      +10
                    </td>
                  </tr>
                  <tr className="bg-gray-100 border-b">
                    <td className="px-5 py-2 border-b border-gray-200 bg-gray-100 text-sm">
                      2024-05-02
                    </td>
                    <td className="px-5 py-2 border-b border-gray-200 bg-gray-100 text-sm">
                      25
                    </td>
                    <td className="px-5 py-2 border-b border-gray-200 bg-gray-100 text-sm">
                      RCB vs SRH
                    </td>
                    <td className="px-5 py-2 border-b border-gray-200 bg-gray-100 text-sm">
                      SRH
                    </td>
                    <td className="px-5 py-2 border-b border-gray-200 bg-gray-100 text-sm">
                      Lost
                    </td>
                    <td className="px-5 py-2 border-b border-gray-200 bg-gray-100 text-sm">
                      -5
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MyPoints;
