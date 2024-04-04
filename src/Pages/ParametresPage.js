import React, { useState } from 'react';
import monImage from '../images/s-a.png';
import './ParametresPage.css';
import Swal from 'sweetalert2';

const SettingsPage = () => {
  const [retardValues, setRetardValues] = useState([0, 0, 0]);
  const [tempsAttenteValues, setTempsAttenteValues] = useState([0, 0, 0]);

  const handleInputChange = (section, index, value) => {
    if (section === 'retard') {
      const newValues = [...retardValues];
      newValues[index] = value;
      // Make sure the last "plus petit que" is greater than or equal to the previous one
      if (index > 0 && newValues[index] < newValues[index - 1]) {
        newValues[index] = newValues[index - 1];
      }
      setRetardValues(newValues);
    } else if (section === 'tempsAttente') {
      const newValues = [...tempsAttenteValues];
      newValues[index] = value;
      // Make sure the last "plus petit que" is greater than or equal to the previous one
      if (index > 0 && newValues[index] < newValues[index - 1]) {
        newValues[index] = newValues[index - 1];
      }
      setTempsAttenteValues(newValues);
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
    <div style={{ maxWidth: '95%', height: 'auto', marginLeft: '75px' }}>
      <img src={monImage} style={{ maxWidth: '100%', height: 'auto', width: '250px', paddingBottom: '30px' }} />
      <div className='bloc'>
        <div className="header-container">
          <div style={{ marginLeft: '20px' }}><h2 >Paramètres</h2></div>
          <div style={{ marginRight: '20px' }}>
            <button className="save-button" onClick={() => handleSaveClick(1)}>
              Enregistrer
            </button>
          </div>
        </div>
        <div className="page-container" >
          <div className="section-container">
            <h2>Retard</h2>
            <ul>
              {[0, 1, 2].map((index) => (
                <li key={index}>
                  Plus petit que:
                  <input
                    type="number"
                    style={{ width: '20%' }}
                    value={retardValues[index]}
                    onChange={(e) => handleInputChange('retard', index, e.target.value)}
                  />
                </li>
              ))}
              <li>
                Plus grand que:
                <input
                  type="number"
                  style={{ width: '20%' }}
                  value={retardValues[2]} // The "Plus grand que" field should be the same as the last "Plus petit que"
                  readOnly
                />
              </li>
            </ul>
          </div>

          <div className="section-container">
            <h2>Temps Attente</h2>
            <ul>
              {[0, 1, 2].map((index) => (
                <li key={index}>
                  Plus petit que:
                  <input
                    type="number"
                    style={{ width: '20%' }}
                    value={tempsAttenteValues[index]}
                    onChange={(e) => handleInputChange('tempsAttente', index, e.target.value)}
                  />
                </li>
              ))}
              <li>
                Plus grand que:
                <input
                  type="number"
                  style={{ width: '20%' }}
                  value={tempsAttenteValues[2]} // The "Plus grand que" field should be the same as the last "Plus petit que"
                  readOnly
                />
              </li>
            </ul>
          </div>

          <div className="section-container">
            <h2>Durée avant Retard</h2>
            <ul>
              <li>
                temps en minutes avant retard:
                <input
                  type="number"
                  style={{ width: '20%' }} />
              </li>
            </ul>
          </div>
          <div className="section-container">
            <h2>A Venir</h2>
            <ul>
              
              <li>
                Temps avant l'heure du RDV:
                <input
                  type="number"
                  style={{ width: '20%' }}
                  value={tempsAttenteValues[0]}
                />
              </li>
              <li>
                Temps apres l'heure du RDV:
                <input
                  type="number"
                  style={{ width: '20%' }}
                  value={tempsAttenteValues[2]} // The "Plus grand que" field should be the same as the last "Plus petit que"
                  readOnly
                />
              </li>
            </ul>
          </div>
          <div className="section-container">
            <h2>Avance</h2>
            <ul>
              <li>
                durée avant l'etat A Venir:
                <input
                  type="number"
                  style={{ width: '20%' }}
                  value={tempsAttenteValues[0]} // The "Plus grand que" field should be the same as the last "Plus petit que"
                  
                />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
