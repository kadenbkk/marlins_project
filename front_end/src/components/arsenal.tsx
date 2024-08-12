import React, { useEffect, useState } from 'react';

interface ArsenalStatsProps {
  pitcherId: string;
}

const ArsenalStats: React.FC<ArsenalStatsProps> = ({ pitcherId }) => {
  const [arsenalStats, setArsenalStats] = useState<any>(null); // Use a suitable type based on your response data
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div>
      {loading && <p className="text-gray-600">Loading arsenal stats...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {arsenalStats && (
        <div>
          <h2 className="text-xl font-semibold mt-4">Arsenal Stats:</h2>
          <div>
            <h3 className="text-lg font-medium">Original Arsenal Data:</h3>
            <pre className="text-gray-700">{JSON.stringify(arsenalStats.original_arsenal, null, 2)}</pre>
          </div>
          <div>
            <h3 className="text-lg font-medium">Pitch Velocities:</h3>
            <pre className="text-gray-700">{JSON.stringify(arsenalStats.pitch_velocities, null, 2)}</pre>
          </div>
          <div>
            <h3 className="text-lg font-medium">Pitch Movement (Horizontal):</h3>
            <pre className="text-gray-700">{JSON.stringify(arsenalStats.pitch_movement_x, null, 2)}</pre>
          </div>
          <div>
            <h3 className="text-lg font-medium">Pitch Movement (Vertical):</h3>
            <pre className="text-gray-700">{JSON.stringify(arsenalStats.pitch_movement_z, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArsenalStats;
