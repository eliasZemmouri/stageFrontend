// App.js
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
        // Vérifiez si l'utilisateur a le rôle d'administrateur
        const isAdminUser = kc.hasRealmRole('admin');
        setIsAdmin(isAdminUser);
        // Enregistrez le token dans le localStorage
        localStorage.setItem('accessToken', kc.token);
        /* http client will use this header in every request it sends */
        httpClient.defaults.headers.common['Authorization'] = `Bearer ${kc.token}`;
        kc.onTokenExpired = () => {
          console.log('token expired');
        };
      }
      setIsLoading(false); // Met à jour l'état pour indiquer que le chargement est terminé
    }, () => {
      /* Notify the user if necessary */
      console.error('Authentication Failed');
      setIsLoading(false); // Met à jour l'état pour indiquer que le chargement est terminé
    });
  }, []);

  if (isLoading) {
    // Afficher un message de chargement centré si isLoading est vrai
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
