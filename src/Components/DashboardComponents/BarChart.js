import React, { PureComponent } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Forest',
    uv: 4000,
    visites: 2400,
    amt: 2400,
  },
  {
    name: 'Anderlecht',
    uv: 3000,
    visites: 1398,
    amt: 2210,
  },
  {
    name: 'Bruxelles',
    uv: 2000,
    visites: 9800,
    amt: 2290,
  },
  {
    name: 'Saint-Gilles',
    uv: 2780,
    visites: 3908,
    amt: 2000,
  },
  {
    name: 'Molenbeek-Saint-Jean',
    uv: 1890,
    visites: 4800,
    amt: 2181,
  },
  {
    name: 'Koekelberg',
    uv: 2390,
    visites: 3800,
    amt: 2500,
  },{
    name: 'Berchem-Sainte-Agathe',
    uv: 3490,
    visites: 4300,
    amt: 2100,
  },{
    name: 'Ganshoren',
    uv: 3490,
    visites: 4300,
    amt: 2100,
  },{
    name: 'Jette',
    uv: 3490,
    visites: 4300,
    amt: 2100,
  },{
    name: 'Uccle',
    uv: 3490,
    visites: 4300,
    amt: 2100,
  },
  {
    name: 'Autre',
    uv: 3490,
    visites: 4300,
    amt: 2100,
  },
];

export default class Example extends PureComponent {

  render() {
    return (
      <ResponsiveContainer height={200} >
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          barSize={20}
        >
          <XAxis dataKey="name" scale="point" padding={{ left: 10, right: 10 }} />
          <YAxis />
          <Tooltip />
          <Legend />
          <CartesianGrid strokeDasharray="3 3" />
          <Bar dataKey="visites" fill="#8884d8" background={{ fill: '#eee' }} />
        </BarChart>
      </ResponsiveContainer>
    );
  }
}
