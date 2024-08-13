import React from 'react';

interface ExportFunctionHeaderProps {
    onClick: () => void;
    name: string;
}

const Header: React.FC<ExportFunctionHeaderProps> = ({ name, onClick }) => {
    return (
        <div className="flex flex-row items-center justify-between p-4 bg-gray-100 border-b border-gray-300">
            <div className="flex flex-row">
                <button
                    onClick={onClick}
                    className="mr-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Go Back
                </button>
                <h1 className="text-2xl font-semibold">{name}</h1>
            </div>
        </div>
    );
};

export default Header;
