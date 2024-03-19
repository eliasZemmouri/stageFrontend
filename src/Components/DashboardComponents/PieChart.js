import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { httpClient } from '../../Api/HttpClient';

const Example = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState("aujourd'hui");
  const [retardData, setRetardData] = useState([]);
  const [attenteData, setAttenteData] = useState([]);

  useEffect(() => {
    const defaultStates = [
      { stateName: 'AVENIR', quantity: 0 },
      { stateName: 'ACCEPTE', quantity: 0 },
      { stateName: 'REFUSE', quantity: 0 },
      { stateName: 'RETARD', quantity: 0 },
      { stateName: 'NOSHOW', quantity: 0 }
    ];
    setData(defaultStates);

    const fetchData = async () => {
      try { 
        setLoading(true); // Set loading to true when fetching data
        let apiUrl;
        switch(selectedOption) {
          case "aujourd'hui":
            apiUrl = '/api/bookings/details/TODAY';
            break;
          case "semaine":
            apiUrl = '/api/bookings/details/THIS_WEEK';
            break;
          case "mois":
            apiUrl = '/api/bookings/details/THIS_MONTH';
            break;
          default:
            apiUrl = '/api/bookings/details/TODAY';
        }
        const response = await httpClient.get(apiUrl);
        const fetchedData = response.data;

        // Process fetched data as needed
        const stateQuantities = {};
        const retards = { '<15': 0, '<30': 0, '>30': 0 }; // Initialize retards object
        const attentes = { '<15': 0, '<30': 0, '>30': 0 }; // Initialize attentes object
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
        setLoading(false); // Set loading to false after fetching data
      } catch (error) {
        console.error("Error fetching data:", error);
        // If there's an error, set default data
        setData(defaultStates);
        setLoading(false); // Set loading to false if there's an error
      }
    };

    fetchData();
  }, [selectedOption]);

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
      <div style={{ ...boxStyle, flex: 1, display: 'flex', flexDirection: 'row', padding: '20px', backgroundColor: 'white' }}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default Example;