import React, { useState, useEffect } from "react";
import { format } from 'date-fns';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import { useMatch } from '../context/MatchContext';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../apiConfig';
import { TbClock, TbLock, TbAlertTriangle } from 'react-icons/tb';
import TeamSelectionModal from '../modals/TeamSelectionModal';
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
  SRH: SRHLogo,
};

function MatchCard({ match, betmate }) {
  const navigate = useNavigate(); 
  const { setMatch, currentMatch } = useMatch();
  const { user } = useAuth();
  const matchDate = new Date(match.date);
  const dateString = format(matchDate, 'EEE, MMM d, yyyy, h:mm a') + ' Local Time';
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (currentMatch && currentMatch.id === match.id) {
        setMatch(currentMatch); 
    }
}, [currentMatch, match, setMatch]);


  const handleFlipCoin = () => {
    setMatch({ ...match, selectedBetmate: betmate });
    navigate('/coin-flip');
};

  const handleChooseTeam = () => {
    setMatch({ ...match, selectedBetmate: betmate });
    setShowModal(true);
  };

  const placeBet = async (teamChoice) => {
    try {
      const response = await axios.post(`${API_ENDPOINTS.bets}/chooseTeam`, {
        userId: user.userId,
        matchId: match.id,
        betmateId: betmate.id,
        teamChoice,
      }, {
        withCredentials: true,
      });
      setMatch((prevMatch) => ({
        ...prevMatch,
        matchBetmates: prevMatch.matchBetmates.map((mb) =>
            mb.betmateId === betmate.id ? { ...mb, status: 'team_chosen' } : mb
        ),
    }));
      setShowModal(false); 
    } catch (error) {
      console.error('Failed to place bet:', error);
      alert('Failed to choose team. Please try again.');
    }
  };

  // const matchBetmate = match.matchBetmates?.find(mb => mb.betmateId === betmate.id);
  const renderButton = () => {
    // If no matchBetmate exists, it's an upcoming match with no interaction yet.
    // if (!matchBetmate) {
    //   return (
    //     <button onClick={handleFlipCoin} className="mt-2 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-gray-700 rounded-lg hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
    //       Flip a coin
    //       <svg className="rtl:rotate-180 w-3.5 h-3.5 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
    //         <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
    //       </svg>
    //     </button>
    //   );
    // }

    const matchBetmate = (match.matchBetmates || []).find(mb => mb.betmateId === betmate.id);
const status = matchBetmate?.status || 'no_bet'; // Use optional chaining to avoid accessing undefined properties
console.log('Match Betmate Status:', status);

    switch (status) {
      case "no_bet":
        return (
          <button onClick={handleFlipCoin} className="mt-2 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-gray-700 rounded-lg hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
            Flip a coin
            <svg className="rtl:rotate-180 w-3.5 h-3.5 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
            </svg>
          </button>
        );
      case "toss_won":
        return (
          <>
            <button onClick={handleChooseTeam} className="mt-2 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-blue-300">
              Choose Team
              <TbAlertTriangle className="w-5 h-5 ml-2" />
            </button>
            <TeamSelectionModal
              showModal={showModal}
              result="win"
              currentMatch={match}
              placeBet={placeBet}
              setShowModal={setShowModal}
            />
          </>
        );
      case "toss_lose":
        return (
          <button disabled className="mt-2 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-gray-500 bg-gray-300 rounded-lg cursor-not-allowed">
            Waiting for Opponent
            <TbClock className="w-5 h-5 ml-2" />
          </button>
        );
      case "team_chosen":
        return (
          <button disabled className="mt-2 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-gray-500 bg-gray-300 rounded-lg cursor-not-allowed">
            Teams Chosen
            <TbLock className="w-5 h-5 ml-2" />
          </button>
        );
      case "won":
        return (
          <button disabled className="mt-2 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-gray-500 bg-gray-300 rounded-lg cursor-not-allowed">
            Won
            <TbLock className="w-5 h-5 ml-2" />
          </button>
        );
      case "lost":
        return (
          <button disabled className="mt-2 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-gray-500 bg-gray-300 rounded-lg cursor-not-allowed">
            Lost
            <TbLock className="w-5 h-5 ml-2" />
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white border border-gray-200 rounded-lg shadow overflow-hidden my-4">
      <div className="text-center font-medium text-sm text-gray-800 px-5 pt-5">
        {dateString}
      </div>
      <div className="flex justify-center items-center space-x-12 py-5">
        <img src={teamLogos[match.team1]} alt={match.team1} className="h-20 w-20 md:h-28 md:w-28 rounded-full object-contain"/>
        <div className="flex flex-col items-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">{match.team1}</h2>
          <span className="text-2xl md:text-3xl font-bold text-gray-500 text-center">VS</span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">{match.team2}</h2>
        </div>
        <img src={teamLogos[match.team2]} alt={match.team2} className="h-20 w-20 md:h-28 md:w-28 rounded-full object-contain"/>
      </div>
      <div className="px-5 pb-5 text-center md:text-center">
        <p className="font-normal text-gray-700 pb-2">{match.location}</p>
        {renderButton()}
      </div>  
    </div>
  );
}

export default MatchCard;
