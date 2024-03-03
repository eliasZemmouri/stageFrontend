// SettingsPage.js

import React, { useState } from 'react';
import monImage from '../images/s-a.png';
import './ParametresPage.css';
import Swal from 'sweetalert2';

const SettingsPage = () => {
  // État local pour stocker les données du PieChart
  const [chart1Data, setChart1Data] = useState([
    { name: 'Petit', value: 15 },
    { name: 'Moyen', value: 30 },
    { name: 'Grand', value: 30 },
  ]);

  const [chart2Data, setChart2Data] = useState([
    { name: 'Petit', value: 20 },
    { name: 'Moyen', value: 25 },
    { name: 'Grand', value: 35 },
  ]);

  // Fonction pour mettre à jour les données du PieChart
  const handleDataUpdate = (chartIndex, dataIndex, value) => {
    // Vérifier si la valeur est numérique
    if (!isNaN(value) && value >= 0) {
      // Mettre à jour la valeur correspondante
      if (chartIndex === 1) {
        const updatedData = [...chart1Data];
        updatedData[dataIndex].value = parseFloat(value);
        setChart1Data(updatedData);
      } else if (chartIndex === 2) {
        const updatedData = [...chart2Data];
        updatedData[dataIndex].value = parseFloat(value);
        setChart2Data(updatedData);
      }
    }
  };

  const handleSaveClick = (chartIndex) => {
    // Logique de sauvegarde ici
    console.log(`Données du tableau ${chartIndex} enregistrées !`);
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: 'success',
      title: 'Signed in successfully',
    });
  };

  return (
    <div className="page-container" style={{ maxWidth: '100%', height: 'auto', width: '250px', marginLeft: '75px' }}>
      <div className="header-container">
        <img src={monImage} style={{ maxWidth: '100%', height: 'auto', width: '250px' }} />
        <h2>Paramètres</h2>
      </div>

      <div className="section-container">
        <h2>Retard</h2>
        <ul>
          {chart1Data.map((item, index) => (
            <li key={index}>
              {index > 0 && <span>&lsaquo; </span>}
              {index < chart1Data.length - 1 && <span>&rsaquo; </span>}
              {`${item.value}: ${item.name}`}
              <input
                type="number"
                value={item.value}
                onChange={(e) => handleDataUpdate(1, index, e.target.value)}
              />
            </li>
          ))}
        </ul>
        {/* Bouton Enregistrer pour le tableau Retard */}
        <button className="save-button" onClick={() => handleSaveClick(1)}>
          Enregistrer
        </button>
      </div>

      <div className="section-container">
        <h2>Temps Attente</h2>
        <ul>
          {chart2Data.map((item, index) => (
            <li key={index}>
              {index > 0 && <span>&lsaquo; </span>}
              {index < chart2Data.length - 1 && <span>&rsaquo; </span>}
              {`${item.value}: ${item.name}`}
              <input
                type="number"
                value={item.value}
                onChange={(e) => handleDataUpdate(2, index, e.target.value)}
              />
            </li>
          ))}
        </ul>
        {/* Bouton Enregistrer pour le tableau Temps Attente */}
        <button className="save-button" onClick={() => handleSaveClick(2)}>
          Enregistrer
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
