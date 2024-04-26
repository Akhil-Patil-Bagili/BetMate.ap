import {useState, useEffect} from "react";
import MatchCard from "../components/MatchCard";

function HomePage() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    setMatches([
      { id: 1, teams: 'CSK vs Mumbai', location: 'Chennai, India', time: '20:00', date: '2024-04-28' },
      { id: 2, teams: 'RCB vs KKR', location: 'Bangalore, India', time: '16:00', date: '2024-04-28' },
      { id: 2, teams: 'RCB vs KKR', location: 'Bangalore, India', time: '16:00', date: '2024-04-28' },
      { id: 2, teams: 'RCB vs KKR', location: 'Bangalore, India', time: '16:00', date: '2024-04-28' }
    ]);
  }, []);

  return (
    <div className="bg-gray-100 max-w-screen-xl pt-16">
      <div className="container px-2 md:ml-64 md:max-w-screen-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 mt-4 max-w-screen-sm">Welcome to Bet Mate!</h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-1 md:gap-4 md:max-w-screen-sm ">
          {matches.map(match => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </div>
    </div>
  );
}
export default HomePage;