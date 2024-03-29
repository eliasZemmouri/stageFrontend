import React, { PureComponent } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Avenir', value: 120 },
  { name: 'Accepte', value: 90 },
  { name: 'Refuse', value: 75 },
  { name: 'Retard', value: 60 },
  { name: 'No show', value: 0 },
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
    const borderRadius = '20px';
    const marginBetweenPairs = '3.5%';
    const BoxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';

    const boxStyle = {
      boxShadow: BoxShadow,
      borderRadius,
    };

    return (
      <div style={{ display: 'flex', margin: '10px' }}>
        {/* Paire 2 */}
        <div style={{ ...boxStyle, flex: 1, display: 'flex', flexDirection: 'row', padding: '20px', marginRight: marginBetweenPairs, backgroundColor: 'white' }}>
          {/* Tableau 2 */}
          <div style={{ flex: 1, marginRight: '10px' }}>
            <h5>Temps de visite (min)</h5>
            <div>
              {fileAttente.map((item, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: '20px', height: '20px', backgroundColor: COLORS[index], marginRight: '5px', borderRadius: '50%' }}></div>
                  <div>{item.name}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Chart 2 */}
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
          
          {/* Paire 3 */}
        <div style={{ ...boxStyle, flex: 1, display: 'flex', flexDirection: 'row', padding: '20px', marginRight: marginBetweenPairs, backgroundColor: 'white' }}>
          
            
              {/* Tableau 3 */}
              <div style={{ flex: 1, marginRight: '10px' }}>
                <h5>Temps d'attente (min)</h5>
                <div>
                  {fileAttente.map((item, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ width: '20px', height: '20px', backgroundColor: COLORS[index], marginRight: '5px', borderRadius: '50%' }}></div>
                      <div>{item.name}</div>
                    </div>
                  ))}
                </div>
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
