import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Sector, ResponsiveContainer as PieResponsiveContainer } from 'recharts';

const Dashboard = () => {
  // Exemple de données pour LineChart
  const lineChartData = [
    { name: 'Jan', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Feb', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Mar', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Apr', uv: 2780, pv: 3908, amt: 2000 },
    { name: 'May', uv: 1890, pv: 4800, amt: 2181 },
    { name: 'Jun', uv: 2390, pv: 3800, amt: 2500 },
    { name: 'Jul', uv: 3490, pv: 4300, amt: 2100 },
  ];

  // Exemple de données pour CustomActiveShapePieChart
  const pieChartData = [
    { name: 'Groupe A', value: 400 },
    { name: 'Groupe B', value: 300 },
    { name: 'Groupe C', value: 300 },
    { name: 'Groupe D', value: 200 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>Mon Dashboard</h1>

      {/* LineChart */}
      <ResponsiveContainer width="80%" height={150}>
        <LineChart data={lineChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>

      {/* Ajout d'espace entre les deux graphiques */}
      <div style={{ height: '20px' }}></div>

      {/* CustomActiveShapePieChart */}
      <PieResponsiveContainer width="80%" height={150}>
        <PieChart>
          <Pie
            activeIndex={0}
            activeShape={(props) => renderActiveShape(props, pieChartData)}
            data={pieChartData}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={60}
            fill="#8884d8"
            dataKey="value"
          />
        </PieChart>
      </PieResponsiveContainer>
    </div>
  );
};

const renderActiveShape = (props, data) => {
  // ... (code de la fonction renderActiveShape)
};

export default Dashboard;
