import { format } from 'date-fns';
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
import { useAuth } from '../context/AuthContext';
import { TbClock, TbLock, TbAlertTriangle } from 'react-icons/tb';

// Mapping of team codes to logos
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

function CurrentBetsCard({ betmate }) {
  const { user } = useAuth();

  // Safeguard against missing match data
  if (!betmate || !betmate.match) {
    return null; // or some placeholder UI
  }

  const match = betmate.match;
  const matchDate = new Date(match.date);
  const dateString = format(matchDate, 'EEE, MMM d, yyyy, h:mm a') + ' Local Time';

  const renderStatusIcon = (status) => {
    switch (status) {
      case 'toss_won':
        return <TbAlertTriangle className="w-5 h-5 ml-2" />;
      case 'toss_lose':
        return <TbClock className="w-5 h-5 ml-2" />;
      case 'team_chosen':
        return <TbLock className="w-5 h-5 ml-2" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white border border-gray-200 rounded-lg shadow overflow-hidden my-4">
      {/* Date and Time */}
      <div className="text-center font-medium text-sm text-gray-800 px-5 pt-5">
        {dateString}
      </div>
      {/* Main content: Team Logos and Names */}
      <div className="flex justify-center items-center space-x-12 py-5">
        <img src={teamLogos[betmate.userChoice]} alt={betmate.userChoice} className="h-20 w-20 md:h-28 md:w-28 rounded-full object-contain" />
        <div className="flex flex-col items-center">
          <h2 className="text-xl md:text-3xl font-bold text-gray-900 text-center">
            {betmate.userChoice} ({user.firstName})
          </h2>
          <span className="text-2xl md:text-3xl font-bold text-gray-500 text-center">VS</span>
          <h2 className="text-xl md:text-3xl font-bold text-gray-900 text-center">
            {betmate.betmateChoice} ({betmate.betmate?.firstName || 'Waiting'})
          </h2>
        </div>
        <img src={teamLogos[betmate.betmateChoice]} alt={betmate.betmateChoice} className="h-20 w-20 md:h-28 md:w-28 rounded-full object-contain" />
      </div>
      {/* Status */}
      <div className="text-center mt-4">
        <p className="text-lg font-medium text-gray-700">
          {betmate.status === 'toss_won' && betmate.userId === user.id ? 'You won the toss!' : ''}
          {betmate.status === 'toss_lose' && betmate.userId === user.id ? 'Waiting for opponent...' : ''}
          {betmate.status === 'team_chosen' ? 'Teams chosen' : ''}
        </p>
        {renderStatusIcon(betmate.status)}
      </div>
    </div>
  );
}

export default CurrentBetsCard;
