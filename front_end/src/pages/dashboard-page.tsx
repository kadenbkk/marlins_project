import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ArsenalStats from '../components/arsenal';
import CountStats from '../components/count';
import Header from '../components/header';
import RecentGames from '../components/recent-games';

const DashboardPage: React.FC = () => {
  const location = useLocation();
  const { pitcherName, pitcherId } = location.state || { pitcherName: null, pitcherId: null };
  const navigate = useNavigate();
  const [selectedComponent, setSelectedComponent] = useState<'arsenal' | 'count' | null>(null);
  const renderSelectedComponent = () => {
    switch (selectedComponent) {
      case 'arsenal':
        return pitcherId && <ArsenalStats pitcherId={pitcherId} />;
      case 'count':
        return pitcherId && <CountStats pitcherId={pitcherId} />;
      default:
        return null;
    }
  };
  const handleButtonClick = (component: 'arsenal' | 'count') => {
    setSelectedComponent(prev => (prev === component ? null : component));
  };
  const handleNavigateBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {pitcherName && (
        <Header onClick={handleNavigateBack} name={pitcherName} />
      )}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => handleButtonClick('arsenal')}
          className={`px-4 py-2 rounded ${selectedComponent === 'arsenal' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Arsenal Stats
        </button>
        <button
          onClick={() => handleButtonClick('count')}
          className={`px-4 py-2 rounded ${selectedComponent === 'count' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Count Stats
        </button>
      </div>
      {renderSelectedComponent()}
      {pitcherId && <RecentGames pitcherId={pitcherId} />}
    </div>
  );
};

export default DashboardPage;
