// components/LineChart.js
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const LineChartComponent = () => {
  const lineChartData = [
    { name: '8-10h', petit: 15, moyen: 20, grand: 20 },
    { name: '10-12h', petit: 10, moyen: 25, grand: 40 },
    { name: '13-15h', petit: 20, moyen: 10, grand: 50 },
    { name: '15-17h', petit: 30, moyen: 30, grand: 10 },
  ];
  

  return (
    <ResponsiveContainer height={200}>
      
      <LineChart data={lineChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="petit" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="moyen" stroke="#82ca9d" />
        <Line type="monotone" dataKey="grand" stroke="#f5abe5" />
      </LineChart>
    </ResponsiveContainer>
  );
};  

export default LineChartComponent;
