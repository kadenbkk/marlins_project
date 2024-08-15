import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/header';
import RecentGamesDetails from '../components/recent-games-details';

const DashboardPage: React.FC = () => {
  const location = useLocation();
  const { pitcherName, pitcherId, chosenPitcherData } = location.state || { pitcherName: null, pitcherId: null, chosenPitcherData: null };
  const navigate = useNavigate();
  
  const handleNavigateBack = () => {
    navigate(-1);
  };
  
  return (
    <div className="flex flex-col h-screen bg-page">
      {pitcherName && (
        <Header chosenPitcherData={chosenPitcherData} onClick={handleNavigateBack} name={pitcherName} />
      )}

      
      {pitcherId && <RecentGamesDetails pitcher_id={pitcherId} chosenPitcherData={chosenPitcherData}/>}
    </div>
  );
};

export default DashboardPage;
