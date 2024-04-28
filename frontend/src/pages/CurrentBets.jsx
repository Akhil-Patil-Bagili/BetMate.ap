import React, { useState, useEffect } from 'react';
import CurrentBetsCard from '../components/CurrentBetsCard';
import axios from 'axios';
import { API_ENDPOINTS } from '../apiConfig';

function CurrentBets() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const matchesResponse = await axios.get(API_ENDPOINTS.matches); 
        setMatches(matchesResponse.data);
        // setMatches(response.data.filter(match => match.isBetPlaced));
      } catch (error) {
        console.error("Error fetching current bets:", error);
      }
    };

    fetchMatches();
  }, []);

  return (
    <div className="bg-gray-100 max-w-screen-xl mx-auto pt-16">
      <div className="container mx-auto px-2 lg:pl-64">
        <h1 className="text-2xl font-bold text-gray-800 ml-4 mt-4 mb-4">Current Bets</h1>
        <div className="grid grid-cols-1 gap-4 place-items-center md:place-items-start">
          {matches.map(match => (
            <CurrentBetsCard key={match.id} match={match} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CurrentBets;
