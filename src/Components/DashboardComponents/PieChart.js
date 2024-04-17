import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { httpClient } from '../../Api/HttpClient';

const Example = ({ datas }) => {
  const [data, setData] = useState(datas);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(localStorage.getItem('selectedOption') || 'aujourd\'hui');
  const [selectedStation, setSelectedStation] = useState(localStorage.getItem('selectedSTOption') || 'ST10'); // Ajout de l'état de la station sélectionnée
  const [retardData, setRetardData] = useState([]);
  const [attenteData, setAttenteData] = useState([]);

  useEffect(() => {
    const defaultStates = [
      { stateName: 'A VENIR', quantity: 0 },
      { stateName: 'ACCEPTE', quantity: 0 },
      { stateName: 'REFUSE', quantity: 0 },
      { stateName: 'SANS_RENDEZVOUS', quantity: 0 },
      { stateName: 'NOSHOW', quantity: 0 }
    ];
    setData(defaultStates);

    const fetchData =  () => {
      
        setLoading(true); // Set loading to false when fetching data
        
        const fetchedData = data;

        // Process fetched data as needed
        const stateQuantities = {};
        const retards = { '<15': 0, '<30': 0, '>30': 0 }; // Initialize retards object
        const attentes = { '<15': 0, '<30': 0, '>30': 0 }; // Initialize attentes object
        if(fetchedData!=null){
        
        
        fetchedData.forEach(item => {
          if (item.rendezVousEtat.etat !== 'ANNULE') {
            const stateName = item.rendezVousEtat.etat;
            if (!stateQuantities[stateName]) {
              stateQuantities[stateName] = 0;
            }
            stateQuantities[stateName]++;
            if (item.rendezVousEtat.etat === 'RETARD') {
              // Calculate retards
              const delay = item.rendezVousEtat.tempsModification;
              const date = new Date(delay);
              const heures = date.getHours();
              const minutes = date.getMinutes();
              const heureMinutes = heures * 60 + minutes;

              // Convertir item.bookingDetails.heure en minutes
              const heuresBooking = parseInt(item.bookingDetails.heure.split(':')[0]);
              const minutesBooking = parseInt(item.bookingDetails.heure.split(':')[1]);
              const heureMinutesBooking = heuresBooking * 60 + minutesBooking;

              // Calculer la différence en minutes
              const differenceEnMinutes = heureMinutes - heureMinutesBooking;
              console.log(differenceEnMinutes); // Affiche la différence en minutes
              if (differenceEnMinutes <= 15) {
                retards['<15']++;
              } else if (differenceEnMinutes <= 30) {
                retards['<30']++;
              } else {
                retards['>30']++;
              }
            }
          // Calculate attentes
            // Calculate attentes
            const attente = item.rendezVousEtat.attente;
            if (attente <= 15) {
              attentes['<15']++;
            } else if (attente <= 30) {
              attentes['<30']++;
            } else {
              attentes['>30']++;
            }
          
          }
          setLoading(false);
        });

        const updatedData = defaultStates.map(({ stateName, quantity }) => ({
          name: stateName,
          value: stateQuantities[stateName] || quantity
        }));

        setData(updatedData);
        setRetardData([
          { name: '<15', value: retards['<15'] },
          { name: '<30', value: retards['<30'] },
          { name: '>30', value: retards['>30'] }
        ]);
        
      }
    };

    fetchData();
  }, [selectedOption, selectedStation]); // Ajout de selectedStation dans les dépendances

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

  const borderRadius = '20px';
  const marginBetweenPairs = '3%';
  const BoxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';

  const boxStyle = {
    boxShadow: BoxShadow,
    borderRadius,
  };

  return (
    <div style={{ display: 'flex', margin: '10px' }}>
      {/* Paire 1 */}
      <div style={{ ...boxStyle, flex: 1, display: 'flex', flexDirection: 'row', padding: '20px', marginRight: marginBetweenPairs, backgroundColor: 'white' }}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {/* Tableau 1 */}
            <div style={{ flex: 1, marginRight: '10px' }}>
              <h5>Etats Rendez-vous</h5>
              <div>
                {data.map((item, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: '20px', height: '20px', backgroundColor: COLORS[index], marginRight: '5px', borderRadius: '50%' }}></div>
                    <div>{item.name}</div>
                  </div>
                ))}
              </div>
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
          </>
        )}
      </div>

      {/* Paire 2 */}
      <div style={{ ...boxStyle, flex: 1, display: 'flex', flexDirection: 'row', padding: '20px', marginRight: marginBetweenPairs, backgroundColor: 'white' }}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {/* Tableau 2 */}
            <div style={{ flex: 1, marginRight: '10px' }}>
              <h5>Retards (min)</h5>
              <div>
                {retards.map((item, index) => (
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
                    data={retardData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {retardData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
      {/* Paire 3 */}
      <div style={{ ...boxStyle, flex: 1, display: 'flex', flexDirection: 'row', padding: '20px', marginRight: marginBetweenPairs, backgroundColor: 'white' }}>
          {/* Tableau 3 */}
          <div style={{ flex: 1, marginRight: '10px' }}>
            <h5>Temps d'inspection (min)</h5>
            <div>
              {retards.map((item, index) => (
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

    </div>
  );
};

export default Example;