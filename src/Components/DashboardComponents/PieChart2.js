import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { httpClient } from '../../Api/HttpClient';

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

const Example = () => {
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState([]);
  const [selectedOption, setSelectedOption] = useState(localStorage.getItem('selectedOption') || 'aujourd\'hui');
  const [selectedStation, setSelectedStation] = useState(localStorage.getItem('selectedSTOption') || 'ST10');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await httpClient.get(`/api/bookings/details/${selectedStation}`);
        setBookingData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedStation]); // Re-fetch data when selectedStation changes

  const calculateVisitTimes = (bookings) => {
    const finishedBookings = bookings.filter(booking => booking.bookingDetails.status === "FINISHED" && booking.rendezVousEtat.etat === "ACCEPTE");
  
    const visitTimes = finishedBookings.map(booking => {
      const whenUpdated = new Date(booking.bookingDetails.whenUpdated);
      const heure = new Date(booking.rendezVousEtat.tempsModification);
      return Math.abs(whenUpdated - heure) / (1000 * 60); // Calcul du temps de visite en minutes
    });
  
    return visitTimes;
  };

  const calculateWaitingTimes = (bookings) => {
    const finishedBookings = bookings.filter(booking => booking.bookingDetails.status === "FINISHED" && booking.rendezVousEtat.etat === "ACCEPTE");

    const waitingTimes = finishedBookings.map(booking => {
      const whenCreated = new Date(booking.bookingDetails.whenCreated);
      const heure = new Date(booking.rendezVousEtat.tempsModification);

      //console.log("heure : " + heure +" whenCreated : "+whenCreated + " difference : "+Math.abs(whenCreated - heure) / (1000 * 60));
      return Math.abs(whenCreated - heure) / (1000 * 60); // Calcul du temps d'attente en minutes
    });
    
    return waitingTimes;
  };

  const visitTimes = calculateVisitTimes(bookingData);
  const waitingTimes = calculateWaitingTimes(bookingData);

  const visitData = [
    { name: '<15', value: visitTimes.filter(time => time < 15).length },
    { name: '<30', value: visitTimes.filter(time => time >= 15 && time < 30).length },
    { name: '>30', value: visitTimes.filter(time => time >= 30).length },
  ];

  const waitingData = [
    { name: '<15', value: waitingTimes.filter(time => time < 15).length },
    { name: '<30', value: waitingTimes.filter(time => time >= 15 && time < 30).length },
    { name: '>30', value: waitingTimes.filter(time => time >= 30).length },
  ];

  return (
    <div style={{ display: 'flex', margin: '10px' }}>
      {/* Graphique Temps de visite */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'row', padding: '20px', marginRight: '3.5%', backgroundColor: 'white', borderRadius: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ flex: 1, marginRight: '10px' }}>
          <h5>Temps de visite (min)</h5>
          <div>
            {visitData.map((item, index) => (
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
                data={visitData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {visitData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Graphique Temps d'attente */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'row', padding: '20px', marginRight: '3.5%', backgroundColor: 'white', borderRadius: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ flex: 1, marginRight: '10px' }}>
          <h5>Temps d'attente (min)</h5>
          <div>
            {waitingData.map((item, index) => (
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
                data={waitingData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {waitingData.map((entry, index) => (
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
