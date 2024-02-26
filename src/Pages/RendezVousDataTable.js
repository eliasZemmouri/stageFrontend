import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { httpClient } from '../Api/HttpClient';

const RendezVousDataTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Effectué lors du montage du composant
    const fetchData = async () => {
      try {
        // Effectuez la requête GET
        const response = await httpClient.get('http://localhost:9005/api/bookings/details');
        
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
      <button className="btn btn-danger" onClick={() => handleReject(rowData)}>Refuser</button>
    </div>
  );

  const handleAccept = (rowData) => {
    // Implementer la logique d'acceptation
    console.log('Accept:', rowData);
  };

  const handleReject = (rowData) => {
    // Implementer la logique de rejet
    console.log('Reject:', rowData);
  };

  return (
    <div className="container-fluid mt-4 main-container">
      <div className="custom-table-container">
        <DataTable value={data} className="p-datatable-striped" scrollable scrollHeight="calc(100vh - 120px)">
          <Column field="heure" header="Heure" style={{ width: '5%' }} />
          <Column field="plaque" header="Plaque" style={{ width: '10%' }} />
          <Column field="chassis" header="Chassis" style={{ width: '20%' }} />
          <Column field="source" header="Source" style={{ width: '10%' }} />
          <Column field="client" header="Client" style={{ width: '15%' }} />
          <Column field="typeDeVisite" header="Type de Visite" style={{ width: '12%' }} />
          <Column field="vehicule" header="Véhicule" style={{ width: '15%' }} />
          <Column body={actionButtons} header="Actions" style={{ width: '23%' }} />
        </DataTable>
      </div>
    </div>
  );
};

export default RendezVousDataTable;
