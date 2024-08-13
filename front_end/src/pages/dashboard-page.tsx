import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ArsenalStats from '../components/arsenal';
import CountStats from '../components/count';
import RecentGames from '../components/recent-games';

const DashboardPage: React.FC = () => {
  const location = useLocation();
  const { pitcherName, pitcherId } = location.state || { pitcherName: null, pitcherId: null };
  const [arsenalStats, setArsenalStats] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchArsenalStats = async () => {
    if (!pitcherId) return;

    try {
      const response = await fetch(`http://127.0.0.1:5000/stats/pitcher/by_arsenal/${pitcherId}`);
      const data = await response.json();

      if (response.ok) {
        setArsenalStats(data);
      } else {
        console.error('Error:', response.statusText);
        setError(data.error || 'An error occurred');
      }
    } catch (err) {
      console.error('Failed to fetch arsenal stats.', err);
      setError('Failed to fetch arsenal stats.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArsenalStats();
  }, [pitcherId]);

  const handleNavigateBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full">
        <button
          onClick={handleNavigateBack}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go Back
        </button>
        {/* 
        <h1 className="text-3xl font-bold text-blue-600">Dashboard</h1>
        {pitcherName && (
          <div>
            <h2 className="text-xl font-semibold">Pitcher Name:</h2>
            <p className="text-lg text-gray-800">{pitcherName}</p>
          </div>
        )}
        {pitcherId && (
          <div>
            <h2 className="text-xl font-semibold">Pitcher ID:</h2>
            <p className="text-lg text-gray-800">{pitcherId}</p>
          </div>
        )} */}
        {/* {pitcherId && <ArsenalStats pitcherId={pitcherId} />} */}
        {/* {pitcherId && <RecentGames pitcherId={pitcherId} />} */}
        {pitcherId && <CountStats pitcherId={pitcherId} />}
      </div>
    </div>
  );
};

export default DashboardPage;
