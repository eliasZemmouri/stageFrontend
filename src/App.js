import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { httpClient } from './Api/HttpClient';
import { initKeycloak, kc } from './Helpers/KeycloakHelper';
import MySideNav from './Components/MySideNav';
import Dashboard from './Pages/Dashboard';
import RendezVousDataTable from './Pages/RendezVousDataTable';
import SettingsPage from './Pages/ParametresPage';
import Dashboard2 from './Pages/Dashboard2';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initKeycloak.then((authenticated) => {
      if (!authenticated) {
        window.location.reload();
      } else {
        setIsAuthenticated(true);
        const isAdminUser = kc.hasRealmRole('admin');
        setIsAdmin(isAdminUser);
        localStorage.setItem('accessToken', kc.token);
        httpClient.defaults.headers.common['Authorization'] = `Bearer ${kc.token}`;

        kc.onTokenExpired = () => {
          kc.updateToken(5).then(refreshed => {
            if (refreshed) {
              console.log('Token was successfully refreshed');
              localStorage.setItem('accessToken', kc.token);
              httpClient.defaults.headers.common['Authorization'] = `Bearer ${kc.token}`;
            } else {
              console.log('Token could not be refreshed');
            }
          }).catch(err => console.error('Failed to refresh the token', err));
        };
      }
      setIsLoading(false);
    }).catch(() => {
      console.error('Authentication Failed');
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (isLoading) return; // Ne rien faire tant que le chargement n'est pas terminé
    // Maintenant que le chargement est terminé, nous pouvons exécuter fetchProtectedData
    fetchProtectedData();
  }, [isLoading]); // Déclenche cette fonction chaque fois que l'état isLoading change

  const fetchProtectedData = () => {
    if (isAuthenticated) {
      // Exemple de fonction pour récupérer des données protégées
      console.log("Fetching data now...");
      // Ajoutez ici votre logique de récupération de données
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Loading...
      </div>
    );
  }

  return (
    <div>
      <Router>
        <MySideNav isAdmin={isAdmin} />
        <Routes>
          <Route path="/" element={<RendezVousDataTable />} />
          <Route path="/dashboard" element={isAdmin ? <Dashboard /> : <Navigate to="/" />} />
          <Route path="/parametres" element={isAdmin ? <SettingsPage /> : <Navigate to="/" />} />
          <Route path="/dashboard2" element={isAdmin ? <Dashboard2 /> : <Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
