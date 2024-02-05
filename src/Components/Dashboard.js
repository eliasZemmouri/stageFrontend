import React from 'react';
import RendezVousList from './RendezVousList';
import ValidationForm from './ValidationForm';
import RendezVousDataTable from './RendezVousDataTable';  // Ajout de la nouvelle classe

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <RendezVousList />
      <ValidationForm />
      <RendezVousDataTable />  // Incluez la nouvelle classe ici
    </div>
  );
}

export default Dashboard;
