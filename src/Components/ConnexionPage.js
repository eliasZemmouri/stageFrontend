import React, { useEffect, useState } from 'react';
import { httpClient } from '../Api/HttpClient';

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await httpClient.get('http://localhost:9005/home');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // La dépendance vide signifie que cela ne devrait être exécuté qu'une seule fois lors du montage du composant

  return (
    <div>
      <h2>Dashboard</h2>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};

export default Dashboard;
