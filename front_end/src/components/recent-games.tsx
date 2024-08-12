import React, { useEffect, useState } from 'react';
import { parseJSONWithNaN } from '../utils/utils';

interface RecentGamesProps {
  pitcherId: string;
}

const RecentGames: React.FC<RecentGamesProps> = ({ pitcherId }) => {
  const [recentGames, setRecentGames] = useState<any>(null); 
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchRecentGames = async () => {
    if (!pitcherId) return;
  
    try {
      const response = await fetch(`http://127.0.0.1:5000/stats/pitcher/recent/${pitcherId}`);
      const text = await response.text(); 
  
      const data = parseJSONWithNaN(text); 
  
      if (response.ok) {
        setRecentGames(data);
      } else {
        console.error('Error:', response.statusText);
        setError('An error occurred');
      }
    } catch (err) {
      console.error('Failed to fetch recent games.', err);
      setError('Failed to fetch recent games.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentGames();
  }, [pitcherId]);

  return (
    <div>
      {loading && <p className="text-gray-600">Loading recent games...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {recentGames && (
        <div>
          <h2 className="text-xl font-semibold mt-4">Recent Games! </h2>
        </div>
      )}
    </div>
  );
};

export default RecentGames;
