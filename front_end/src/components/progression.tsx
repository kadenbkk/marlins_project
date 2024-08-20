import React, { useState, useEffect } from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, Tooltip,
  CartesianGrid, Legend, ResponsiveContainer, Label
} from 'recharts';
import dayjs from 'dayjs';

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
    const fetchData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/stats/pitcher/progression/${pitcherId}`);
        const result = await response.json();

        // Format the date before setting the data
        const formattedData = result.progression.map((item: PitchData) => ({
          ...item,
          game_date: dayjs(item.game_date).format('YYYY-MM-DD'), // Consistent date format
        }));

        setData(formattedData);
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

  // Get unique pitch types for coloring
  const pitchTypes = Array.from(new Set(data.map(item => item.pitch_type)));

  // Define colors for different pitch types
  const pitchTypeColors: { [key: string]: string } = {
    'FF': '#8884d8',
    'SL': '#82ca9d',
    'SI': '#ffc658',
    'CH': '#ff7300',
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
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid />
            <XAxis
              type="category"
              dataKey="game_date"
              name="Game Date"
              padding={{ left: 5, right: 5 }}
              tickFormatter={(tick: string) => dayjs(tick).format('MMM D')} // Format X-axis ticks
            >
              <Label value="Game Date" position="bottom" offset={-10} />
            </XAxis>
            <YAxis
              type="number"
              dataKey={filter}
              name={filter}
              domain={['auto', 'auto']}
              padding={{ top: 20, bottom: 20 }}
            >
              <Label value={filter} angle={-90} position="left" offset={10} />
            </YAxis>
            <Tooltip
              formatter={(value: any, name: string, props: any) => {
                const date = dayjs(props.payload.game_date).format('MMM D');
                return [`${name}: ${value}`, `Date: ${date}`];
              }}
            />
            <Legend
              formatter={(value: any) => {
                return pitchTypes.includes(value) ? value : 'Data'; // Adjust legend text
              }}
            />
            {pitchTypes.map(pitchType => (
              <Scatter
                key={pitchType}
                name={pitchType}
                data={filteredData.filter(item => item.pitch_type === pitchType)}
                fill={pitchTypeColors[pitchType] || '#000000'} // Default to black if no color is found
                shape="circle" // Ensure that points are not overlapping
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Progression;
