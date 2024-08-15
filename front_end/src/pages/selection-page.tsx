import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
interface PitcherData {
  name: string;
  id: string;
}
const SelectionPage: React.FC = () => {
  const [pitchers, setPitchers] = useState<PitcherData[]>([]);
  const [chosenPitcherName, setChosenPitcherName] = useState<string | null>(null);
  const [pitcherData, setPitcherData] = useState<any | null>(null);
  const [chosenPitcherData, setChosenPitcherData] = useState<any | null>(null);
  const [chosenPitcherId, setChosenPitcherId] = useState<string | null>(null);
  const navigate = useNavigate();

  const getAllPitchers = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/all/pitchers');
      const data = await response.json();

      if (response.ok) {
        setPitcherData(data.data);
        const pitchersWithIds = await Promise.all(
          data.pitcher_names.map(async (pitcher: string) => {
            const [firstName, lastName] = pitcher.split(' ');
            const playerId = await fetchPlayerId(firstName, lastName);
            return { name: pitcher, id: playerId };
          })
        );

        setPitchers(pitchersWithIds);
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (err) {
      console.error('Failed to retrieve current pitchers.', err);
    }
  };

  const fetchPlayerId = async (firstName: string, lastName: string): Promise<string> => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/id/${firstName}/${lastName}`);
      const data = await response.json();

      if (response.ok) {
        return data.player_id;
      } else {
        console.error('Error:', response.statusText);
        return '';
      }
    } catch (err) {
      console.error('Failed to retrieve pitcher ID.', err);
      return '';
    }
  };

  const handlePitcherClick = (pitcher: PitcherData, index: number) => {
    setChosenPitcherName(pitcher.name);
    setChosenPitcherData(pitcherData[index]);
    setChosenPitcherId(pitcher.id);
  };

  useEffect(() => {
    if (chosenPitcherId) {
      navigate('/dashboard', { state: { pitcherName: chosenPitcherName, pitcherId: chosenPitcherId, chosenPitcherData: chosenPitcherData } });
    }
  }, [chosenPitcherId, navigate, chosenPitcherName]);

  useEffect(() => {
    getAllPitchers();
  }, []);
  return (
    <div className="flex items-center justify-center min-h-screen bg-page">
      <div>
        {pitchers.length === 0 && (
          <button
            className="rounded"
            style={{
              border: '2px solid #00A3E0',
              boxShadow: '-1px 1px 0 0.5px #EE3541',
              backgroundColor: 'black',
              color: 'white',
              padding: '10px',
              width: '10rem',
            }}
            onClick={getAllPitchers}
          >
            Pitchers
          </button>
        )}
        {pitchers.length > 0 && (
          <ul className="grid grid-cols-1 gap-4 py-20 m-0 list-none">
            {pitchers.map((pitcher, index) => (
              pitcher.id && (
                <li key={index}>
                  <button
                    className="text-lg text-gray-700 rounded w-full p-4 pr-10 pl-5 flex justify-start items-center"
                    onClick={() => handlePitcherClick(pitcher, index)}
                    style={{
                      border: '2px solid #00A3E0',
                      boxShadow: '-1px 1px 0 0.5px #EE3541',
                      backgroundColor: 'black',
                      color: 'white',
                    }}
                  >
                    <img
                      src={`https://securea.mlb.com/mlb/images/players/head_shot/${pitcher.id}.jpg`}
                      alt={pitcher.name}
                      className="mr-2 rounded-full object-contain w-10"
                      style={{ backgroundColor: 'rgb(195, 195, 195)' }}
                    />

                    <div className="text-3xl ml-2">{pitcher.name}</div>
                  </button>
                </li>
              )
            ))}
          </ul>

        )}
      </div>
    </div>
  );
};

export default SelectionPage;
