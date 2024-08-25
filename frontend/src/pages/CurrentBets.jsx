import React, { useState, useEffect } from 'react';
import CurrentBetsCard from '../components/CurrentBetsCard';
import axios from 'axios';
import { API_ENDPOINTS } from '../apiConfig';
import {useAuth} from '../context/AuthContext';

function CurrentBets() {
  const [bets, setBets] = useState([]);
  const { user } = useAuth(); 

  useEffect(() => {
    const fetchBets = async () => {
      if (!user) return; 
      try {
        const response = await axios.get(`${API_ENDPOINTS.bets}/user/${user.userId}`, {
          withCredentials: true
        });
        setBets(response.data);
      } catch (error) {
        console.error("Error fetching current bets:", error);
      }
    };

    fetchBets();
  }, [user]);

  return (
    <div className="bg-gray-100 max-w-screen-xl mx-auto pt-16">
      <div className="container mx-auto px-2 lg:pl-64">
        <h1 className="text-2xl font-bold text-gray-800 ml-4 mt-4   mb-4">Current Bets</h1>
        <div className="grid grid-cols-1 gap-4 place-items-center md:place-items-start">
          {bets.map(bet => (
            <CurrentBetsCard key={bet.id} betmate={bet} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CurrentBets;
