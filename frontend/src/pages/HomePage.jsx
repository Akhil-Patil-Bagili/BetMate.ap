import React, { useState, useEffect, useRef } from "react";
import MatchCard from "../components/MatchCard";
import axios from "axios";
import { API_ENDPOINTS } from "../apiConfig";
import { useAuth } from "../context/AuthContext";
import { useMatch } from '../context/MatchContext';
import { useNavigate } from "react-router-dom";
import { FaUserFriends } from "react-icons/fa";
import { BsPersonPlusFill } from "react-icons/bs";
import { MdOutlineSportsCricket, MdOutlineSentimentDissatisfied } from "react-icons/md"; 
import welcomeImage from '../assets/images (1).png'; 

function HomePage() {
  const { user } = useAuth();
  const { setMatch } = useMatch();
  const [matches, setMatches] = useState([]);
  const [betMates, setBetMates] = useState([]);
  const [filteredBetMates, setFilteredBetMates] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBetMate, setSelectedBetMate] = useState(null);
  const [totalPoints, setTotalPoints] = useState(0);
  const [activeFilter, setActiveFilter] = useState('active'); // default filter
  const navigate = useNavigate();
  const searchBoxRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatchesAndBetMates = async () => {
        try {
            const [matchesResponse, betmatesResponse] = await Promise.all([
                axios.get(API_ENDPOINTS.matches, { withCredentials: true }),
                axios.get(`${API_ENDPOINTS.friends}/list/${user.userId}`, { withCredentials: true }),
            ]);

            setMatches(matchesResponse.data);
            setBetMates(betmatesResponse.data);
            setFilteredBetMates(betmatesResponse.data);
        } catch (error) {
            console.error("Error fetching matches or betmates:", error);
        } finally {
            setLoading(false); 
        }
    };

    fetchMatchesAndBetMates();
}, [user.userId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target)) {
        setFilteredBetMates([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Filter matches based on the selected filter
    const filterMatches = () => {
      if (!selectedBetMate) return;

      const activeStatuses = ['team_chosen','toss_lose','toss_won','waiting_for_opponent', 'choose_team'];
      const completedStatuses = ['won', 'lost'];
      let filtered;

      switch (activeFilter) {
        case 'active':
          filtered = matches.filter((match) =>
            match.matchBetmates?.some(
              (mb) => mb.betmateId === selectedBetMate.id && activeStatuses.includes(mb.status)
            )
          );
          break;
        case 'upcoming':
          filtered = matches.filter((match) =>
            match.state !== 'complete' &&
            (!match.matchBetmates || match.matchBetmates.every(
              (mb) => mb.betmateId !== selectedBetMate.id || mb.status === 'no_bet'
            ))
          );
          break;
        case 'completed':
          filtered = matches.filter((match) =>
            match.matchBetmates?.some(
              (mb) => mb.betmateId === selectedBetMate.id && completedStatuses.includes(mb.status)
            )
          );
          break;
        default:
          filtered = matches;
      }

      setFilteredMatches(filtered);
    };

    filterMatches();
  }, [activeFilter, matches, selectedBetMate]);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value.trim()) {
      const filtered = betMates.filter((mate) => {
        const fullName = `${mate.firstName} ${mate.lastName}`.toLowerCase();
        return fullName.includes(value.toLowerCase());
      });
      setFilteredBetMates(filtered);
    } else {
      setFilteredBetMates([]);
    }
  };

  const handleBetMateSelect = async (betmate) => {
    setSelectedBetMate(betmate);
    setSearchTerm('');
    setFilteredBetMates([]);
  
    try {
      const response = await axios.get(`${API_ENDPOINTS.bets}/user/${user.userId}/totalScore`, {
        params: { betmateId: betmate.id },
        withCredentials: true
      });
  
      const totalScore = response.data.totalScore || 0;
      setTotalPoints(totalScore);
  
      try {
        const res = await axios.get(`${API_ENDPOINTS.bets}/user/${user.userId}`, { withCredentials: true });
        const updatedMatches = matches.map(match => {
            const matchBetmate = res.data.find(bet => bet.matchId === match.id && bet.betmateId === betmate.id);
            const updatedMatch = matchBetmate ? { ...match, matchBetmates: [matchBetmate] } : match;
  
            
  
            return updatedMatch;
        });
        setMatches(updatedMatches);
      } catch (error) {
        console.error("Error fetching betmate status:", error);
      }
  
    } catch (error) {
      console.error("Error fetching total score:", error);
    }
  };

  const pointsMessage =
    totalPoints >= 0
      ? `You're leading by ${totalPoints} points!`
      : `You're trailing by ${Math.abs(totalPoints)} points. Time for a comeback!`;

  return (
    <div className="bg-gray-100 max-w-screen-xl mx-auto pt-16 min-h-screen">
      <div className="container mx-auto px-2 lg:pl-64">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 mt-6 text-center md:text-left md:ml-2">
          Hello {user.firstName}, Welcome to Bet Mate!
        </h1>

        {loading ? (
                <div>Loading...</div> // Show a loading state while data is being fetched
            ) : betMates.length === 0 ? (
          // User has no betmates
          <div className="flex flex-col lg:flex-row items-center lg:space-x-12 p-6 mb-6 bg-white shadow-md rounded-lg">
            <div className="lg:w-1/2 flex justify-center mb-4 lg:mb-0">
              <img src={welcomeImage} alt="Welcome" className="w-full max-w-sm h-auto object-cover rounded-lg" />
            </div>
            <div className="lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
              <FaUserFriends className="text-6xl text-blue-600 mb-4" />
              <h2 className="text-3xl font-semibold text-gray-800 mb-4">Let’s Get Started!</h2>
              <p className="text-lg text-gray-700 mb-6">
                You haven’t added any Betmates yet. Start by adding your first Betmate and join the excitement!
              </p>
              <button
                className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 transition duration-200"
                onClick={() => navigate('/betmates')}
              >
                <BsPersonPlusFill className="mr-2" /> Add Your First Betmate
              </button>
              <div className="mt-8 text-gray-600">
                <h3 className="text-xl font-semibold mb-2">Need Help?</h3>
                <p className="text-md">Check out our guide on how to find and add Betmates!</p>
              </div>
            </div>
          </div>
        ) : (
          // User has betmates
          <>
            <div className="mb-6 relative" ref={searchBoxRef}>
              <label className="block text-gray-700 text-lg font-semibold mb-2" htmlFor="betmate-select">
                Choose your Betmate to start betting:
              </label>
              <input
                type="text"
                id="betmate-select"
                className="p-3 border border-gray-400 rounded-lg w-full"
                placeholder="Start typing your betmate's name..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              {filteredBetMates.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto">
                  {filteredBetMates.map((betmate) => (
                    <li
                      key={betmate.id}
                      className="p-2 cursor-pointer hover:bg-gray-200"
                      onClick={() => handleBetMateSelect(betmate)}
                    >
                      {betmate.firstName} {betmate.lastName}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {selectedBetMate ? (
              <>
                <div className="flex justify-center items-center mb-8">
                  <div className="flex flex-col items-center mx-4">
                    <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-3xl font-bold text-gray-700">{user.firstName.charAt(0)}</span>
                    </div>
                    <span className="block mt-3 text-lg font-semibold">{user.firstName}</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-600 mx-4">VS</div>
                  <div className="flex flex-col items-center mx-4">
                    <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-3xl font-bold text-gray-700">{selectedBetMate.firstName.charAt(0)}</span>
                    </div>
                    <span className="block mt-3 text-lg font-semibold">{selectedBetMate.firstName}</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white shadow-lg rounded-lg p-6 mb-8 text-center">
                  <div className="flex justify-center items-center mb-4">
                    <div className="flex items-center justify-center mr-3">
                      <MdOutlineSportsCricket className="text-3xl text-white" />
                    </div>
                    <h2 className="text-3xl font-semibold mr-2">Current Score:</h2>
                    <p className={`text-3xl font-bold ${totalPoints >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {totalPoints}
                    </p>
                  </div>
                  <p className="text-lg font-medium text-gray-300">{pointsMessage}</p>
                </div>

                <div className="flex justify-between mb-8">
                  {['active', 'upcoming', 'completed'].map((filter) => (
                    <button
                      key={filter}
                      className={`flex-1 text-center py-3 font-semibold rounded-lg mx-2 transition duration-200 ${
                        activeFilter === filter
                          ? 'text-white bg-gray-600 cursor-not-allowed'
                          : 'text-gray-700 bg-white border hover:bg-gray-100'
                      }`}
                      onClick={() => setActiveFilter(filter)}
                      disabled={activeFilter === filter}
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)} Matches
                    </button>
                  ))}
                </div>

                {filteredMatches.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 place-items-center md:place-items-start transition-opacity duration-500 ease-in-out">
                    {filteredMatches.map((match) => (
                      <MatchCard
                        key={match.id}
                        match={match}
                        betmate={selectedBetMate}
                        onMatchSelect={() => setMatch({ ...match, selectedBetmate: selectedBetMate })}
                        setMatches={setMatches}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center mt-14">
                    <MdOutlineSentimentDissatisfied className="text-7xl text-gray-500 mb-4" />
                    <h2 className="text-2xl font-semibold text-gray-600 mb-4">No Matches Found</h2>
                    <p className="text-lg text-gray-500 text-center mb-12">There are no matches available under this filter!</p>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center mt-14">
                <MdOutlineSportsCricket className="text-7xl text-gray-500 mb-4 animate-bounce" />
                <h2 className="text-2xl font-semibold text-gray-600 mb-4">No Betmate Selected</h2>
                <p className="text-lg text-gray-500 text-center">Please select a betmate to see the available matches.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default HomePage;
