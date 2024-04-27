import { useState, useEffect } from "react";
import MatchCard from "../components/MatchCard";
import axios from "axios";
import { API_ENDPOINTS } from "../apiConfig";

function HomePage() {
  const [matches, setMatches] = useState([]);
  const [userPoints, setUserPoints] = useState(10); // Example user points

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const matchesResponse = await axios.get(API_ENDPOINTS.matches);
        setMatches(matchesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchMatches();
  }, []);

  const pointsMessage = userPoints >= 0 
    ? `Congrats! You are leading by ${userPoints} points!`
    : `Oops, you're trailing by ${Math.abs(userPoints)} points. Time for a comeback!`;

  return (
    <div className="bg-gray-100 max-w-screen-xl mx-auto pt-16">
      <div className="container mx-auto px-2 lg:pl-64">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 mt-4 text-center md:text-left md:ml-2">Welcome to Bet Mate!</h1>
        <div className="text-center p-4 mb-4 bg-gray-800 text-white rounded-lg md:ml-2 shadow-md">
          <h2 className="text-xl md:text-2xl">{pointsMessage}</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 place-items-center md:place-items-start">
          {matches.map(match => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
