import { useEffect, useState } from 'react';
import MatchCard from '../components/MatchCard'; // Ensure this path matches the location of your MatchCard component

function HomePage() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    // Simulated fetch for match data
    setMatches([
      { id: 1, teams: 'CSK vs Mumbai', location: 'Chennai, India', time: '20:00', date: '2024-04-28' },
      { id: 2, teams: 'RCB vs KKR', location: 'Bangalore, India', time: '16:00', date: '2024-04-28' }
    ]);
  }, []);

  return (
    <div className="bg-light-gray min-h-screen pt-16">
      <div className="container mx-auto px-4 md:ml-64">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">Welcome to Bet Mate!</h1>
        <div className="grid md:grid-cols-2 gap-4">
          {matches.map(match => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;