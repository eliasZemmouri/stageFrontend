import React, { PureComponent } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
    {
        name: 'Forest',
        ACT: 4000,
        SA: 2400,
        F2: 2400,
        W2: 2400,
      },
      {
        name: 'Anderlecht',
        ACT: 3000,
        SA: 1398,
        F2: 2210,
        W2: 1600,
      },
      {
        name: 'Ixelles',
        ACT: 2000,
        SA: 9800,
        F2: 2290,
        W2: 900,
      },
      {
        name: 'Evere',
        ACT: 2780,
        SA: 3908,
        F2: 2000,
        W2: 2900,
      },
      {
        name: 'Molenbeek',
        ACT: 1890,
        SA: 4800,
        F2: 2181,
        W2: 1400,
      },
      {
        name: 'Vilvoorde',
        ACT: 2390,
        SA: 3800,
        F2: 2500,
        W2: 2400,
      },
      {
        name: 'Autre',
        ACT: 3490,
        SA: 4300,
        F2: 2100,
        W2: 400,
      },
];

export default class Example extends PureComponent {

  render() {
    return (
      <ResponsiveContainer height={200}>
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="SA" fill="#8884d8" />
          <Bar yAxisId="right" dataKey="ACT" fill="#f3bbff" />
          <Bar yAxisId="right" dataKey="F2" fill="#fdee00" />
          <Bar yAxisId="right" dataKey="W2" fill="#87a96b" />
        </BarChart>
      </ResponsiveContainer>
    );
  }
}
