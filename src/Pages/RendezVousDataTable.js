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
import { kc } from '../Helpers/KeycloakHelper';
import './RendezVousDataTable.css';

const RendezVousDataTable = () => {
  const [data, setData] = useState([]);
  const [selectedState, setSelectedState] = useState('A venir');
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedST, setSelectedST] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [droitAction, setDroitAction] = useState(true);
  const [timeout,  setTimeoutId] = useState(true);
  const [dateRange, setDateRange] = useState(JSON.parse(localStorage.getItem('dateRange')) || { startDate: new Date(), endDate: new Date() });


  const formattedLastUpdate = () => {
    const now = new Date();
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return now.toLocaleDateString('fr-FR', options);
  };

  const [lastUpdate, setLastUpdate] = useState(formattedLastUpdate());

  useEffect(() => {
    
    const l=()=>{
      setDroitAction(true);
    }
    l();
    console.log("loading : "+loading);
    const fetchData = async () => {
      //setDroitAction(true);
      
      console.log(loading);
      console.log("ici")
      try {
        if (!selectedST) return;
        //const apiUrl = '/api/bookings/details';
        /*const response = {"data" : [{
          "bookingDetails": {
              "id": 280651,
              "heure": "09:30",
              "plaque": "1NVN540",
              "typeDeVisite": "Périodique voiture",
              "source": "PORTAL",
              "isid": "10A-240422-0109",
              "whenCreated": "2024-04-22T10:05:36.674",
              "whenUpdated": "2024-04-22T10:20:50.096",
              "status": "FINISHED",
              "chassis": "VF73DBHXMGJ607279",
              "vehicule": "C4 PICASSO",
              "client": "Claude Fayet"
          },
          "rendezVousEtat": {
              "id": "950ee222-391b-435a-8ff1-243537a40de4",
              "idRendezVous": 280651,
              "etat": "A VENIR",
              "tempsModification": "2024-04-22T11:05:57.279",
              "raisonRefus": null,
              "ligne": null
          }
      },
      {
          "bookingDetails": {
              "id": 279818,
              "heure": "09:45",
              "plaque": "1WPA442",
              "typeDeVisite": "Occasion voiture",
              "source": "PORTAL",
              "isid": "10A-240422-0104",
              "whenCreated": "2024-04-22T09:58:33.674",
              "whenUpdated": "2024-04-22T10:22:51.404",
              "status": "FINISHED",
              "chassis": "WVGZZZA1ZKV500998",
              "vehicule": "T-ROC",
              "client": "Domenichi Naro"
          },
          "rendezVousEtat": {
              "id": "3c8bea14-deee-47f6-99af-775c5a3b6a53",
              "idRendezVous": 279818,
              "etat": "RETARD",
              "tempsModification": "2024-04-22T11:05:57.28",
              "raisonRefus": null,
              "ligne": null
          }
      },
      {
          "bookingDetails": {
              "id": 291707,
              "heure": "09:45",
              "plaque": "2DLD052",
              "typeDeVisite": "Périodique camionette",
              "source": "PORTAL",
              "isid": "10A-240422-0110",
              "whenCreated": "2024-04-22T10:05:39.019",
              "whenUpdated": "2024-04-22T10:37:50.199",
              "status": "FINISHED",
              "chassis": "VR3EFYHT2PJ578277",
              "vehicule": "Partner",
              "client": "Alves Armindo"
          },
          "rendezVousEtat": {
              "id": "34936ad7-5170-4a32-af0f-4f4dd60dd239",
              "idRendezVous": 291707,
              "etat": "SANSRENDEZVOUS",
              "tempsModification": "2024-04-22T11:05:57.281",
              "raisonRefus": null,
              "ligne": null
          }
      },]};*/
      /*
      console.log(loading);
      const debut = new Date(dateRange.startDate); // Utilise la date sélectionnée par l'utilisateur
        debut.setHours(5); // Définit l'heure choisie
        debut.setMinutes(45); // Définit les minutes choisies
        debut.setSeconds(0); // Définit les secondes à zéro
        debut.setMilliseconds(0); // Définit les millisecondes à zéro

        // Fin de la plage horaire
        const fin = new Date(dateRange.endDate); // Utilise la date sélectionnée par l'utilisateur
        fin.setHours(19); // Définit l'heure choisie
        fin.setMinutes(19); // Définit les minutes choisies
        fin.setSeconds(0); // Définit les secondes à zéro
        fin.setMilliseconds(0); // Définit les millisecondes à zéro

        // Convertit les dates au format ISO 8601 pour les inclure dans l'URL
        const debutISO = debut.toISOString();
        const finISO = fin.toISOString();
        const apiUrl = `/api/bookings/details/${selectedST}/${debutISO}/${finISO}`;
        */
        
        const apiUrl = `/api/bookings/details/${selectedST}`;
        const response = await httpClient.get(apiUrl);
        console.log(response.data);
        const bookingDetailsArray = await response.data.map((item) => {
          const { bookingDetails, rendezVousEtat } = item;
          const jsonString = rendezVousEtat.raisonRefus;
          const jsonStringA = rendezVousEtat.ligne;
          
          let deuxiemeValeur;
          let deuxiemeValeurA;
          try {
              // Convertir la chaîne JSON en objet JavaScript
              const jsonObject = JSON.parse(jsonString);
              // Extraire la deuxième valeur
              
              deuxiemeValeur = Object.values(jsonObject)[0];

            } catch (error) {
              //console.error(error);
          }
          try {
            // Convertir la chaîne JSON en objet JavaScript
           
            const jsonObjectA = JSON.parse(jsonStringA);
            // Extraire la deuxième valeur
            
            deuxiemeValeurA = Object.values(jsonObjectA)[0];

          } catch (error) {
            //console.error(error);
        }
          return {
            ...bookingDetails,
            etat: rendezVousEtat.etat, // Ajoutez la propriété etat
            raisonRefus: bookingDetails.raison || deuxiemeValeur ,
            ligne: deuxiemeValeurA || rendezVousEtat.ligne,
          };
          
        });
        setData(bookingDetailsArray);
      } catch (error) {
        
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
    const e=()=>{
      setLoading(false);
    }
    //e();
    console.log(loading);
    // Ajouter une alerte si le chargement prend trop de temps (par exemple, moins d'une minute)
    setTimeout(() => {
      console.log("Décompte terminé !");
      // modifier les droits aux actions s'il reste que 1 minute
      const l=()=>{
        setDroitAction(false);
      }
      l();
    }, (14 * 60 * 1000)); // Déclencher l'alerte lorsque la 14ème minute est atteinte
    setTimeout(() => {
      console.log("Décompte2 terminé !");
      // modifier les droits aux actions s'il reste que 1 minute
      const l=()=>{
        setDroitAction(true);
      //setLoading(true);
      setTimeoutId(!timeout);
      }
      l();
    }, (15 * 60 * 1000)); // Déclencher l'alerte lorsque la 14ème minute est atteinte
  
   
  }, [selectedST,reload,timeout]);

  

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
    { label: 'Sans Rendez-Vous', value: 'SansRendezVous' }, // Ajout de l'état pour les sans rendez-vous

  ];

  const handleGlobalFilterChange = (e) => {
    setGlobalFilter(e.target.value);
  };

  const handleRefreshClick = () => {
    setReload(!reload);
    setLastUpdate(formattedLastUpdate());
    //setLoading(true);

  };
  //alerte affiché si le refresh est a faire
  const alertReload = ()=> {
    Swal.fire("Veuillez d'abord  actualiser la page");
  }

  const [typeDeVisiteOptions, setTypeDeVisiteOptions] = useState([]); // État pour stocker les options de type de visite
  const [modalOpened, setModalOpened] = useState(false);

  // Fonction pour récupérer les options de type de visite depuis le backend
  const fetchTypeDeVisiteOptions = async () => {
    try {
      const response = await httpClient.get('/api/bookings/allTypeOfVisite');
      setTypeDeVisiteOptions(response.data);
      //console.log("Options de type de visite récupérées avec succès:", response.data);
      setModalOpened(true); // Ouvrir la fenêtre modale Swal une fois que les données sont récupérées
    } catch (error) {
      console.error('Erreur lors de la récupération des options de type de visite:', error);
    }
  };

  useEffect(() => {
    fetchTypeDeVisiteOptions(); // Appel de la fonction pour récupérer les options de type de visite lors du montage du composant
  }, []);

  const handleAddClick = () => {
    if(!droitAction){
      alertReload();
      return;
    }

    let lignesHTML = '';

    // Déterminez le nombre de lignes en fonction de selectedST
    const nombreDeLignes = selectedST === 'ST10' ? 8 : 5;

    // Générez les options pour les lignes
    for (let i = 1; i <= nombreDeLignes; i++) {
        lignesHTML += `<input type="radio" id="ligne${i}" name="ligne" value="${i}" style="transform: scale(1.5); margin-left: 20px;"><label for="ligne${i}" style="margin-left: 5px;">L${i}</label>`;
    }

    Swal.fire({
        title: 'Accepter un rendez-vous sans rendez-vous',
        width: 600,
        html:
            '<input id="plaque" class="swal2-input" style="margin-bottom: 10px;" placeholder="Plaque">' +
            '<div style="margin-bottom: 20px;"><input type="radio" id="accordChef" name="accordType" value="accordChef" style="transform: scale(1.5);"><label for="accordChef" style="margin-left: 5px;">Accord Chef</label><input type="radio" id="erreurST" name="accordType" value="erreurST" style="transform: scale(1.5); margin-left: 20px;"><label for="erreurST" style="margin-left: 5px;">Mauvaise Station</label></div>' +
            '<select id="choix" class="swal2-select" style="margin-bottom: 10px;">' +
            '<option value="periodique">Periodique</option>' +
            '<option value="occasion">Occasion</option>' +
            '<option value="revisite">Revisite</option>' +
            '</select>' +
            `<div style="margin-bottom: 10px;">${lignesHTML}</div>`,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Ajouter',
        preConfirm: () => {
            const plaque = document.getElementById('plaque').value;
            const choix = document.getElementById('choix').value;
            const accordTypeElement = document.querySelector('input[name="accordType"]:checked');
            const accordType = accordTypeElement ? accordTypeElement.value : null;
            const ligneElement = document.querySelector('input[name="ligne"]:checked');
            const ligne = ligneElement ? ligneElement.value : null;
            if (!plaque || !choix || !accordType || !ligne) {
                Swal.showValidationMessage('Veuillez remplir tous les champs.');
                return false;
            }
            return { plaque, choix, accordType, ligne };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const { plaque, choix, accordType, ligne } = result.value;
            console.log(kc.idTokenParsed.preferred_username);
            httpClient.post('/api/sansRendezVous/create', {
                plaque: plaque,
                typeDeVisite: choix,
                who: kc.idTokenParsed.preferred_username,
                raison: accordType,
                ligne: ligne
            }).then(response => {
                console.log('Rendez-vous ajouté:', response.data);
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Rendez-vous ajouté avec succès!',
                    showConfirmButton: false,
                    timer: 1500
                });
                const updatedData = [
                    ...data,
                    {
                        ...response.data,
                        etat: "SANSRENDEZVOUS",
                        ligne: ligne,
                        raisonRefus: response.data.raison
                    }
                ];
                console.log("updatetData : ",updatedData );
                setData(updatedData);
            }).catch(error => {
                console.error('Erreur lors de l\'ajout du rendez-vous:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Erreur',
                    text: 'Une erreur est survenue lors de l\'ajout du rendez-vous.'
                });
            });
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
      <input type="text" placeholder="Recherche globale" value={globalFilter} onChange={handleGlobalFilterChange} />
    </div>
  );



  const handleModify = (rowData) => {
    if (!droitAction) {
        alertReload();
        return;
    }
    if (!modalOpened) {
        // Attendre que les options de type de visite soient disponibles avant d'ouvrir la fenêtre modale Swal
        Swal.fire("Les options de type de visite ne sont pas encore disponibles. Réessayez...");
        return;
    }

    let lignesHTML = '';

    // Déterminez le nombre de lignes en fonction de selectedST
    const nombreDeLignes = selectedST === 'ST10' ? 8 : 5;

    // Générez les options pour les lignes
    for (let i = 1; i <= nombreDeLignes; i++) {
        lignesHTML += `<input type="radio" id="newLigne${i}" name="newLigne" value="${i}" style="transform: scale(1.5);" ${rowData.ligne === i.toString() ? 'checked' : ''}><label for="newLigne${i}" style="margin-left: 5px;">L${i}</label>`;
    }

    Swal.fire({
        title: 'Modifier le Sans Rendez-Vous',
        html:
            `<input id="newPlaque" class="swal2-input" style="margin-bottom: 10px;" placeholder="Nouvelle Plaque" value="${rowData.plaque}">` +
            `<select id="newType" class="swal2-select" style="margin-bottom: 10px;">
            ${typeDeVisiteOptions.map(option => `<option value="${option}" ${rowData.typeDeVisite === option ? 'selected' : ''}>${option}</option>`).join('')}
          </select>` +
            `<div style="margin-bottom: 20px;"><input type="radio" id="newAccordChef" name="newAccordType" value="accordChef" style="transform: scale(1.5);" ${rowData.raisonRefus === 'accordChef' ? 'checked' : ''}><label for="newAccordChef" style="margin-left: 5px;">Accord Chef</label><input type="radio" id="newErreurST" name="newAccordType" value="erreurST" style="transform: scale(1.5); margin-left: 20px;" ${rowData.raisonRefus === 'erreurST' ? 'checked' : ''}><label for="newErreurST" style="margin-left: 5px;">Mauvaise Station</label></div>` +
            `<div style="margin-bottom: 10px;">${lignesHTML}</div>`,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Valider',
        preConfirm: () => {
            const newPlaque = document.getElementById('newPlaque').value;
            const newType = document.getElementById('newType').value;
            const newAccordTypeElement = document.querySelector('input[name="newAccordType"]:checked');
            const newAccordType = newAccordTypeElement ? newAccordTypeElement.value : null;
            const newRaison = newAccordType;
            const newLigneElement = document.querySelector('input[name="newLigne"]:checked');
            const newLigne = newLigneElement ? newLigneElement.value : null;
            if (!newPlaque || !newType || !newRaison || !newLigne) {
                Swal.showValidationMessage('Veuillez remplir tous les champs.');
                return false;
            }
            return { newPlaque, newType, newRaison, newLigne };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const { newPlaque, newType, newRaison, newLigne } = result.value;
            // Make the API call to update the sans rendez-vous appointment
            httpClient.post(`/api/sansRendezVous/modification/${rowData.id}/${newPlaque}/${newType}/${newRaison}/${newLigne}`)
                .then(() => {
                    // Update the UI if the API call was successful
                    const updatedData = data.map(item => {
                        if (item.id === rowData.id) {
                            return { ...item, plaque: newPlaque, typeDeVisite: newType, raisonRefus: newRaison, ligne: newLigne };
                        }
                        return item;
                    });
                    setData(updatedData);
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Rendez-vous modifié avec succès!',
                        showConfirmButton: false,
                        timer: 1500
                    });
                })
                .catch(error => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Erreur',
                        text: error.message
                    });
                });
        }
    });
};


