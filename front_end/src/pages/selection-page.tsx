import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/marlins_logo.svg';
import miami from '../assets/miami_text.png';
import dolphin from '../assets/dolphin.png';
import marlins from '../assets/marlins_text.png';
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
        console.log("data: ", pitcherData);
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
    <div className="flex items-center flex-col justify-start min-h-screen bg-page">
      <div className="flex w-full flex-row items-center  justify-center p-4 bg-card">
        <div className="flex flex-row  items-center  justify-center">
          <img
            src={miami}
            alt={""}
            className="object-contain h-14"
          />
          <img
            src={dolphin}
            alt={""}
            className="ml-3 mr-1 object-contain w-10"
          />
          <img
            src={marlins}
            alt={""}
            className="object-contain h-14"
          />
        </div>
        <div className="text-off-white italic w-8 h-8">
        </div>
      </div>
      <div>
        {pitchers.length > 0 && (
          <ul className="grid grid-cols-4 gap-4 p-10 m-0 list-none">
            {pitchers.map((pitcher, index) => (
              pitcher.id && (
                <li key={index}>
                  <button
                    className="text-gray-700 rounded w-full p-5 pr-10 bg-card pl-5 flex justify-start items-center"
                    onClick={() => handlePitcherClick(pitcher, index)}
                    style={{
                      border: '2px solid #00A3E0',
                      boxShadow: '-1px 1px 0 0.5px #EE3541',
                      color: 'white',
                    }}
                  >
                    <div className="flex flex-row justify-start items-center">
                      <img
                        src={`https://securea.mlb.com/mlb/images/players/head_shot/${pitcher.id}.jpg`}
                        alt={pitcher.name}
                        className="mr-2 rounded-full object-contain w-9"
                        style={{ backgroundColor: 'rgb(195, 195, 195)' }}
                      />
                      <div className="flex flex-col">
                        <div className="text-2xl ml-2">{pitcher.name}</div>
                        <div className="flex flex-row">
                          <div className="text-sm text-off-white  ml-2">Age: {pitcherData[index].Age}</div>
                          <div className="text-sm text-off-white ml-2">IP: {pitcherData[index].IP}</div>
                        </div>
                      </div>
                    </div>
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
