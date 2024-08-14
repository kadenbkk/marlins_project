import React from 'react';
import { Button } from 'primereact/button';

interface ExportFunctionHeaderProps {
    onClick: () => void;
    name: string;
}

const Header: React.FC<ExportFunctionHeaderProps> = ({ name, onClick }) => {
    return (
        <div className="flex flex-row items-center justify-between p-4 bg-gray-700">
            <div className="flex flex-row items-center">
                <Button icon="pi pi-angle-left" size="large" onClick={onClick} rounded  text raised aria-label="Back"
                    style={{ backgroundColor: 'white', color: 'black' }}
                />
                <h1 className="text-2xl ml-4 font-semibold">{name}</h1>
            </div>
        </div>
    );
};

export default Header;
