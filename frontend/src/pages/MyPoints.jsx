import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../apiConfig';

function MyPoints() {
  const { user } = useAuth();
  const [betMates, setBetMates] = useState([]);
  const [selectedBetMate, setSelectedBetMate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [userPoints, setUserPoints] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const [betDetails, setBetDetails] = useState([]); // State to hold bet details
  const dropdownRef = useRef(null);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setSearchResults([]);
    }
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

  const handleSelectBetMate = async (betMate) => {
    console.log("Betmate selected:", betMate.firstName, betMate.lastName);
    setSelectedBetMate(betMate);
    setSearchTerm(`${betMate.firstName} ${betMate.lastName}`);
    try {
      const response = await axios.get(`${API_ENDPOINTS.bets}/user/${user.userId}/totalScore`, {
          params: { betmateId: betMate.id },
          withCredentials: true
      });

      const totalScore = response.data.totalScore || 0;
      setUserPoints(totalScore);
  
      // Fetch bets for the user
      const betResponse = await axios.get(`${API_ENDPOINTS.bets}/user/${user.userId}`, {
        withCredentials: true
      });
      setBetDetails(betResponse.data); // Set the fetched bet details
    } catch (error) {
      console.error('Error fetching user points or bet details:', error);
      setUserPoints(0);
      setBetDetails([]); // Clear the bet details on error
    }
    setSearchResults([]);
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
              onChange={handleSearch}
              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {searchResults.length > 0 && (
              <ul ref={dropdownRef} className="absolute z-10 w-full bg-white shadow-md max-h-60 overflow-auto border border-gray-300 rounded-lg mt-1">
                {searchResults.map(betMate => (
                  <li key={betMate.id} className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleSelectBetMate(betMate)}>
                    {betMate.firstName} {betMate.lastName}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        {selectedBetMate && (
          <>
            <p className="text-center text-xl p-4 bg-gray-800 text-white rounded-lg shadow-md ml-2">
              {userPoints >= 0 ? `You are leading by ${userPoints} points!` : `OOPS, You are trailing by ${Math.abs(userPoints)} points. Time for a comeback!`}
            </p>
            <div className="overflow-x-auto"> {/* Added this container for horizontal scrolling */}
              <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-3 ml-2">Match Details (You VS {selectedBetMate.firstName} {selectedBetMate.lastName})</h2>
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
                  {betDetails.map((bet) => (
                    <tr key={bet.id} className={bet.points >= 0 ? "bg-white border-b" : "bg-gray-100 border-b"}>
                      <td className="px-5 py-2 border-b border-gray-200 bg-white text-sm">
                        {new Date(bet.match.date).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-2 border-b border-gray-200 bg-white text-sm">
                        {bet.match.matchDescription}
                      </td>
                      <td className="px-5 py-2 border-b border-gray-200 bg-white text-sm">
                        {bet.match.team1} vs {bet.match.team2}
                      </td>
                      <td className="px-5 py-2 border-b border-gray-200 bg-white text-sm">
                        {bet.userChoice}
                      </td>
                      <td className="px-5 py-2 border-b border-gray-200 bg-white text-sm">
                        {/* {bet.result === 'unknown' ? 'Pending' : bet.result} */}
                        {bet.status}
                      </td>
                      <td className="px-5 py-2 border-b border-gray-200 bg-white text-sm">
                        {/* {bet.points > 0 ? `+${bet.points}` : bet.points} */}
                        {bet.userScore}
                      </td>
                    </tr>
                  ))}
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
