import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import monImage from '../images/s-a.png';
import { ResponsiveContainer } from 'recharts';
import PieChartComponent from '../Components/DashboardComponents/PieChart2';



const Dashboard2 = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(null);
  const [dropdownOptions, setDropdownOptions] = useState(["aujourd'hui","semaine","mois"]); // Remplacez ceci par vos options réelles
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [selectedState, setSelectedState] = useState(null);

  const formattedLastUpdate = () => {
    const now = new Date();
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return now.toLocaleDateString('fr-FR', options);
  };

  const handlePage1Click = () => {
    navigate('/dashboard');
  };
  // Ajout de la fonction handleDropdownChange pour gérer la sélection dans le Dropdown
  const handleDropdownChange = (e) => {
    if (e.value && e.value.stateName) {
      setSelectedOption(e.value);
      setSelectedState(e.value.stateName);
    }
  };

  // Ajout de la fonction handleRefreshClick pour gérer le clic sur le bouton de rafraîchissement
  const handleRefreshClick = () => {
    setIsButtonClicked(!isButtonClicked);
    window.location.reload();
  };


  return (
    <div style={{ textAlign: 'center', marginLeft: '75px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Image à gauche */}
        <img src={monImage} style={{ maxWidth: '100%', height: 'auto', width: '250px' }} />

        {/* Conteneur du centre */}
        <div style={{ flex: 1, textAlign: 'center' }}>
          <p style={{ whiteSpace: 'nowrap', marginTop: '10px' }}>Dernière Maj : {formattedLastUpdate()}</p>
        </div>

        {/* Conteneur à droite */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* Select */}
          <select
            className="form-select"
            value={selectedOption}
            onChange={(e) => handleDropdownChange(e.target.value)}
            style={{
              borderRadius: '20px',
              padding: '8px 16px',
              fontSize: '16px',
              border: '2px solid #007BFF',
              backgroundColor: 'white',
              color: '#333',
              outline: 'none',
              cursor: 'pointer',
              width: '150px',
            }}
          >
            {dropdownOptions.map((option, index) => (
              <option key={index} value={option} style={{ backgroundColor: '#f5f5f5', color: '#333' }}>
                {option}
              </option>
            ))}
          </select>

          {/* Espace entre le select et le bouton */}
          <div style={{ marginLeft: '20px' }}></div>

          {/* Bouton */}
          <button
            className={`fa fa-fw fa-retweet ${isButtonClicked ? 'clicked' : ''}`}
            style={{
              fontSize: '2em',
              backgroundColor: '#007BFF',
              color: 'white',
              padding: '4px',
              borderRadius: '20px',
              border: 'none',
              boxShadow: isButtonClicked ? '0 0 5px rgba(0, 0, 0, 0.3)' : 'none',
            }}
            onClick={handleRefreshClick}
          />
        </div>
        <div style={{ marginLeft: '20px' }}></div>
      </div>

      {/* PieChart */}
      <ResponsiveContainer width="60%" height={130}>
          <PieChartComponent />
        </ResponsiveContainer>

        {/* Ajout d'espace entre les graphiques */}
        <div style={{ height: '175px' }}></div>

      {/* Boutons en bas de la page */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          marginLeft: '35px',
          paddingBottom: '10px',
          textAlign: 'center',
        }}
      >
        {/* Bouton pour la page 1 */}
        <Button
          label="Dashboard 1"
          className="p-button-info"
          style={{ marginRight: '10px' }}
          onClick={handlePage1Click}
        />
        {/* Bouton pour le dashboard 2 (actuel) */}
        <Button
          label="Dashboard 2"
          className="p-button-info"
          disabled={true} // Désactiver le bouton actuel car nous sommes déjà sur le dashboard 2
        />
      </div>
    </div>
  );
};

export default Dashboard2;
