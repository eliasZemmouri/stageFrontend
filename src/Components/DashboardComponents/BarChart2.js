import React, { PureComponent } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
    {
        name: 'Forest',
        ACT: 4000,
        SA: 2400,
        Flandre: 2400,
        Wallonie: 2400,
      },
      {
        name: 'Anderlecht',
        ACT: 3000,
        SA: 1398,
        Flandre: 2210,
        Wallonie: 1600,
      },
      {
        name: 'Bruxelles',
        ACT: 2000,
        SA: 9800,
        Flandre: 2290,
        Wallonie: 900,
      },
      {
        name: 'Saint-Gilles',
        ACT: 2780,
        SA: 3908,
        Flandre: 2000,
        Wallonie: 2900,
      },
      {
        name: 'Molenbeek-Saint-Jean',
        ACT: 1890,
        SA: 4800,
        Flandre: 2181,
        Wallonie: 1400,
      },
      {
        name: 'Koekelberg',
        ACT: 2390,
        SA: 3800,
        Flandre: 2500,
        Wallonie: 2400,
      },
      {
        name: 'Berchem-Sainte-Agathe',
        ACT: 3490,
        SA: 4300,
        Flandre: 2100,
        Wallonie: 400,
      },{
        name: 'Ganshoren',
        ACT: 3490,
        SA: 4300,
        Flandre: 2100,
        Wallonie: 400,
      },{
        name: 'Jette',
        ACT: 3490,
        SA: 4300,
        Flandre: 2100,
        Wallonie: 400,
      },{
        name: 'Uccle',
        ACT: 3490,
        SA: 4300,
        Flandre: 2100,
        Wallonie: 400,
      },{
        name: 'Autre',
        ACT: 3490,
        SA: 4300,
        Flandre: 2100,
        Wallonie: 400,
      },
];

export default class Example extends PureComponent {

  render() {
    return (
      <ResponsiveContainer height={200}>
        <BarChart
          width={900}
          height={900}
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
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="SA" fill="#8884d8" />
          <Bar yAxisId="left" dataKey="ACT" fill="#f3bbff" />
          <Bar yAxisId="left" dataKey="Flandre" fill="#ec9f53" />
          <Bar yAxisId="left" dataKey="Wallonie" fill="#87a96b" />
        </BarChart>
      </ResponsiveContainer>
    );
  }
}
