import React, { useState, useEffect } from "react";
import MatchCard from "../components/MatchCard";
import axios from "axios";
import { API_ENDPOINTS } from "../apiConfig";
import { useAuth } from "../context/AuthContext";
import { useMatch } from '../context/MatchContext';

function HomePage() {
  const { user } = useAuth();
  const { setMatch } = useMatch();
  const [matches, setMatches] = useState([]);
  const [betMates, setBetMates] = useState([]);
  const [selectedBetMate, setSelectedBetMate] = useState(null);
  const [userPoints, setUserPoints] = useState(0);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const matchesResponse = await axios.get(API_ENDPOINTS.matches, { withCredentials: true });
        setMatches(matchesResponse.data);
      } catch (error) {
        console.error("Error fetching matches:", error);
      }
    };

    const fetchUserPoints = async () => {
      try {
        const userResponse = await axios.get(`${API_ENDPOINTS.users}/${user.userId}`, { withCredentials: true });
        setUserPoints(userResponse.data.score);
      } catch (error) {
        console.error("Error fetching user points:", error);
        setUserPoints(0);
      }
    };

    const fetchBetMates = async () => {
      try {
        const response = await axios.get(`${API_ENDPOINTS.friends}/list/${user.userId}`, { withCredentials: true });
        setBetMates(response.data);
      } catch (error) {
        console.error("Error fetching betmates:", error);
      }
    };

    fetchMatches();
    fetchUserPoints();
    fetchBetMates();
  }, [user.userId]);

  const handleBetMateChange = async (event) => {
    const betmateId = event.target.value;
    const selected = betMates.find((mate) => mate.id === parseInt(betmateId));
    setSelectedBetMate(selected);

    try {
      const response = await axios.get(`${API_ENDPOINTS.bets}/user/${user.userId}`, { withCredentials: true });
      const updatedMatches = matches.map(match => {
        const matchBetmate = response.data.find(bet => bet.matchId === match.id && bet.betmateId === selected.id);
        return {
          ...match,
          matchBetmates: matchBetmate ? [matchBetmate] : []
        };
      });
      setMatches(updatedMatches);
    } catch (error) {
      console.error("Error fetching betmate status:", error);
    }
  };

  const pointsMessage =
    userPoints >= 0
      ? `Congrats! You are leading by ${userPoints} points!`
      : `OOPS, you're trailing by ${Math.abs(userPoints)} points. Time for a comeback!`;

  return (
    <div className="bg-gray-100 max-w-screen-xl mx-auto pt-16">
      <div className="container mx-auto px-2 lg:pl-64">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 mt-4 text-center md:text-left md:ml-2">
          Welcome to Bet Mate!
        </h1>
        <div className="text-center p-4 mb-4 bg-gray-800 text-white rounded-lg md:ml-2 shadow-md">
          <h2 className="text-xl md:text-2xl">{pointsMessage}</h2>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-lg font-bold mb-2" htmlFor="betmate-select">
            Select a Betmate:
          </label>
          <select
            id="betmate-select"
            className="p-3 border border-gray-400 rounded-lg w-full"
            value={selectedBetMate?.id || ""}
            onChange={handleBetMateChange}
          >
            <option value="">Select Betmate</option>
            {betMates.map((betmate) => (
              <option key={betmate.id} value={betmate.id}>
                {betmate.firstName} {betmate.lastName}
              </option>
            ))}
          </select>
        </div>

        {selectedBetMate && (
          <div className="grid grid-cols-1 gap-4 place-items-center md:place-items-start">
            {matches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                betmate={selectedBetMate}
                onMatchSelect={() => setMatch({ ...match, selectedBetmate: selectedBetMate })}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
