import React from 'react';
import { Button } from 'primereact/button';
import logo from '../assets/marlins_logo.svg';

interface ExportFunctionHeaderProps {
    onClick: () => void;
    name: string;
    chosenPitcherData: any;
}

const Header: React.FC<ExportFunctionHeaderProps> = ({ name, chosenPitcherData, onClick }) => {
    const position = chosenPitcherData.Pos === "SP" ? "Starting Pitcher"
        : chosenPitcherData.Pos === "RP" ? "Relief Pitcher"
            : "Pitcher";
    return (
        <div className="flex flex-row items-center justify-between p-4 bg-card">
            <div className="flex flex-row items-center">
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
                <h1 className="text-2xl  ml-4 text-off-white font-semibold">{name}</h1>
            </div>
            <div>
                {/* <img className="h-10 object-contain" src={logo} alt="Logo"></img> */}
            </div>
            <div className="flex flex-row justify-between items-center">
                <div className="text-lg font-medium text-white">
                    <span className="text-sub-title ">Age:</span> {chosenPitcherData.Age}
                </div>
                <div className="text-lg ml-5 font-medium text-white">
                    <span className="text-sub-title">Position:</span> {position}
                </div>
                <div className="text-lg ml-5 font-medium text-white">
                    <span className="text-sub-title ">Current Year:</span> {chosenPitcherData.Year}
                </div>
            </div>

        </div>
    );
};

export default Header;
