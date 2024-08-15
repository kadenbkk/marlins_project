import React, { useEffect, useState } from 'react';
import { Chart } from 'primereact/chart'; // Ensure this import is correct
import { getPitchColor, getPitchName, getPitchNameMapArray, pitchColorMap, PitchingStatistics, pitchNameMap } from '../types/types';
import { parseJSONWithNaN } from '../utils/utils';

interface CountStatsProps {
  pitcherId: string;
}

const CountStats: React.FC<CountStatsProps> = ({ pitcherId }) => {
  const [countStats, setCountStats] = useState<PitchingStatistics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openCount, setOpenCount] = useState<string | null>('0-0');

  const fetchCountStats = async () => {
    if (!pitcherId) return;

    try {
      const response = await fetch(`http://127.0.0.1:5000/stats/pitcher/by_count/${pitcherId}`);
      const text = await response.text();

      const data: PitchingStatistics = parseJSONWithNaN(text);

      if (response.ok) {
        setCountStats(data);
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
    fetchCountStats();
  }, [pitcherId]);

  const toggleCount = (count: string) => {
    setOpenCount(count);
  };

  const getChartData = () => {
    if (!countStats || !openCount || !countStats[openCount]) return null;

    const pitchTypes = Object.keys(countStats[openCount]);
    const data = {
      labels: getPitchNameMapArray(pitchTypes),
      datasets: [
        {
          data: pitchTypes.map(pitchType => countStats![openCount]![pitchType]?.total_pitch_percentage ?? 0),
          backgroundColor: pitchTypes.map(pitch => getPitchColor(pitch)),
          hoverBackgroundColor: pitchTypes.map(pitch => getPitchColor(pitch)),
        },
      ],
    };

    return data;
  };

  const chartData = getChartData();
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => {
            const value = Math.round(tooltipItem.raw);
            return ` ${value}%`;
          }
        }
      }

    }
  };
  const strikeBallComponent = (strikes: number, inplay: number, balls: number) => {
    if(strikes==0 && inplay==0 && balls==0){
      return (
        <div className="flex rounded border bg-gray-200 overflow-hidden">
          <div className="h-8 flex items-center justify-center overflow-hidden whitespace-nowrap truncate w-full">
            No data
          </div>
        </div>
      );
    }
    return (
      <div className="flex rounded shadow-md overflow-hidden">
        <div
          style={{ width: `${strikes}%`, backgroundColor: 'green' }}
          className="h-8 flex items-center justify-center overflow-hidden whitespace-nowrap truncate"
        >
          Strike
        </div>
        <div
          style={{ width: `${inplay}%`, backgroundColor: 'gray' }}
          className="h-8 flex items-center justify-center overflow-hidden whitespace-nowrap truncate"
        >
          In-play
        </div>
        <div
          style={{ width: `${balls}%`, backgroundColor: 'red' }}
          className="h-8 flex items-center justify-center overflow-hidden whitespace-nowrap truncate"
        >
          Ball
        </div>
      </div>
    );
  };


  return (
    <div className="relative">
      {loading && <div className="w-full bg-card h-72 absolute top-0 left-0 z-20 flex items-center justify-center">Loading...</div>}
      {error && <p className="text-red-600">{error}</p>}
      <div className="w-full absolute top-0 left-0 z-20">
        <div className="flex flex-wrap bg-card">
          {Object.keys(countStats || {}).map((count) => (
            <div className="w-1/12 px-0.5 rounded" key={count}>
              <button
                className={`flex items-center justify-center w-full text-left font-bold text-lg ${openCount === count ? 'bg-blue' : 'bg-slate-gray'
                  } text-black p-2 rounded-t-xl 
                ${openCount === count ? 'hover:bg-blue' : 'hover:bg-slate-gray-hover'
                  } 
                transition-colors`}
                onClick={() => toggleCount(count)}
              >
                {count}
              </button>
            </div>
          ))}
        </div>
        {openCount && countStats && countStats[openCount] && (
          <div className="bg-card">
            <div className="flex flex-wrap">
              {chartData && (
                <div className="p-2 relative flex items-center justify-center w-1/5">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-semibold text-base">Pitch usage</span>
                  </div>
                  <Chart type="doughnut" data={chartData} options={chartOptions} className="w-full" />
                </div>
              )}
              <div className="w-3/5">
                {Object.keys(countStats[openCount]).map((pitchType) => {
                  const pitchData = countStats[openCount][pitchType] || {};
                  return (
                    <div key={pitchType} className="p-4 rounded flex flex-row w-full">
                      <div className="flex flex-col w-2/6">
                        <div className="flex flex-row mt-0.5 items-center">
                          <div
                            className="rounded-full mr-2 w-3 h-3"
                            style={{ backgroundColor: getPitchColor(pitchType) }}
                          ></div>
                          <h4 className="font-semibold text-base">{getPitchName(pitchType)}</h4>
                        </div>
                        <div className="flex flex-row justify-between items-center">
                          <p className="text-gray-400 text-sm">Pitch usage: {pitchData.total_pitch_percentage ?? 0}% ({pitchData.total_pitch_count ?? 0})</p>
                        </div>
                      </div>
                      <div className="flex w-4/6 flex-col justify-center">
                        {strikeBallComponent(
                          pitchData.strike_percentage ?? 0,
                          pitchData.in_play_percentage ?? 0,
                          pitchData.ball_percentage ?? 0
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="w-1/5">
                batting avg 
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CountStats;