const actionButtons = (rowData) => {
  if (rowData.etat === 'ACCEPTE' || rowData.etat === 'REFUSE') {
    return (
      <button className="btn btn-primary" onClick={() => handleRecovery(rowData)}>
        Récupération
      </button>
    );
  } else if (rowData.etat === 'SANSRENDEZVOUS') {
    return (
      <button className="btn btn-warning" onClick={() => handleModify(rowData)}>
        Modifier
      </button>
    );
  } else {
    return (
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
  }
};

  

const handleAccept = (rowData) => {
  if (!droitAction) {
      alertReload();
      return;
  }

  let inputOptions = {};

  // Déterminez le nombre de lignes en fonction de selectedST
  const nombreDeLignes = selectedST === 'ST10' ? 8 : 5;

  // Générez les options pour les lignes
  for (let i = 1; i <= nombreDeLignes; i++) {
      inputOptions[i] = `L${i}`;
  }

  Swal.fire({
      title: 'Accepter la réservation',
      text: 'Veuillez sélectionner une Ligne:',
      input: 'radio',
      inputOptions: inputOptions,
      inputValidator: (value) => {
          if (!value) {
              return 'Vous devez choisir une Ligne!';
          }
      }
  }).then(async (result) => {
      if (result.isConfirmed) {
          try {
              const Ligne = result.value;
              const response = await httpClient.post(`/api/bookings/accepter/${rowData.id}`, { Ligne });

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
                      return { ...item, etat: 'ACCEPTE', ligne: Ligne };
                  }
                  return item;
              });
              setData(updatedData);
          } catch (error) {
              console.error('Erreur lors de l\'appel de l\'API:', error);
              // Afficher un message d'erreur ou effectuer d'autres actions en cas d'erreur
              Swal.fire('Erreur', "Une erreur s'est produite lors de l'acceptation du rendez-vous.", 'error');
          }
      }
  });
  console.log('Accept:', rowData);
};


  const handleReject =async (rowData) => {
    if(!droitAction){
      alertReload();
      return;
    }
    
    Swal.fire({
      title: 'Refuser la réservation',
      text: 'Veuillez sélectionner une Raison:',
      input: 'radio',
      inputOptions: {
        'Trop tot': 'Trop tot',
        'Trop tard': 'Trop tard',
        'Mauvais véhicule': 'Mauvais véhicule',
        'Mauvaise visite': 'Mauvaise visite',
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
              return { ...item, etat: 'REFUSE', raisonRefus: Refus };
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

  const handleRecovery = async (rowData) => {
    if(!droitAction){
      alertReload();
      return;
    }
    try {
      // Effectuez ici l'appel à l'API pour gérer la récupération du rendez-vous
      // Par exemple, vous pouvez appeler votre endpoint API avec l'ID du rendez-vous
      // pour indiquer que le rendez-vous doit être récupéré.
      // Récupérer les valeurs nécessaires depuis votre endpoint API
      

      let et="A VENIR";

      // Heure actuelle
      const heureActuelle = new Date();

      // Calculer l'heure actuelle moins param1Value minutes
      const heureActuelleMoins30 = new Date(heureActuelle.getTime() - 30 * 60 * 1000);

      // Calculer l'heure actuelle plus param2Value minutes
      const heureActuellePlus30 = new Date(heureActuelle.getTime() + 30 * 60 * 1000);
      
      //console.log("param 1 : "+param1Value);
      //console.log("param 2 : "+param2Value);
      

      // Extraire les heures et les minutes de rowData.heure
      const [rowDataHeureHeure, rowDataHeureMinute] = rowData.heure.split(':').map(Number);

      // Convertir rowData.heure en objet Date
      const rowDataDate = new Date();
      rowDataDate.setHours(rowDataHeureHeure);
      rowDataDate.setMinutes(rowDataHeureMinute);

      // Vérifier si rowData.heure est dans l'intervalle de 15 minutes autour de l'heure actuelle
      if (rowDataDate > heureActuelleMoins30 && rowDataDate < heureActuellePlus30) {
          et= "A VENIR";
      } else if (rowDataDate < heureActuelleMoins30) {
          et= "RETARD";
      } else if (rowDataDate > heureActuellePlus30) {
          et= "AVANCE"
      } else {
          et= "A VENIR";
      }
      const response = await httpClient.post(`/api/bookings/recuperer/${rowData.id}/${et}`);
      
      // Affichez un message de succès si l'appel à l'API réussit
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
          return { ...item, etat: et, raisonRefus:null, ligne:null };
        }
        return item;
      });
      setData(updatedData);
  
    } catch (error) {
      // Gérez les erreurs ici, affichez un message d'erreur ou effectuez d'autres actions nécessaires
      console.error('Erreur lors de la récupération du rendez-vous:', error);
      Swal.fire('Erreur', "Une erreur s'est produite lors de la récupération du rendez-vous.", 'error');
    }
  };
  
  //le max pour zommer la table
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth == 1080  && window.innerHeight == 695);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth == 1080 && window.innerHeight == 695);
    };
    //window.alert(window.innerWidth + " : "+window.innerHeight + " AND " +isSmallScreen);
    //1080 : 695
    
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
//console.log("taiille : "+window.innerWidth);

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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginLeft: '85px' }}>
            <img src={monImage} style={{ maxWidth: '100%', height: 'auto', width: '250px' }} />
            <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <p style={{ whiteSpace: 'nowrap', marginTop: '10px', marginLeft: 'auto', marginRight: 'auto' }}>Dernière Maj : {lastUpdate}</p>
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
          <div style={{ marginTop: '50px' }}>
          
            <div className="container-fluid mt-4 main-container" >
              <div className="custom-table-container">
                <DataTable 
                  value={data.filter(row => {
                    if (selectedState === 'Refusé') {
                      return row.etat === 'REFUSE';
                    }else if(selectedState === 'Validé'){
                      return row.etat === 'ACCEPTE';
                    }else if (selectedState === 'Sans Rendez-Vous') { // Filtre pour les rendez-vous sans rendez-vous
                      return row.etat === 'SANSRENDEZVOUS';
                    } else {
                      return row.etat === selectedState.toUpperCase();
                    }
                  })}
                  tableStyle = {{ zoom: isSmallScreen ? '0.6' : '1', width: '100%' }}
                  loading = {loading}
                  stripedRows
                  className="p-datatable-striped"
                  scrollable
                  scrollHeight="calc(80vh - 120px)"
                  globalFilter={globalFilter}
                  header={globalFilterElement}
                  emptyMessage="Aucun rendez-vous trouvé."
                  size='small'
                >
                  <Column field="heure" header="Heure" body={rowData => rowData.heure || '-'} />
                  <Column field="id" header="RDV"  body={rowData => rowData.id || '-'} />
                  <Column field="typeDeVisite" header="Type de Visite"  body={rowData => rowData.typeDeVisite || '-'} />
                  <Column field="plaque" header="Plaque"  body={rowData => rowData.plaque || '-'} />
                  <Column field="chassis" header="Chassis"  body={rowData => rowData.chassis || '-'} />
                  <Column field="vehicule" header="Véhicule"  body={rowData => rowData.vehicule || '-'} />
                  <Column field="client" header="Client"  body={rowData => rowData.client || '-'} />
                  <Column field="source" header="Source"  body={rowData => rowData.source || '-'} />
                  <Column field="ligne" header="Ligne"  body={rowData => rowData.ligne || '-'} />
                  <Column field="raisonRefus" header="Raison"  body={rowData => rowData.raisonRefus || '-'} />
                  <Column field="actions" header="Actions"  body={actionButtons} />
                </DataTable>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RendezVousDataTable;
