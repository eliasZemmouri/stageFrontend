import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { httpClient } from '../Api/HttpClient';
import Swal from 'sweetalert2'
import monImage from '../images/s-a.png'


const RendezVousDataTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Effectué lors du montage du composant
    const fetchData = async () => {
      try {
        // Effectuez la requête GET
        const response = await httpClient.get('http://192.168.110.106:9005/api/bookings/details');


        const bookingDetailsArray = response.data.map(item => item.bookingDetails);

        setData(bookingDetailsArray);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    // Appelez la fonction pour récupérer les données
    fetchData();
  }, []); // Le tableau vide en second argument signifie que cet effet ne s'exécute qu'une seule fois lors du montage

  const actionButtons = (rowData) => (
    <div>
      <button className="btn btn-success" onClick={() => handleAccept(rowData)}>Valider</button>
      <span style={{ margin: '10px' }}></span>
      <button className="btn btn-danger" onClick={() => handleReject(rowData)}>Refuser</button>
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
          html: `Vous avez sélectionné la Ligne: ${ligne}`
        });
      }
    });
    console.log('Accept:', rowData);
  };

  const handleReject =async (rowData) => {
    
    const { value: raison } = await Swal.fire({
      title: "Selectionne la raison",
      input: "select",
      inputOptions: {
        Danger: {
          agressif: "Agressif",
          perturbateur: "Perturbateur"
        },
        autre: "Autre Raison"
      },
      inputPlaceholder: "Selectionne la raison",
      showCancelButton: true,
      inputValidator: (value) => {
        return new Promise((resolve) => {
          if (!value) {
            resolve('Vous devez choisir une raison!');
          } else {
            resolve();
          }
          
        });
      }
    });
    if (raison) {
      try {
        // Appel de l'API pour refuser le rendez-vous avec l'id et la raison
        const response = await httpClient.post(`/api/bookings/refuser/${rowData.id}`, { raison });
        console.log('Réponse de l\'API:', response.data);

        // Afficher un message ou effectuer d'autres actions en fonction de la réponse de l'API
        Swal.fire('Succès', 'Rendez-vous refusé avec succès.', 'success');
      } catch (error) {
        console.error('Erreur lors de l\'appel de l\'API:', error);
        // Afficher un message d'erreur ou effectuer d'autres actions en cas d'erreur
        Swal.fire('Erreur', 'Une erreur s\'est produite lors du refus du rendez-vous.', 'error');
      }
    }
    console.log('Reject:', rowData);

  };
  const [isButtonClicked, setButtonClicked] = useState(false);

  const handleRefreshClick = () => {
    // Logique de rechargement ici
    setButtonClicked(true);

    // Ajouter une pause pour montrer l'effet de clic (peut être ajusté)
    setTimeout(() => {
      setButtonClicked(false);
    }, 200);
    window.location.reload();
  };
  

  return (
    <div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <img src={monImage} style={{ maxWidth: '100%', height: 'auto', width: '250px', marginLeft: '75px' }} />
        <div style={{ display: 'flex', alignItems: 'center' }}>
        <button
            className={`fa fa-fw fa-plus ${isButtonClicked ? 'clicked' : ''}`}
            style={{
              fontSize: '1.3em',
              backgroundColor: '#007BFF',
              color: 'white',
              padding: '4px',
              borderRadius: '4px',
              border: 'none',
              boxShadow: isButtonClicked ? '0 0 5px rgba(0, 0, 0, 0.3)' : 'none',
            }}
            onClick={handleRefreshClick}
          />
          <div style={{ marginLeft: '10px' }}></div> {/* Espace entre le bouton et la liste déroulante */}
          <button
            className={`fa fa-fw fa-retweet ${isButtonClicked ? 'clicked' : ''}`}
            style={{
              fontSize: '1.5em',
              backgroundColor: '#007BFF',
              color: 'white',
              padding: '2px',
              borderRadius: '4px',
              border: 'none',
              boxShadow: isButtonClicked ? '0 0 5px rgba(0, 0, 0, 0.3)' : 'none',
            }}
            onClick={handleRefreshClick}
          />
          <div style={{ marginLeft: '10px' }}></div> 
        </div>
      </div>

      <div className="container-fluid mt-4 main-container">
        <div className="custom-table-container">
          <DataTable value={data} stripedRows className="p-datatable-striped" scrollable scrollHeight="calc(100vh - 120px)">
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
