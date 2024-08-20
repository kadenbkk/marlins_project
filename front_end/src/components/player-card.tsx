import React from 'react';
import logo from '../assets/m_logo.png';
interface PlayerCardProps {
    name: string;
    pitcher_id: string;
    chosenPitcherData: any;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ name, pitcher_id, chosenPitcherData, }) => {
    const position = chosenPitcherData.Pos === "SP" ? "Starting Pitcher"
        : chosenPitcherData.Pos === "RP" ? "Relief Pitcher"
            : "Pitcher";
    return (
        <div className="flex flex-row items-center justify-between bg-card rounded-lg overflow-hidden">
            <div className="flex flex-row  items-start w-full space-x-4 h-full p-10">
                <div className="flex flex-col w-96 space-y-4 mr-16">
                    <h1 className="text-3xl pb-2 mb-2 border-b border-gray-700 text-white">{name}</h1>
                    <div className="text-base   text-off-white">
                        <span className="text-sub-title ">Current Year: </span> {chosenPitcherData.Year}
                    </div>
                    <div className="text-base   text-off-white">
                        <span className="text-sub-title">Position: </span> {position}
                    </div>
                    <div className="text-base flex flex-row text-off-white">
                        <span className="text-sub-title mr-1 ">Current Age: </span> {chosenPitcherData.Age}
                    </div>
                </div>
                <div className="relative">
                    <div className="absolute inset-[-10px] skew-x-custom-neg-15 bg-red rounded-lg transform translate-x-20 -translate-y-12 w-64 h-96"></div>
                    <div className="absolute inset-[-10px] -skew-x-12 bg-blue rounded-lg transform translate-x-24 -translate-y-12 w-64 h-96"></div>
                    <img
                        src={`https://securea.mlb.com/mlb/images/players/head_shot/${pitcher_id}.jpg`}
                        alt={""}
                        className="relative w-64 object-contain rounded-lg shadow-xl"
                        style={{ backgroundColor: 'rgb(195, 195, 195)' }} />

                </div>
            </div>
        </div>
    );
};

export default PlayerCard;
