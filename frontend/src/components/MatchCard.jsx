function MatchCard({ match }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition duration-300">
      <h2 className="text-lg font-bold text-gray-700">{match.teams}</h2>
      <p className="text-gray-500">{match.location}, {match.time}, {match.date}</p>
      <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300 block mx-auto">
        Bet
      </button>
    </div>
  );
}

export default MatchCard;