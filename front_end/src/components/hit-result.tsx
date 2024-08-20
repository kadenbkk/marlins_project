// HitOutcomePlot.tsx

import React, { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import { parseJSONWithNaN } from '../utils/utils';


export interface HitOutcome {
    launch_angle: number;
    bb_type: string;
    launch_speed: number;
    launch_speed_angle: number;
    hc_x: number;
    hc_y: number;
    hit_distance_sc: number;
    events: string;
  }
  
  export interface HitOutcomeSummary {
    total_hits: number;
    hits_by_type: Record<string, number>;
    mean_launch_speed: number;
    std_dev_launch_speed: number;
    min_launch_speed: number;
    max_launch_speed: number;
    mean_launch_angle: number;
    std_dev_launch_angle: number;
    min_launch_angle: number;
    max_launch_angle: number;
    mean_hit_distance: number;
    std_dev_hit_distance: number;
    min_hit_distance: number;
    max_hit_distance: number;
  }
  
  export interface HitOutcomeResponse {
    summary: HitOutcomeSummary;
    hit_outcomes: HitOutcome[];
  }
  
const HitOutcome: React.FC<{ pitcherId: string }> = ({ pitcherId }) => {
  const [data, setData] = useState<HitOutcome[]>([]);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    // Fetch data from API
    const fetchData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/stats/pitcher/hit_outcome/${pitcherId}`);
        const result = await response.text();
        const data: HitOutcomeResponse = parseJSONWithNaN(result);
        console.log("result: ", result);
        setData(data.hit_outcomes);
        setSummary(data.summary);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [pitcherId]);

  return (
    <div className="flex flex-row ">
      <div className="w-1/2 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart>
            <CartesianGrid />
            <XAxis type="number" dataKey="launch_speed" name="Launch Speed" />
            <YAxis type="number" dataKey="hit_distance_sc" name="Hit Distance" />
            <Tooltip />
            <Legend />
            <Scatter name="Hit Outcomes" data={data} fill="#8884d8" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      {summary && (
        <div className="w-1/2">
          <h3>Summary</h3>
          <ul>
            <li>Total Hits: {summary.total_hits}</li>
            <li>Mean Launch Speed: {summary.mean_launch_speed.toFixed(2)}</li>
            <li>Standard Deviation Launch Speed: {summary.std_dev_launch_speed.toFixed(2)}</li>
            <li>Min Launch Speed: {summary.min_launch_speed.toFixed(2)}</li>
            <li>Max Launch Speed: {summary.max_launch_speed.toFixed(2)}</li>
            <li>Mean Launch Angle: {summary.mean_launch_angle.toFixed(2)}</li>
            <li>Standard Deviation Launch Angle: {summary.std_dev_launch_angle.toFixed(2)}</li>
            <li>Min Launch Angle: {summary.min_launch_angle.toFixed(2)}</li>
            <li>Max Launch Angle: {summary.max_launch_angle.toFixed(2)}</li>
            <li>Mean Hit Distance: {summary.mean_hit_distance.toFixed(2)}</li>
            <li>Standard Deviation Hit Distance: {summary.std_dev_hit_distance.toFixed(2)}</li>
            <li>Min Hit Distance: {summary.min_hit_distance.toFixed(2)}</li>
            <li>Max Hit Distance: {summary.max_hit_distance.toFixed(2)}</li>
            <li>Hits by Type: {JSON.stringify(summary.hits_by_type)}</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default HitOutcome;
