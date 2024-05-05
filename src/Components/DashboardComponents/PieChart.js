import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { httpClient } from '../../Api/HttpClient';

const Example = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(JSON.parse(localStorage.getItem('dateRange')) || { startDate: new Date(), endDate: new Date() });
  const [selectedStation, setSelectedStation] = useState(localStorage.getItem('selectedSTOption') || 'ST10');
  const [retardData, setRetardData] = useState([]);
  const [attenteData, setAttenteData] = useState([]);

  

  useEffect(() => {
    const defaultStates = [
      { stateName: 'FENETRE', quantity: 0 },
      { stateName: 'ACCEPTE', quantity: 0 },
      { stateName: 'REFUSE', quantity: 0 },
      { stateName: 'SANSRENDEZVOUS', quantity: 0 },
      { stateName: 'NOSHOW', quantity: 0 }
    ];
    setData(defaultStates);

    const fetchData = async () => {
      try { 
        setLoading(true);
        let apiUrl;
        
        const debut = new Date(dateRange.startDate); // Utilise la date sélectionnée par l'utilisateur
        debut.setHours(5); // Définit l'heure choisie
        debut.setMinutes(45); // Définit les minutes choisies
        debut.setSeconds(0); // Définit les secondes à zéro
        debut.setMilliseconds(0); // Définit les millisecondes à zéro

        // Fin de la plage horaire
        const fin = new Date(dateRange.endDate); // Utilise la date sélectionnée par l'utilisateur
        fin.setHours(19); // Définit l'heure choisie
        fin.setMinutes(19); // Définit les minutes choisies
        fin.setSeconds(0); // Définit les secondes à zéro
        fin.setMilliseconds(0); // Définit les millisecondes à zéro

        // Convertit les dates au format ISO 8601 pour les inclure dans l'URL
        const debutISO = debut.toISOString();
        const finISO = fin.toISOString();
        apiUrl = `/api/bookings/details/${selectedStation}/${debutISO}/${finISO}`;

        const response = await httpClient.get(apiUrl);
        const fetchedData = response.data;

        const stateQuantities = {};
        const retards = { '<15': 0, '<30': 0, '>30': 0 }; // Déclaration de la variable retards
        const attentes = { '<15': 0, '<30': 0, '>30': 0 }; // Déclaration de la variable attentes
        fetchedData.forEach(item => {
          if (item.rendezVousEtat.etat !== 'ANNULE') {
            let stateName;
            if (item.rendezVousEtat.etat === 'A VENIR' || item.rendezVousEtat.etat === 'AVANCE' || item.rendezVousEtat.etat === 'RETARD') {
              stateName = 'FENETRE';
              item.rendezVousEtat.etat = 'FENETRE';
            } else {
              stateName = item.rendezVousEtat.etat;
            }
            if (!stateQuantities[stateName]) {
              stateQuantities[stateName] = 0;
            }
            stateQuantities[stateName]++;

            if (item.rendezVousEtat.etat === 'ACCEPTE') {
              const whenCreated = new Date(item.bookingDetails.whenCreated);
              const whenUpdated = new Date(item.bookingDetails.whenUpdated);
              const differenceEnMillisecondes = whenUpdated - whenCreated;
              const differenceEnMinutes = differenceEnMillisecondes / (1000 * 60);

              if (differenceEnMinutes < 15) {
                retards['<15']++;
              } else if (differenceEnMinutes < 30) {
                retards['<30']++;
              } else {
                retards['>30']++;
              }
            }

            // Calcul pour le temps après la présentation
            if (item.rendezVousEtat.etat === 'ACCEPTE') {
              const attente = item.rendezVousEtat.attente;
              if (attente < 15) {
                attentes['<15']++;
              } else if (attente < 30) {
                attentes['<30']++;
              } else {
                attentes['>30']++;
              }
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
        setAttenteData([
          { name: '<15', value: attentes['<15'] },
          { name: '<30', value: attentes['<30'] },
          { name: '>30', value: attentes['>30'] }
        ]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setData(defaultStates);
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedStation]);

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
      <div style={{ ...boxStyle, flex: 1, display: 'flex', flexDirection: 'row', padding: '20px', marginRight: marginBetweenPairs, backgroundColor: 'white' }}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
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

      <div style={{ ...boxStyle, flex: 1, display: 'flex', flexDirection: 'row', padding: '20px', marginRight: marginBetweenPairs, backgroundColor: 'white' }}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div style={{ flex: 1, marginRight: '10px' }}>
              <h5>Temps Après Présentation (min)</h5>
              <div>
                {retardData.map((item, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: '20px', height: '20px', backgroundColor: COLORS[index], marginRight: '5px', borderRadius: '50%' }}></div>
                    <div>{item.name}</div>
                  </div>
                ))}
              </div>
            </div>
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

      <div style={{ ...boxStyle, flex: 1, display: 'flex', flexDirection: 'row', padding: '20px', marginRight: marginBetweenPairs, backgroundColor: 'white' }}>
        <div style={{ flex: 1, marginRight: '10px' }}>
          <h5>Temps d'inspection (min)</h5>
          <div>
            {attenteData.map((item, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '20px', height: '20px', backgroundColor: COLORS[index], marginRight: '5px', borderRadius: '50%' }}></div>
                <div>{item.name}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={attenteData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {attenteData.map((entry, index) => (
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
