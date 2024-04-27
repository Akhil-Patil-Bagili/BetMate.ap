import { format } from 'date-fns';

function MatchCard({ match }) {
  // Format the date and time to a more readable format
  const matchDate = new Date(parseInt(match.date));
  const dateString = format(matchDate, 'EEE, MMM d, yyyy, h:mm a') + ' IST';

  return (
    <div className="w-full max-w-2xl mx-auto bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 overflow-hidden my-4">
      {/* Date and Time */}
      <div className="text-center font-medium text-sm text-gray-800 px-5 pt-5">
        {dateString}
      </div>
      {/* Main content: Team Logos and Names */}
      <div className="flex justify-center items-center space-x-4 py-5">
        <img src={match.team1Logo || "https://via.placeholder.com/48x48?text=Team1"} alt={match.team1} className="h-12 w-12 rounded-full"/>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{match.team1}</h2>
        <span className="text-xl font-bold text-gray-500">VS</span>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{match.team2}</h2>
        <img src={match.team2Logo || "https://via.placeholder.com/48x48?text=Team2"} alt={match.team2} className="h-12 w-12 rounded-full"/>
      </div>
      {/* Location and Action Button */}
      <div className="px-5 pb-5 text-center md:text-center">
        <p className="font-normal text-gray-700 dark:text-gray-400">{match.location}</p>
        <button className="mt-2 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-gray-700 rounded-lg hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          Flip a coin
          <svg className="rtl:rotate-180 w-3.5 h-3.5 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default MatchCard;
