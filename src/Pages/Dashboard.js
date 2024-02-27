// Dashboard.js (composant principal)
import React from 'react';
import { ResponsiveContainer } from 'recharts';
import LineChartComponent from '../Components/DashboardComponents/LineChart';
import PieChartComponent from '../Components/DashboardComponents/EtatsPieChart';
import StateBlock from '../Components/DashboardComponents/StateBlock';
import './Dashboard.css'
import monImage from '../images/s-a.png'

const Dashboard = () => {
  const statesData = [
    { stateName: 'COURS', quantity: 120 },
    { stateName: 'ACCEPTE', quantity: 90 },
    { stateName: 'REFUSE', quantity: 75 },
    { stateName: 'RETARD', quantity: 60 },
    { stateName: 'NOSHOW', quantity: 45 },
    { stateName: 'ANNULE', quantity: 30 },
  ];

  const handleStateClick = (stateName) => {
    // Handle click for the specific state
    console.log(`Clicked on ${stateName}`);
  };
  return (
    
    <div>
      
      <img src={monImage} style={{ maxWidth: '100%', height: 'auto', width: '150px', marginLeft: '75px' }} />
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
        {/* State Blocks */}
        <div className="state-container">
          {statesData.map((stateInfo, index) => (
            <StateBlock
              key={index}
              stateName={stateInfo.stateName}
              quantity={stateInfo.quantity}
              onClick={() => handleStateClick(stateInfo.stateName)}
            />
          ))}
        </div>

        {/* PieChart */}
        <ResponsiveContainer width="80%" height={160}>
          <PieChartComponent />
        </ResponsiveContainer>

        {/* Ajout d'espace entre les graphiques */}
        <div style={{ height: '200px' }}></div>

        {/* LineChart */}
        <ResponsiveContainer width="80%" height={200} >
          <LineChartComponent />
        </ResponsiveContainer>


        {/* Ajout d'espace entre les graphiques */}
        <div style={{ height: '20px' }}></div>

        {/* ... Ajoute d'autres graphiques ici ... */}
      </div>
    </div>
  );
};

export default Dashboard;
