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

const RendezVousDataTable = () => {
  const [data, setData] = useState([]);
  const [selectedState, setSelectedState] = useState('A venir');
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedST, setSelectedST] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!selectedST) return;
        const apiUrl = '/api/bookings/details';
        const response = {"data" : [{
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
              "etat": "RETARD",
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
      },]};
      //const response = await httpClient.get(apiUrl + `/${selectedST}`);
        console.log(response.data);
        const bookingDetailsArray = response.data.map((item) => {
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
            raisonRefus: deuxiemeValeur || bookingDetails.raison,
            ligne: deuxiemeValeurA,
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
    { label: 'Sans Rendez-Vous', value: 'SansRendezVous' }, // Ajout de l'état pour les sans rendez-vous

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
        title: 'Accepter un rendez-vous sans rendez-vous',
        html:
            '<input id="plaque" class="swal2-input" style="margin-bottom: 30px;" placeholder="Plaque">' +
            '<div style="margin-bottom: 20px;"><input type="radio" id="accordChef" name="accordType" value="accordChef" style="transform: scale(1.5);"><label for="accordChef" style="margin-left: 5px;">Accord Chef</label><input type="radio" id="euemST" name="accordType" value="Mauvaise Station" style="transform: scale(1.5); margin-left: 20px;"><label for="erreurST" style="margin-left: 5px;">Mauvaise Station</label></div>' +
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
            // Effectuer la requête POST avec httpClient
            // Décodage du token JWT sans utiliser jwt_decode
            
              console.log(kc.idTokenParsed.preferred_username);
         
            httpClient.post('/api/sansRendezVous/create', {
                plaque: plaque,
                typeDeVisite: choix,
                who: kc.idTokenParsed.preferred_username, // Assumant que "who" 
                raison: accordType
            }
          )
            .then(response => {
                // Traitement de la réponse si nécessaire
                console.log('Rendez-vous ajouté:', response.data);
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Rendez-vous ajouté avec succès!',
                    showConfirmButton: false,
                    timer: 1500
                });
                // Mettre à jour l'état du rendez-vous refusé dans le tableau de données
                const updatedData = [
                  ...data,
                  {
                      ...response.data,
                      etat: "SANSRENDEZVOUS",
                      ligne: "",
                  }
              ];
              console.log("updatetData : ",updatedData );
              setData(updatedData);
            })
            .catch(error => {
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
      <input type="text" placeholder="Global Search" value={globalFilter} onChange={handleGlobalFilterChange} />
    </div>
  );



  const handleModify = (rowData) => {
    Swal.fire({
      title: 'Modifier le Sans Rendez-Vous',
      html:
        `<input id="newPlaque" class="swal2-input" style="margin-bottom: 10px;" placeholder="Nouvelle Plaque" value="${rowData.plaque}">` +
        `<select id="newType" class="swal2-select" style="margin-bottom: 10px;">
          <option value="periodique" ${rowData.typeDeVisite === 'Periodique' ? 'selected' : ''}>Periodique</option>
          <option value="occasion" ${rowData.typeDeVisite === 'Occasion' ? 'selected' : ''}>Occasion</option>
          <option value="revisite" ${rowData.typeDeVisite === 'Revisite' ? 'selected' : ''}>Revisite</option>
        </select>` +
        `<input id="newRaison" class="swal2-input" placeholder="Nouvelle Raison" value="${rowData.raison || ''}">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Valider',
      preConfirm: () => {
        const newPlaque = document.getElementById('newPlaque').value;
        const newType = document.getElementById('newType').value;
        const newRaison = document.getElementById('newRaison').value;
        if (!newPlaque || !newType || !newRaison) {
          Swal.showValidationMessage('Veuillez remplir tous les champs.');
          return false;
        }
        return { newPlaque, newType, newRaison };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const { newPlaque, newType, newRaison } = result.value;
        // Make the API call to update the sans rendez-vous appointment
        httpClient.post(`/api/sansRendezVous/modification/${rowData.id}/${newPlaque}/${newType}/${newRaison}`)
          .then(() => {
            // Update the UI if the API call was successful
            const updatedData = data.map(item => {
              if (item.id === rowData.id) {
                return { ...item, plaque: newPlaque, typeDeVisite: newType, raison: newRaison };
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
    }).then(async (result) => {
      
      if (result.isConfirmed) {
        try{
          const Ligne = result.value;
          const response = await httpClient.post(`/api/bookings/accepter/${rowData.id}`, {Ligne} );
          
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
        }
        catch (error) {
          console.error('Erreur lors de l\'appel de l\'API:', error);
          // Afficher un message d'erreur ou effectuer d'autres actions en cas d'erreur
          Swal.fire('Erreur', "Une erreur s'est produite lors de l'acceptation du rendez-vous.", 'error');
        }
        
        
      }
    });
    console.log('Accept:', rowData);
  };

  const handleReject =async (rowData) => {
    
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
    try {
      // Effectuez ici l'appel à l'API pour gérer la récupération du rendez-vous
      // Par exemple, vous pouvez appeler votre endpoint API avec l'ID du rendez-vous
      // pour indiquer que le rendez-vous doit être récupéré.
      let et="A VENIR";

      // Heure actuelle
      const heureActuelle = new Date();

      // Calculer l'heure actuelle moins 15 minutes
      const heureActuelleMoins30 = new Date(heureActuelle.getTime() - 30 * 60 * 1000); // 15 minutes en millisecondes

      // Calculer l'heure actuelle plus 15 minutes
      const heureActuellePlus30 = new Date(heureActuelle.getTime() + 30 * 60 * 1000); // 15 minutes en millisecondes

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
          return { ...item, etat: et };
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginLeft: '85px' }}>
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
                      return row.etat === 'SansRendezVous';
                    } else {
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
                  <Column field="id" header="RDV" style={{ width: '3%' }} />
                  <Column field="typeDeVisite" header="Type de Visite" style={{ width: '10%' }} />
                  <Column field="plaque" header="Plaque" style={{ width: '8%' }} />
                  <Column field="chassis" header="Chassis" style={{ width: '5%' }} />
                  <Column field="vehicule" header="Véhicule" style={{ width: '15%' }} />
                  <Column field="client" header="Client" style={{ width: '15%' }} />
                  <Column field="source" header="Source" style={{ width: '6%' }} />
                  <Column field="ligne" header="Ligne" style={{ width: '2%' }} />
                  <Column field="raisonRefus" header="Raison" style={{ width: '5%' }} />
                  <Column body={actionButtons} header="Actions" style={{ width: '23%' }} />
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
