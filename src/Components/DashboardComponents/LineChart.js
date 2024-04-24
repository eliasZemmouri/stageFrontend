import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { httpClient } from '../../Api/HttpClient'; // Importez votre client HTTP

const LineChartComponent = () => {
  const [lineChartData, setLineChartData] = useState([]);
  const [dateRange, setDateRange] = useState(JSON.parse(localStorage.getItem('dateRange')) || { startDate: new Date(), endDate: new Date() });
  const [selectedStation, setSelectedStation] = useState(localStorage.getItem('selectedSTOption') || 'ST10');

  useEffect(() => {
    const fetchData = async () => {
      try {
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
        // Récupérer les données de votre API
        const response = await httpClient.get(`/api/bookings/details/${selectedStation}/${debutISO}/${finISO}`); // Modifier l'URL en fonction de votre API
        const bookings = response.data;

        // Calculer le temps dépassé pour chaque tranche horaire
        const data = [];
        const timeRanges = [
          { name: '8-10h', startTime: 8, endTime: 10 },
          { name: '10-13h', startTime: 10, endTime: 13 },
          { name: '13-15h', startTime: 13, endTime: 15 },
          { name: '15-17h', startTime: 15, endTime: 17 },
        ];

        for (const range of timeRanges) {
          const now = new Date();
  const startTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    range.startTime,
    0,
    0,
    0
  ).getTime();
  const endTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    range.endTime,
    0,
    0,
    0
  ).getTime();

  const visits = bookings.filter(booking => {
    const bookingTime = new Date(booking.bookingDetails.whenUpdated).getTime();
    const bookingHour = new Date(booking.bookingDetails.whenUpdated).getHours();
    const bookingMinutes = new Date(booking.bookingDetails.whenUpdated).getMinutes();
    const bookingDateTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      bookingHour,
      bookingMinutes,
      0,
      0
    ).getTime();

    return bookingDateTime >= startTime && bookingDateTime < endTime;
  });

          /*const exceededVisits = visits.filter(visit => {
            const bookingHour = new Date(visit.bookingDetails.whenUpdated).getHours();
            const bookingMinutes = new Date(visit.bookingDetails.whenUpdated).getMinutes();
            const bookingDateTime = new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate(),
              bookingHour,
              bookingMinutes,
              0,
              0
            ).getTime();
            const heureString = visit.bookingDetails.heure;
            // Récupération de l'heure et des minutes depuis la chaîne
            const [heure, minutes] = heureString.split(':').map(Number);
            // Création d'un nouvel objet Date pour aujourd'hui avec l'heure et les minutes spécifiées
            const maintenant = new Date();
            const arriveTime = new Date(
              maintenant.getFullYear(),
              maintenant.getMonth(),
              maintenant.getDate(),
              heure,
              minutes,
              0, // Secondes
              0  // Millisecondes
            ).getTime();
            console.log("arrive : "+arriveTime);
            return arriveTime <= bookingDateTime;
          });*/
          data.push({
            name: range.name,
            count: visits.length,
          });
        }

        setLineChartData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selectedStation, dateRange]);

  return (
    <ResponsiveContainer height={200}>
      <LineChart data={lineChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="count" stroke="#0088FE" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartComponent;
