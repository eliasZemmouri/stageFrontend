import React, { PureComponent } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'En cours', value: 120 },
  { name: 'Accepte', value: 90 },
  { name: 'Refuse', value: 75 },
  { name: 'Retard', value: 60 },
  { name: 'No show', value: 45 },
  { name: 'Annule', value: 30 },
];
const retards = [
  { name: '<15', value: 120 },
  { name: '<30', value: 90 },
  { name: '>30', value: 75 },
];
const fileAttente = [
  { name: '<15', value: 120 },
  { name: '<30', value: 90 },
  { name: '>30', value: 75 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#42ff65', '#ff42d6'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize="16px"
      fontWeight="bold"
      style={{ userSelect: 'none' }}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

class Example extends PureComponent {
  render() {
    return (
      <div style={{ display: 'flex', margin: '10px', border: '1px solid #ccc' }}>
        {/* Paire 1 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'row', padding: '20px', borderRight: '1px solid #ccc' }}>
          {/* Tableau 1 */}
          <div style={{ flex: 1, marginRight: '10px' }}>
            <h5>Etats Rendez-vous</h5>
            <ul>
              <li>En cours: Bleu</li>
              <li>Accepte: Vert foncé</li>
              <li>Refuse: Jaune</li>
              <li>Retard: Rouge</li>
              <li>No show: Vert clair</li>
              <li>Annule: Rose</li>
            </ul>
          </div>
          {/* Chart 1 */}
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Paire 2 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'row', padding: '20px', borderRight: '1px solid #ccc' }}>
          {/* Tableau 2 */}
          <div style={{ flex: 1, marginRight: '10px' }}>
            <h5>Retards</h5>
            <ul>
              <li>&lsaquo; 15: Bleu</li>
              <li>&lsaquo; 30: Vert</li>
              <li>&rsaquo; 30: Jaune</li>
            </ul>
          </div>
          {/* Chart 2 */}
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={retards}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {retards.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Paire 3 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'row', padding: '20px' }}>
          {/* Tableau 3 */}
          <div style={{ flex: 1, marginRight: '10px' }}>
            <h5>Temps d'attente</h5>
            <ul>
              <li>&lsaquo; 15: Bleu</li>
              <li>&lsaquo; 30: Vert</li>
              <li>&rsaquo; 30: Jaune</li>
            </ul>
          </div>
          {/* Chart 3 */}
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={fileAttente}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {fileAttente.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  }
}

export default Example;
