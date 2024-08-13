import React, { useEffect, useState } from 'react';
import { parseJSONWithNaN } from '../utils/utils';
import { Dropdown } from 'primereact/dropdown';
import { getFullTeamName } from '../types/types';

interface RecentGamesProps {
  pitcherId: string;
}
interface GameOption {
  label: string;
  value: number;
}
const RecentGames: React.FC<RecentGamesProps> = ({ pitcherId }) => {
  const [recentGames, setRecentGames] = useState<GameOption[]>([]);
  const [selectedGame, setSelectedGame] = useState<GameOption | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const formatGameLabel = (gamePk: string, data: any): string => {
    const fullTeamName = getFullTeamName(data[gamePk].opponent);

    // Parse the game date from yyyy-mm-dd format
    const gameDate = new Date(data[gamePk].game_date);

    // Format the date to abbreviated month and day (e.g., "Aug 13")
    const formattedDate = gameDate.toLocaleString('en-US', { month: 'short', day: 'numeric' });

    return `${fullTeamName},\u00A0${formattedDate}`;
  };
  const gameOptionTemplate = (option: GameOption) => {
    return (
      <div className="flex justify-between w-full py-2 pl-3 pr-4 border-b mb-1">
        <span>{option.label.split(',\u00A0')[0]}</span>
        <span>{option.label.split(',\u00A0')[1]}</span>
      </div>
    );
  };
  const fetchRecentGames = async () => {
    if (!pitcherId) return;

    try {
      const response = await fetch(`http://127.0.0.1:5000/stats/pitcher/recent/${pitcherId}`);
      const text = await response.text();


      if (response.ok) {
        const data = parseJSONWithNaN(text);
        // Sort game keys by most recent game date
        const sortedGameKeys = Object.keys(data).sort((a, b) => {
          const dateA = new Date(data[a].game_date);
          const dateB = new Date(data[b].game_date);
          return dateB.getTime() - dateA.getTime(); // Most recent first
        });
        const gameOptions: GameOption[] = sortedGameKeys.map((gamePk) => ({
          label: formatGameLabel(gamePk, data),
          value: parseInt(gamePk, 10),
        }));
        setRecentGames(gameOptions);
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
        <div className="w-80 flex flex-col">
          <h2 className="text-xl font-semibold">Recent Games</h2>
          <Dropdown
            value={selectedGame}
            onChange={(e) => setSelectedGame(e.value)}
            options={recentGames}
            optionLabel="label"
            placeholder="Select a game"
            showClear
            itemTemplate={gameOptionTemplate}
            className="w-full md:w-14rem"
            style={{ padding: '10px', border: '1px solid lightgray', borderRadius: "10px" }}
          />
        </div>
      )}
    </div>
  );
};

export default RecentGames;
