// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ConnexionPage from './Components/ConnexionPage';
import Dashboard from './Components/Dashboard';
import RendezVousDataTable from './Components/RendezVousDataTable';
import { httpClient } from './Api/HttpClient';
import {initKeycloak,kc} from './Helpers/KeycloakHelper'



initKeycloak.then((auth) => {
  if (!auth) {
    window.location.reload();
  } else {
    /* Remove below logs if you are using this on production */
    console.info("Authenticated");
    console.log('auth', auth)
    console.log('Keycloak', kc)
    console.log('Access Token', kc.token)

    // Enregistrez le token dans le localStorage
    localStorage.setItem('accessToken', kc.token);

    /* http client will use this header in every request it sends */
    httpClient.defaults.headers.common['Authorization'] = `Bearer ${kc.token}`;

    kc.onTokenExpired = () => {
      console.log('token expired')
    }
  }
}, () => {
  /* Notify the user if necessary */
  console.error("Authentication Failed");
});
//kc.logout({ redirectUri: 'http://localhost:3000/' })
const App = () => {
  return (
    <div>
        <Router>
          <Routes>
            <Route path="/login" element={<ConnexionPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/" element={<RendezVousDataTable />} />
          </Routes>
        </Router>
    </div>
  );
};

export default App;
