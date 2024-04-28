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

function CurrentBetsCard({ match }) {
  const matchDate = new Date(match.date);
  const dateString = format(matchDate, 'EEE, MMM d, yyyy, h:mm a') + ' Local Time';

  return (
    <div className="w-full max-w-2xl mx-auto bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 overflow-hidden my-4">
      {/* Date and Time */}
      <div className="text-center font-medium text-sm text-gray-800 px-5 pt-5">
        {dateString}
      </div>
      {/* Main content: Team Logos and Names */}
      <div className="flex justify-center items-center space-x-12 py-5">
        <img src={teamLogos[match.team1]} alt={match.team1} className="h-20 w-20 md:h-28 md:w-28 rounded-full object-contain"/>
        <div className="flex flex-col items-center">
          <h2 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white text-center">{match.team1} (Akhil)</h2>
          <span className="text-2xl md:text-3xl font-bold text-gray-500 text-center">VS</span>
          <h2 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white text-center">{match.team2} (Saikiran)</h2>
        </div>
        <img src={teamLogos[match.team2]} alt={match.team2} className="h-20 w-20 md:h-28 md:w-28 rounded-full object-contain"/>
      </div>
    </div>
  );
}

export default CurrentBetsCard;
