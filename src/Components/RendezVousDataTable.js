import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const RendezVousDataTable = () => {
  const data = [
    { id: 1, heure: '08:00', referencement: 'ABC123', plaque: 'XYZ987', typeVoiture: 'Sedan', nom: 'Doe', prenom: 'John' },
    { id: 2, heure: '09:00', referencement: 'ABC124', plaque: 'XYZ988', typeVoiture: 'SUV', nom: 'Smith', prenom: 'Jane' },
    { id: 3, heure: '10:00', referencement: 'ABC125', plaque: 'XYZ989', typeVoiture: 'Sedan', nom: 'Johnson', prenom: 'Bob' },
    { id: 4, heure: '11:00', referencement: 'ABC126', plaque: 'XYZ990', typeVoiture: 'SUV', nom: 'Williams', prenom: 'Alice' },
    { id: 5, heure: '12:00', referencement: 'ABC127', plaque: 'XYZ991', typeVoiture: 'Sedan', nom: 'Brown', prenom: 'Chris' },
    { id: 6, heure: '13:00', referencement: 'ABC128', plaque: 'XYZ992', typeVoiture: 'SUV', nom: 'Miller', prenom: 'Emily' },
    { id: 7, heure: '14:00', referencement: 'ABC129', plaque: 'XYZ993', typeVoiture: 'Sedan', nom: 'Davis', prenom: 'Daniel' },
    { id: 8, heure: '15:00', referencement: 'ABC130', plaque: 'XYZ994', typeVoiture: 'SUV', nom: 'Martinez', prenom: 'Sophia' },
    { id: 9, heure: '16:00', referencement: 'ABC131', plaque: 'XYZ995', typeVoiture: 'Sedan', nom: 'Taylor', prenom: 'Michael' },
    { id: 10, heure: '17:00', referencement: 'ABC132', plaque: 'XYZ996', typeVoiture: 'SUV', nom: 'Anderson', prenom: 'Olivia' },
    { id: 11, heure: '18:00', referencement: 'ABC133', plaque: 'XYZ997', typeVoiture: 'Sedan', nom: 'Thomas', prenom: 'William' },
    { id: 12, heure: '19:00', referencement: 'ABC134', plaque: 'XYZ998', typeVoiture: 'SUV', nom: 'Garcia', prenom: 'Emma' },
    { id: 13, heure: '20:00', referencement: 'ABC135', plaque: 'XYZ999', typeVoiture: 'Sedan', nom: 'Rodriguez', prenom: 'Liam' },
    { id: 14, heure: '21:00', referencement: 'ABC136', plaque: 'XYZ1000', typeVoiture: 'SUV', nom: 'Moore', prenom: 'Ava' },
    { id: 15, heure: '22:00', referencement: 'ABC137', plaque: 'XYZ1001', typeVoiture: 'Sedan', nom: 'Jackson', prenom: 'Mia' },
    
  ];

  const actionButtons = (rowData) => (
    <div>
      <button className="btn btn-success" onClick={() => handleAccept(rowData)}>Valider</button>
      <button className="btn btn-danger" onClick={() => handleReject(rowData)}>Refuser</button>
    </div>
  );

  const handleAccept = (rowData) => {
    // Implement the logic for accepting
    console.log('Accept:', rowData);
  };

  const handleReject = (rowData) => {
    // Implement the logic for rejecting
    console.log('Reject:', rowData);
  };

  return (
    <div className="container mt-4">
      <DataTable value={data} className="p-datatable-striped" scrollable scrollHeight="900px" style={{ minWidth: '50rem' }}>
        <Column field="heure" header="Heure" style={{ width: '120px' }} />
        <Column field="referencement" header="Référencement" style={{ width: '160px' }} />
        <Column field="plaque" header="Plaque" style={{ width: '120px' }} />
        <Column field="typeVoiture" header="Type de Voiture" style={{ width: '180px' }} />
        <Column field="nom" header="Nom" style={{ width: '120px' }} />
        <Column field="prenom" header="Prénom" style={{ width: '120px' }} />
        <Column body={actionButtons} header="Actions" style={{ width: '150px' }} />
      </DataTable>
    </div>
  );
};

export default RendezVousDataTable;
