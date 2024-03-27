import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { httpClient } from '../Api/HttpClient';
import Swal from 'sweetalert2';
import monImage from '../images/s-a.png';

const RendezVousDataTable = () => {
  const [data, setData] = useState([]);
  const [selectedState, setSelectedState] = useState('Avenir');
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedST, setSelectedST] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!selectedST) return;
        const response = await httpClient.get(`/api/bookings/details/TODAY/${selectedST}`);
        const bookingDetailsArray = response.data.map((item) => {
          const { bookingDetails, rendezVousEtat } = item;
          return {
            ...bookingDetails,
            etat: rendezVousEtat.etat // Ajoutez la propriété etat
          };
        });
        setData(bookingDetailsArray);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, [selectedST]);

  const handleSTSelect = (st) => {
    setSelectedST(st);
    localStorage.setItem('selectedST', st);
  };

  useEffect(() => {
    const selectedSTFromStorage = localStorage.getItem('selectedST');
    if (selectedSTFromStorage) {
      setSelectedST(selectedSTFromStorage);
    }
  }, []);

  const handleStateChange = (state) => {
    setSelectedState(state);
  };

  const stateOptions = [
    { label: 'A venir', value: 'A venir' },
    { label: 'Avance', value: 'Avance' },
    { label: 'Retard', value: 'Retard' },
    { label: 'Validé', value: 'Validé' },
    { label: 'Refusé', value: 'Refusé' },
    // Ajoutez d'autres états selon vos besoins
  ];

  const handleGlobalFilterChange = (e) => {
    setGlobalFilter(e.target.value);
  };

  const handleRefreshClick = () => {
    window.location.reload();
  };
  const handleAddClick = () => {
    Swal.fire({
        title: 'Ajouter un rendez-vous',
        html:
            '<input id="plaque" class="swal2-input" style="margin-bottom: 30px;" placeholder="Plaque">' +
            '<div style="margin-bottom: 20px;"><input type="radio" id="accordChef" name="accordType" value="accordChef" style="transform: scale(1.5);"><label for="accordChef" style="margin-left: 5px;">Accord Chef</label><input type="radio" id="euemST" name="accordType" value="erreurST" style="transform: scale(1.5); margin-left: 20px;"><label for="erreurST" style="margin-left: 5px;">Erreur ST</label></div>' +
            '<select id="choix" class="swal2-select">' +
            '<option value="periodique">Periodique</option>' +
            '<option value="occasion">Occasion</option>' +
            '<option value="revisite">Revisite</option>' +
            '</select>',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Ajouter',
        preConfirm: () => {
            const plaque = document.getElementById('plaque').value;
            const choix = document.getElementById('choix').value;
            const accordTypeElement = document.querySelector('input[name="accordType"]:checked');
            const accordType = accordTypeElement ? accordTypeElement.value : null;
            if (!plaque || !choix || !accordType) {
                Swal.showValidationMessage('Veuillez remplir tous les champs.');
                return false;
            }
            return { plaque, choix, accordType };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const { plaque, choix, accordType } = result.value;
            // Simulation de l'ajout de rendez-vous
            setTimeout(() => {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Rendez-vous ajouté avec succès!',
                    showConfirmButton: false,
                    timer: 1500,
                    didClose: () => {
                        // Ajoutez ici la logique pour traiter les valeurs entrées après l'animation
                        console.log('Plaque:', plaque);
                        console.log('Choix:', choix);
                        console.log('Accord Type:', accordType);
                    }
                });
            }, 500); // Délai avant l'affichage de l'animation
        }
    });
};




  const renderStateButton = (state) => (
    <button
      key={state.value}
      className={`btn ${selectedState === state.value ? 'btn-info' : 'btn-secondary'}`}
      onClick={() => handleStateChange(state.value)}
      style={{ marginRight: '10px' }} // Ajout de l'espace entre les boutons
    >
      {state.label}
    </button>
  );

  const stateButtons = stateOptions.map(renderStateButton);

  const globalFilterElement = (
    <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ marginLeft: '25px', display: 'flex' }}>{stateButtons}</div>
      <input type="text" placeholder="Global Search" value={globalFilter} onChange={handleGlobalFilterChange} />
    </div>
  );

  const actionButtons = (rowData) => (
    <div>
      <button className="btn btn-success" onClick={() => handleAccept(rowData)}>
        Valider
      </button>
      <span style={{ margin: '0 10px' }}></span> {/* Ajout de l'espace entre les boutons */}
      <button className="btn btn-danger" onClick={() => handleReject(rowData)}>
        Refuser
      </button>
    </div>
  );

  const handleAccept = (rowData) => {
    Swal.fire({
      title: 'Accepter la réservation',
      text: 'Veuillez sélectionner une Ligne:',
      input: 'radio',
      inputOptions: {
        'Ligne 1': 'L1',
        'Ligne 2': 'L2',
        'Ligne 3': 'L3'
      },
      inputValidator: (value) => {
        if (!value) {
          return 'Vous devez choisir une Ligne!';
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const ligne = result.value;
        Swal.fire({
          position: "center",
          icon: "success",
          title: `${ligne}`,
          showConfirmButton: false,
          timer: 1000
        });
        
      }
    });
    console.log('Accept:', rowData);
  };

  const handleReject =async (rowData) => {
    
    Swal.fire({
      title: 'Accepter la réservation',
      text: 'Veuillez sélectionner une Ligne:',
      input: 'radio',
      inputOptions: {
        'Trop tot': 'Trop tot',
        'Trop tard': 'Trop tard',
        'Mauvais véhicule': 'Mauvais véhicule',
        'Comportement': 'Comportement',
        'Autre': 'Autre'
      },
      inputValidator: (value) => {
        if (!value) {
          return 'Vous devez choisir une Raison!';
        }
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        const Refus = result.value;
        try {
          // Appel de l'API pour refuser le rendez-vous avec l'id et la raison
          const response = await httpClient.post(`/api/bookings/refuser/${rowData.id}`, {Refus} );
          console.log('Réponse de l\'API:', response.data);
          Swal.fire({
            position: "center",
            icon: "success",
            title: response.data,
            showConfirmButton: false,
            timer: 1000
          });

          // Mettre à jour l'état du rendez-vous refusé dans le tableau de données
          const updatedData = data.map(item => {
            if (item.id === rowData.id) {
              return { ...item, etat: 'REFUSE' };
            }
            return item;
          });
          setData(updatedData);
        } catch (error) {
          console.error('Erreur lors de l\'appel de l\'API:', error);
          // Afficher un message d'erreur ou effectuer d'autres actions en cas d'erreur
          Swal.fire('Erreur', 'Une erreur s\'est produite lors du refus du rendez-vous.', 'error');
        }
        
      }
    });
   
    
    console.log('Reject:', rowData);

  };

  const formattedLastUpdate = () => {
    const now = new Date();
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return now.toLocaleDateString('fr-FR', options);
  };

  return (
    <div>
      {!selectedST && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <h3>Choisissez une option :</h3>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
            <button className="btn btn-primary" style={{ marginRight: '10px', width: '150px', fontSize: '1.2em' }} onClick={() => handleSTSelect('ST10')}>
              ST10
            </button>
            <button className="btn btn-primary" style={{ width: '150px', fontSize: '1.2em' }} onClick={() => handleSTSelect('ST11')}>
              ST11
            </button>
          </div>
        </div>
      )}
      {selectedST && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginLeft: '75px' }}>
            <img src={monImage} style={{ maxWidth: '100%', height: 'auto', width: '250px' }} />
            <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <p style={{ whiteSpace: 'nowrap', marginTop: '10px', marginLeft: 'auto', marginRight: 'auto' }}>Dernière Maj : {formattedLastUpdate()}</p>
              </div>
              <button
                className="fa fa-fw fa-plus"
                style={{
                  fontSize: '2em',
                  backgroundColor: '#007BFF',
                  color: 'white',
                  padding: '4px',
                  borderRadius: '20px',
                  border: 'none',
                  marginLeft: '10px',
                }}
                onClick={handleAddClick}
              />
              <div style={{ marginLeft: '20px' }}></div>
              <button
                className="fa fa-fw fa-retweet"
                style={{
                  fontSize: '2em',
                  backgroundColor: '#007BFF',
                  color: 'white',
                  padding: '4px',
                  borderRadius: '20px',
                  border: 'none',
                  marginLeft: '10px',
                }}
                onClick={handleRefreshClick}
              />
              <div style={{ marginLeft: '20px' }}></div>
            </div>
          </div>
          <div className="container-fluid mt-4 main-container">
            <div className="custom-table-container">
              <DataTable
                value={data.filter(row => {
                  if (selectedState === 'Refusé') {
                    return row.etat === 'REFUSE';
                  }else if(selectedState === 'Validé'){
                    return row.etat === 'ACCEPTE';
                  }else {
                    return row.etat === selectedState.toUpperCase();
                  }
                })}
                stripedRows
                className="p-datatable-striped"
                scrollable
                scrollHeight="calc(80vh - 120px)"
                globalFilter={globalFilter}
                header={globalFilterElement}
                emptyMessage="Aucun rendez-vous trouvé."
              >
                <Column field="heure" header="Heure" style={{ width: '5%' }} />
                <Column field="id" header="RDV" style={{ width: '7%' }} />
                <Column field="plaque" header="Plaque" style={{ width: '8%' }} />
                <Column field="chassis" header="Chassis" style={{ width: '14%' }} />
                <Column field="source" header="Source" style={{ width: '6%' }} />
                <Column field="client" header="Client" style={{ width: '15%' }} />
                <Column field="typeDeVisite" header="Type de Visite" style={{ width: '10%' }} />
                <Column field="Ligne" header="Ligne" style={{ width: '2%' }} />
                <Column field="vehicule" header="Véhicule" style={{ width: '15%' }} />
                <Column body={actionButtons} header="Actions" style={{ width: '23%' }} />
              </DataTable>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RendezVousDataTable;
