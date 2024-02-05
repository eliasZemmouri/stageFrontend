import React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'nom', headerName: 'Nom du Rendez-vous', width: 200 },
  {
    field: 'statut',
    headerName: 'Statut',
    width: 150,
    renderCell: (params) => (
      <Select
        value={params.value}
        onChange={(e) => {
          // Logique pour gérer le changement de statut
          console.log(`Nouveau statut : ${e.target.value}`);
        }}
      >
        <MenuItem value="En attente">En attente</MenuItem>
        <MenuItem value="Validé">Validé</MenuItem>
        <MenuItem value="Annulé">Annulé</MenuItem>
      </Select>
    ),
  },
];

const rows = [
  { id: 1, nom: 'Rendez-vous 1', statut: 'En attente' },
  { id: 2, nom: 'Rendez-vous 2', statut: 'En attente' },
  // ... autres rendez-vous
];

export default function RendezVousDataTable() {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        components={{
          Toolbar: GridToolbar,
        }}
      />
    </div>
  );
}
