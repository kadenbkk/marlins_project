import React from 'react';
import logo from '../assets/m_logo.png';
import miami from '../assets/miami_text.png';
import dolphin from '../assets/dolphin.png';
import marlins from '../assets/marlins_text.png';
interface ExportFunctionHeaderProps {
    onClick: () => void;
    name: string;
    pitcher_id: string;
    chosenPitcherData: any;
}

const Header: React.FC<ExportFunctionHeaderProps> = ({ name, pitcher_id, chosenPitcherData, onClick }) => {
    const position = chosenPitcherData.Pos === "SP" ? "Starting Pitcher"
        : chosenPitcherData.Pos === "RP" ? "Relief Pitcher"
            : "Pitcher";
    return (
        <div className="flex flex-row items-center  justify-between p-4 bg-card">
            <button
                onClick={onClick}
                aria-label="Back"
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: '2px solid #00A3E0',
                    boxShadow: '-1px 1px 0 0.5px #EE3541',
                    backgroundColor: 'black',
                    color: 'white',
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '50%',
                    cursor: 'pointer',
                }}
            >
                <i className="pi pi-angle-left"></i>
            </button>
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
            {/* <div className="flex flex-row items-start">
                <button
                    onClick={onClick}
                    aria-label="Back"
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        border: '2px solid #00A3E0',
                        boxShadow: '-1px 1px 0 0.5px #EE3541',
                        backgroundColor: 'black',
                        color: 'white',
                        width: '2rem',
                        height: '2rem',
                        borderRadius: '50%',
                        cursor: 'pointer',
                    }}
                >
                    <i className="pi pi-angle-left"></i>
                </button>
                <div className="flex flex-row ml-14  items-center h-48 ">
                    <img
                        src={`https://securea.mlb.com/mlb/images/players/head_shot/${pitcher_id}.jpg`}
                        alt={""}
                        className="mr-2 rounded-full object-contain w-28"
                        style={{ backgroundColor: 'rgb(195, 195, 195)' }}
                    />
                    <div className="flex flex-col ml-4  items-start">
                        <h1 className="text-5xl text-white">{name}</h1>
                        <div className="flex  ml-2 mt-2 mb-0.5 flex-row justify-between items-center">
                            <div className="text-md  text-off-white">
                                <span className="text-sub-title ">Age:</span> {chosenPitcherData.Age}
                            </div>
                            <div className="text-md ml-5  text-off-white">
                                <span className="text-sub-title ">Current Year:</span> {chosenPitcherData.Year}
                            </div>
                        </div>
                        <div className="text-md ml-2  text-off-white">
                            <span className="text-sub-title">Position:</span> {position}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center justify-start rounded-full">
                <img className="w-20 object-contain" src={logo} alt="Logo"></img>
            </div> */}

        </div>
    );
};

export default Header;
