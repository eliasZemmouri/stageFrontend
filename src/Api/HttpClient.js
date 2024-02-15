// Api/HttpClient.js
import axios from 'axios';

const httpClient = axios.create();

// Ajouter un intercepteur pour ajouter le token d'authentification à chaque requête
httpClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { httpClient };
