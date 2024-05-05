import React, { useState, useEffect } from 'react';
import monImage from '../images/s-a.png';
import './ParametresPage.css';
import Swal from 'sweetalert2';
import { httpClient } from '../Api/HttpClient';

const SettingsPage = () => {
  const [configurations, setConfigurations] = useState([]);

  useEffect(() => {
    // Effectue une requête GET pour récupérer la liste des configurations lors du chargement du composant
    fetchConfigurations();
  }, []);

  const fetchConfigurations = () => {
    // Effectue une requête GET pour récupérer la liste des configurations depuis votre backend
    httpClient.get('/api/configurations')
      .then(response => {
        // Met à jour le state avec les données récupérées
        setConfigurations(response.data);
      })
      .catch(error => {
        console.error('Error fetching configurations:', error);
      });
  };

  const handleSaveClick = () => {
    // Envoie une requête POST pour sauvegarder les modifications des configurations
    httpClient.post('/api/configurations', configurations)
        .then(response => {
            // Gérer la réponse du serveur si nécessaire
            console.log('Configurations saved successfully:', response.data);
            // Affiche une notification de succès
            Swal.fire({
                icon: 'success',
                title: 'Configurations saved successfully',
                showConfirmButton: false,
                timer: 2000
            });
        })
        .catch(error => {
            // Gérer les erreurs
            console.error('Error saving configurations:', error);
            // Affiche une notification d'erreur
            Swal.fire({
                icon: 'error',
                title: 'Error saving configurations',
                text: error.message
            });
        });
};

  const handleInputChange = (configurationIndex, paramName, newValue) => {
    const updatedConfigurations = [...configurations];
    updatedConfigurations[configurationIndex].values[paramName] = newValue;
    setConfigurations(updatedConfigurations);
  };

  // Autres fonctions de manipulation des configurations (ajout, suppression, etc.)

  return (
    <div style={{ maxWidth: '95%', height: 'auto', marginLeft: '85px' }}>
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
          {/* Afficher les configurations récupérées */}
          {configurations.map((configuration, index) => (
            <div className="section-container" key={configuration.id}>
              <h2>{configuration.name}</h2>
              <ul>
                {Object.entries(configuration.values).map(([paramName, paramValue]) => (
                  <li key={paramName}>
                    {paramName}:
                    <input
                      type="text"
                      style={{ width: '20%' }}
                      value={paramValue}
                      onChange={(e) => handleInputChange(index, paramName, e.target.value)}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;