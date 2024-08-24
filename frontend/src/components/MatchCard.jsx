import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom'; 
import { useMatch } from '../context/MatchContext';
import CSKLogo from '../assets/teamLogos/CSK.png';
import DCLogo from '../assets/teamLogos/DC.png';
import GTLogo from '../assets/teamLogos/GT.png';
import KKRLogo from '../assets/teamLogos/KKR.png';
import LSGLogo from '../assets/teamLogos/LSG.png';
import MILogo from '../assets/teamLogos/MI.png';
import PBKSLogo from '../assets/teamLogos/PBKS.png';
import RCBLogo from '../assets/teamLogos/RCB.png';
import RRLogo from '../assets/teamLogos/RR.png';
import SRHLogo from '../assets/teamLogos/SRH.png';

const teamLogos = {
  CSK: CSKLogo,
  DC: DCLogo,
  GT: GTLogo,
  KKR: KKRLogo,
  LSG: LSGLogo,
  MI: MILogo,
  PBKS: PBKSLogo,
  RCB: RCBLogo,
  RR: RRLogo,
  SRH: SRHLogo
};

function MatchCard({ match }) {
  const navigate = useNavigate(); 
  const { setMatch } = useMatch();
  const matchDate = new Date(match.date);
  const dateString = format(matchDate, 'EEE, MMM d, yyyy, h:mm a') + ' Local Time';

  const handleFlipCoin = () => {
    setMatch(match);
    navigate('/coin-flip');
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white border border-gray-200 rounded-lg shadow overflow-hidden my-4">
      <div className="text-center font-medium text-sm text-gray-800 px-5 pt-5">
        {dateString}
      </div>
      <div className="flex justify-center items-center space-x-12 py-5">
        <img src={teamLogos[match.team1] || "https://via.placeholder.com/150x150?text=Team1"} alt={match.team1}
             className="h-20 w-20 md:h-28 md:w-28 rounded-full object-contain"/>
        <div className="flex flex-col items-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center">{match.team1}</h2>
          <span className="text-2xl md:text-3xl font-bold text-gray-500 text-center">VS</span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center">{match.team2}</h2>
        </div>
        <img src={teamLogos[match.team2] || "https://via.placeholder.com/150x150?text=Team2"} alt={match.team2}
             className="h-20 w-20 md:h-28 md:w-28 rounded-full object-contain"/>
      </div>
      <div className="px-5 pb-5 text-center md:text-center">
        <p className="font-normal text-gray-700 dark:text-gray-400 pb-2">{match.location}</p>
        <button onClick={handleFlipCoin} className="mt-2 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-gray-700 rounded-lg hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          Flip a coin
          <svg className="rtl:rotate-180 w-3.5 h-3.5 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default MatchCard;
