import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SelectionPage: React.FC = () => {
  const [pitchers, setPitchers] = useState<string[]>([]);
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
        setPitchers(data.pitcher_names);
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (err) {
      console.error('Failed to retrieve current pitchers.', err);
    }
  };

  const fetchPlayerId = async (firstName: string, lastName: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/id/${firstName}/${lastName}`);
      const data = await response.json();

      if (response.ok) {
        console.log('id:', data);
        setChosenPitcherId(data.player_id);
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (err) {
      console.error('Failed to retrieve pitcher ID.', err);
    }
  };

  const handlePitcherClick = (pitcher: string, index: number) => {
    setChosenPitcherName(pitcher);
    setChosenPitcherData(pitcherData[index]);
    const [firstName, lastName] = pitcher.split(' ');
    fetchPlayerId(firstName, lastName);
  };

  useEffect(() => {
    if (chosenPitcherId) {
      navigate('/dashboard', { state: { pitcherName: chosenPitcherName, pitcherId: chosenPitcherId, chosenPitcherData: chosenPitcherData } });
    }
  }, [chosenPitcherId, navigate, chosenPitcherName]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-page">
      <div>
        {pitchers.length === 0 && (
          <button className="rounded" style={{
            border: '2px solid #00A3E0',
            boxShadow: '-1px 1px 0 0.5px #EE3541',
            backgroundColor: 'black',
            color: 'white',
            padding: "10px",
            width: "10rem",
          }}
          onClick={getAllPitchers}>Pitchers</button>
        )}
        {pitchers.length > 0 && (
          <ul className="grid grid-cols-3 gap-4 p-0 m-0 list-none">
            {pitchers.map((pitcher, index) => (
              <li key={index}>
                <button
                  className="text-lg text-gray-700 rounded w-full p-2 flex justify-center items-center"
                  onClick={() => handlePitcherClick(pitcher, index)}
                  style={{
                    border: '2px solid #00A3E0',
                    boxShadow: '-1px 1px 0 0.5px #EE3541',
                    backgroundColor: 'black',
                    color: 'white',
                  }}
                >
                  {pitcher}
                </button>
              </li>
            ))}
          </ul>
        )}

      </div>
    </div>
  );
};

export default SelectionPage;
