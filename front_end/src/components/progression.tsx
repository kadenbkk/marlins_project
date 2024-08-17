import React, { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';

interface PitchData {
  game_date: string;
  pitch_type: string;
  mean_release_speed: number;
  mean_release_spin_rate: number;
  mean_spin_axis: number;
  mean_release_extension: number;
  mean_pfx_x: number;
  mean_pfx_z: number;
  mean_pfx_hypotenuse: number;
  strike_percentage?: number;
}

interface ProgressionProps {
  pitcherId: string;
}

const Progression: React.FC<ProgressionProps> = ({ pitcherId }) => {
  const [data, setData] = useState<PitchData[]>([]);
  const [filter, setFilter] = useState<string>('mean_release_speed');
  const [pitchTypeFilter, setPitchTypeFilter] = useState<string>('');

  useEffect(() => {
    // Fetch data from API
    const fetchData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/stats/pitcher/progression/${pitcherId}`);
        const result = await response.json();
        console.log("data", result);
        setData(result.progression);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [pitcherId]);

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(event.target.value);
  };

  const handlePitchTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPitchTypeFilter(event.target.value);
  };

  // Filtered data based on pitch type
  const filteredData = pitchTypeFilter
    ? data.filter(item => item.pitch_type === pitchTypeFilter)
    : data;

  // Get unique pitch types for filter options
  const pitchTypes = Array.from(new Set(data.map(item => item.pitch_type)));

  // Define colors for different pitch types
  const pitchTypeColors: { [key: string]: string } = {
    'Fastball': '#8884d8',
    'Slider': '#82ca9d',
    'Curveball': '#ffc658',
    'Changeup': '#ff7300',
    // Add more colors for other pitch types if needed
  };

  return (
    <div>
      <h2>Pitcher Progression Scatter Plot</h2>
      <div>
        <label htmlFor="filter">Select Filter: </label>
        <select id="filter" value={filter} onChange={handleFilterChange}>
          <option value="mean_release_speed">Release Speed</option>
          <option value="mean_release_spin_rate">Release Spin Rate</option>
          <option value="mean_spin_axis">Spin Axis</option>
          <option value="mean_release_extension">Release Extension</option>
          <option value="mean_pfx_x">PFX X</option>
          <option value="mean_pfx_z">PFX Z</option>
          <option value="mean_pfx_hypotenuse">PFX Hypotenuse</option>
        </select>
      </div>
      <div>
        <label htmlFor="pitch-type">Select Pitch Type: </label>
        <select id="pitch-type" value={pitchTypeFilter} onChange={handlePitchTypeChange}>
          <option value="">All</option>
          {pitchTypes.map(pitchType => (
            <option key={pitchType} value={pitchType}>
              {pitchType}
            </option>
          ))}
        </select>
      </div>
      <div className="w-full h-64 border border-red-400">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart>
            <CartesianGrid />
            <XAxis type="category" dataKey="game_date" name="Game Date" />
            <YAxis type="number" dataKey={filter} name={filter} />
            <Tooltip />
            <Legend />
            {pitchTypeFilter ? (
              <Scatter name={pitchTypeFilter} data={filteredData} fill={pitchTypeColors[pitchTypeFilter] || '#8884d8'} />
            ) : (
              pitchTypes.map(pitchType => (
                <Scatter key={pitchType} name={pitchType} data={data.filter(item => item.pitch_type === pitchType)} fill={pitchTypeColors[pitchType] || '#8884d8'} />
              ))
            )}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Progression;
