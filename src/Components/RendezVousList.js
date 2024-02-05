import React from 'react';

function RendezVousList() {
  // Logique pour récupérer et afficher la liste des rendez-vous
  const rendezVousList = ["1RGT394","2FGT234"]; // Remplacez par votre logique de récupération de la liste

  return (
    <div>
      <h2>Liste des Rendez-vous</h2>
      <ul>
        {rendezVousList.map(rendezVous => (
          <li key={rendezVous.id}>{rendezVous.nom} - {rendezVous.date}</li>
        ))}
      </ul>
    </div>
  );
}

export default RendezVousList;
