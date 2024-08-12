import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SelectionPage: React.FC = () => {
  const [pitchers, setPitchers] = useState<string[]>([]);
  const [chosenPitcherName, setChosenPitcherName] = useState<string | null>(null);
  const [chosenPitcherId, setChosenPitcherId] = useState<string | null>(null);
  const navigate = useNavigate(); 

  const getAllPitchers = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/all/pitchers');
      const data = await response.json();

      if (response.ok) {
        console.log('data:', data);
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

  const handlePitcherClick = (pitcher: string) => {
    setChosenPitcherName(pitcher);
    const [firstName, lastName] = pitcher.split(' ');
    fetchPlayerId(firstName, lastName);
  };

  useEffect(() => {
    if (chosenPitcherId) {
      navigate('/dashboard', { state: { pitcherName: chosenPitcherName, pitcherId: chosenPitcherId } });
    }
  }, [chosenPitcherId, navigate, chosenPitcherName]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div>
        {pitchers.length === 0 && (
          <button onClick={getAllPitchers}>Pitchers</button>
        )}
        {pitchers.length > 0 && (
          <ul className="list-disc list-inside">
            {pitchers.map((pitcher, index) => (
              <li key={index}>
                <button
                  className="text-lg text-gray-700"
                  onClick={() => handlePitcherClick(pitcher)}
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
