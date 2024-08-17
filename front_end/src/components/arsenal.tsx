import React, { useEffect, useState } from 'react';
import { getPitchName } from '../types/types';

// Define the data structure for the ArsenalCard
interface ArsenalCardData {
  "Avg Spin Axis": number;
  "Avg Spin Rate": number;
  "Avg Velocity": number;
  BA: number;
  "HardHit%": number;
  SLG: number;
  "Total Pitches": number;
  "Whiff%": number;
  pitch_type: string;
}

// Define the props for the ArsenalCard component
interface ArsenalCardProps {
  data: ArsenalCardData;
}

// Define the props for the ArsenalStats component
interface ArsenalStatsProps {
  pitcherId: string;
}

// Define the display fields and their labels
const DISPLAY_FIELDS: Partial<Record<string, string>> = {
  BA: 'BA',
  SLG: 'SLG',
  "HardHit%": 'Hard Hit %',
  "Whiff%": 'Whiff %',
  "Avg Spin Rate": 'Avg Spin Rate',
  "Avg Velocity": 'Avg Velocity',
  "Avg Spin Axis": 'Avg Spin Axis',
};

// Define the response structure from the API
interface ArsenalStatsResponse {
  data: ArsenalCardData[];
}

// ArsenalCard component to display individual pitch data
const ArsenalCard: React.FC<ArsenalCardProps> = ({ data }) => {  
  return (
    <div className="bg-card shadow-lg min-w-[18rem] p-4 h-full rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-1">{getPitchName(data.pitch_type)}</h3>
      <div className="flex flex-col space-y-1">
        {Object.entries(DISPLAY_FIELDS).map(([key, label]) => (
          <div key={key} className="flex justify-between">
            <span className="text-sm font-medium">{label}:</span>
            <span className="text-sm">{data[key as keyof ArsenalCardData]}</span>
          </div>
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

  const fetchArsenalStats = async () => {
    if (!pitcherId) return;

    try {
      const response = await fetch(`http://127.0.0.1:5000/stats/pitcher/by_arsenal/${pitcherId}`);
      const data: ArsenalStatsResponse = await response.json();
      if (response.ok) {
        console.log("hel;lo");
        setArsenalStats(data);
      } else {
        setError('An error occurred');
      }
    } catch (err) {
      setError('Failed to fetch arsenal stats.');
    } 
  };

  useEffect(() => {
    fetchArsenalStats();
  }, [pitcherId]);

  return (
    <div className="relative">
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <div className="absolute top-0 left-0 w-full h-64 bg-card flex flex-wrap z-20 overflow-x-auto">
        <div className="flex space-x-4 p-4">
          {arsenalStats && arsenalStats.data &&
            arsenalStats.data.map((item, index) => (
              <ArsenalCard
                key={index}
                data={item}
              />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArsenalStats;
