import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ArsenalStats from '../components/arsenal';
import CountStats from '../components/count';
import Header from '../components/header';
import RecentGamesDetails from '../components/recent-games-details';
import { TabMenu } from 'primereact/tabmenu';
import { Button } from 'primereact/button';
interface TabItem {
  label: string;
  command?: () => void;
}
const DashboardPage: React.FC = () => {
  const location = useLocation();
  const { pitcherName, pitcherId, chosenPitcherData } = location.state || { pitcherName: null, pitcherId: null, chosenPitcherData: null };
  const navigate = useNavigate();
  const [selectedComponent, setSelectedComponent] = useState<'arsenal' | 'count' | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(-1); // To track the active tab index
  const [key, setKey] = useState(0);


  const renderSelectedComponent = () => {
    switch (selectedComponent) {
      case 'arsenal':
        return pitcherId && <ArsenalStats pitcherId={pitcherId} />;
      case 'count':
        return pitcherId && <CountStats pitcherId={pitcherId} />;
      default:
        return null;
    }
  };
  const items: TabItem[] = [
    {
      label: 'Arsenal Stats',
      command: () => handleButtonClick('arsenal', 0),
    },
    {
      label: 'Count Stats',
      command: () => handleButtonClick('count', 1),
    },
  ];

  const handleButtonClick = (component: 'arsenal' | 'count', index: number) => {
    setSelectedComponent(prev => (prev === component ? null : component));
    setActiveIndex(prev => (prev === index ? -1 : index)); 
    setKey(prev => prev + 1); 

  };
  const handleNavigateBack = () => {
    navigate(-1);
  };
  const closeSelectedComponent = () =>{
    setSelectedComponent(null);
    setActiveIndex(-1);
    setKey(prev => prev + 1); 

  }
  return (
    <div className="flex flex-col h-screen bg-color-surface-100">
      {pitcherName && (
        <Header chosenPitcherData={chosenPitcherData} onClick={handleNavigateBack} name={pitcherName} />
      )}
      <div className="relative w-full ">
        <div className="absolute top-0 left-0 w-full flex flex-col">
          <div className="flex flex-row bg-color-surface-300 justify-between items-center">
            <TabMenu model={items} activeIndex={activeIndex} key={key}  className="bg-color-primary-300"/> 
            {activeIndex != -1 &&(
              <Button icon="pi pi-times" size="small" onClick={closeSelectedComponent} rounded  text raised aria-label="Close"
                    style={{ backgroundColor: '#98cbee', color: 'black' ,marginRight:"1rem" }}
                />
            )
            }
          </div>
          {renderSelectedComponent()}
        </div>
      </div>

      
      {pitcherId && <RecentGamesDetails pitcher_id={pitcherId} chosenPitcherData={chosenPitcherData}/>}
    </div>
  );
};

export default DashboardPage;
