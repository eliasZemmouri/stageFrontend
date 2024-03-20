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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await httpClient.get('/api/bookings/details/TODAY/ST10');
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
  }, []);

  const handleStateChange = (state) => {
    setSelectedState(state);
  };

  const stateOptions = [
    { label: 'Avenir', value: 'Avenir' },
    { label: 'Tot', value: 'Tot' },
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
        'Agressif': 'Agressif',
        'Retard': 'Retard',
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
            onClick={handleRefreshClick}
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
              } else {
                return row.etat === selectedState.toUpperCase();
              }
            })}
            stripedRows
            className="p-datatable-striped"
            scrollable
            scrollHeight="calc(100vh - 120px)"
            globalFilter={globalFilter}
            header={globalFilterElement}
            emptyMessage="Aucun rendez-vous trouvé."
          >
            <Column field="heure" header="Heure" style={{ width: '5%' }} />
            <Column field="id" header="Reservation" style={{ width: '10%' }} />
            <Column field="plaque" header="Plaque" style={{ width: '8%' }} />
            <Column field="chassis" header="Chassis" style={{ width: '14%' }} />
            <Column field="source" header="Source" style={{ width: '6%' }} />
            <Column field="client" header="Client" style={{ width: '15%' }} />
            <Column field="typeDeVisite" header="Type de Visite" style={{ width: '12%' }} />
            <Column field="vehicule" header="Véhicule" style={{ width: '15%' }} />
            <Column body={actionButtons} header="Actions" style={{ width: '23%' }} />
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default RendezVousDataTable;
