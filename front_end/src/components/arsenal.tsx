import React, { useEffect, useState } from 'react';

// Define the data structure for the ArsenalCard
interface ArsenalCardData {
  pitch_name: string;
  pitch_type: string;
  team_name_alt: string;
  'last_name, first_name': string;
  pa: number;
  pitches: number;
  ba: number;
  slg: number;
  woba: number;
  hard_hit_percent: number;
  k_percent: number;
  whiff_percent: number;
  run_value: number;
  put_away: number;
}

// Define the props for the ArsenalCard component
interface ArsenalCardProps {
  data: ArsenalCardData;
  pitchVelocities: Record<string, any>; // Assuming velocities are keyed by pitch type
}

// Define the props for the ArsenalStats component
interface ArsenalStatsProps {
  pitcherId: string;
}

// Define the display fields and their labels
const DISPLAY_FIELDS: Partial<Record<keyof ArsenalCardData, string>> = {
  pitch_type: '',
  ba: 'BA',
  slg: 'SLG',
  woba: 'WOBA',
  hard_hit_percent: 'Hard Hit %',
  k_percent: 'K %',
  whiff_percent: 'Whiff %',
};

// Define the response structure from the API
interface ArsenalStatsResponse {
  original_arsenal: ArsenalCardData[];
  pitch_velocities: Record<string, any>;
  pitch_movement_x: Record<string, any>;
  pitch_movement_z: Record<string, any>;
}

// ArsenalCard component to display individual pitch data
const ArsenalCard: React.FC<ArsenalCardProps> = ({ data, pitchVelocities }) => {

  const pitchVelocity = pitchVelocities.find((item: { pitch_type: string; }) => item.pitch_type === data.pitch_type);
  const velocity = pitchVelocity ? pitchVelocity.average_velocity.toFixed(1) : 'N/A';
  
  return (
    <div className="bg-white shadow-lg w-96 rounded-lg p-6 mb-4 border border-gray-200">
      <h3 className="text-xl font-semibold mb-2">{data.pitch_name}</h3>
      {velocity && (
        <div className="flex justify-between">
          <span className="font-medium">Velocity:</span>
          <span>{velocity} mph</span>
        </div>
      )}
      <div className="flex flex-col space-y-2">
        {Object.entries(DISPLAY_FIELDS).map(([key, label]) => (
          key !== 'pitch_type' && (
          <div key={key} className="flex justify-between">
            <span className="font-medium">{label}:</span>
            <span>{data[key as keyof ArsenalCardData]}</span>
          </div>
          )
        ))}
      </div>
    </div>
  );
};

// ArsenalStats component to fetch and display pitcher's stats
const ArsenalStats: React.FC<ArsenalStatsProps> = ({ pitcherId }) => {
  const [arsenalStats, setArsenalStats] = useState<ArsenalStatsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch arsenal stats from the API
  const fetchArsenalStats = async () => {
    if (!pitcherId) return;

    try {
      const response = await fetch(`http://127.0.0.1:5000/stats/pitcher/by_arsenal/${pitcherId}`);
      const data: ArsenalStatsResponse = await response.json();

      if (response.ok) {
        setArsenalStats(data);
      } else {
        console.error('Error:', response.statusText);
        setError('An error occurred');
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
          <div className="w-full flex flex-wrap">
            {arsenalStats.original_arsenal.map((item) => (
              <ArsenalCard key={`${item.pitch_name}-${item.team_name_alt}-${item['last_name, first_name']}`} data={item}
                pitchVelocities={arsenalStats.pitch_velocities}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArsenalStats;
