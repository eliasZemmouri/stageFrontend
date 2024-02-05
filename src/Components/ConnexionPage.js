// src/ConnexionPage.js
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ConnexionPage.css';

const ConnexionPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    // Vérifier si le chargement est déjà en cours
    if (loading) {
      return;
    }

    setLoading(true);

    // Simuler une tâche asynchrone (remplacez cela par votre logique d'authentification réelle)
    setTimeout(() => {
      // Remettez le chargement à false après 2 secondes
      setLoading(false);

      // Ajoutez ici la logique d'authentification avec un backend si nécessaire
      console.log('Username:', username);
      console.log('Password:', password);
    }, 2000);
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100 connexion-container">
      <div className="card col-md-6">
        <div className="card-body">
          <h1 className="card-title text-center">Connexion</h1>
          <form>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Nom d'utilisateur :
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Mot de passe :
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleLogin}
            >
              {loading ? 'Connexion en cours...' : 'Connexion'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConnexionPage;
