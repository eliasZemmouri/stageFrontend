import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ResponsiveContainer } from 'recharts';
import LineChartComponent from '../Components/DashboardComponents/LineChart';
import PieChartComponent from '../Components/DashboardComponents/PieChart';
import StateBlock from '../Components/DashboardComponents/StateBlock';
import './Dashboard.css';
import monImage from '../images/s-a.png';
import { httpClient } from '../Api/HttpClient'
import BarChart from '../Components/DashboardComponents/BarChart';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import Papa from 'papaparse';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [statesData, setStatesData] = useState([]);
  const [products, setProducts] = useState([]);
  const [totalRendezvousWithoutCancelled, setTotalRendezvousWithoutCancelled] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedSTOption, setSelectedSTOption] = useState(null); // Nouvel état pour ST10 et ST11
  const [dropdownOptions, setDropdownOptions] = useState(["aujourd'hui","semaine","mois"]);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedState, setSelectedState] = useState(null);

  useEffect(() => {
    const defaultStates = [
      { stateName: 'AVENIR', quantity: 0 },
      { stateName: 'ACCEPTE', quantity: 0 },
      { stateName: 'REFUSE', quantity: 0 },
      { stateName: 'RETARD', quantity: 0 },
      { stateName: 'NOSHOW', quantity: 0 }
    ];

    setStatesData(defaultStates);

    const fetchData = async () => {
      try {
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
        const data = response.data;

        const stateQuantities = {};

        const totalRendezvousWithoutCancelledV = data.reduce((acc, item) => {
          if (item.rendezVousEtat.etat !== 'ANNULE') {
            const stateName = item.rendezVousEtat.etat;
            if (!stateQuantities[stateName]) {
              stateQuantities[stateName] = 0;
            }
            stateQuantities[stateName]++;
            acc++;
          }
          return acc;
        }, 0);
        setTotalRendezvousWithoutCancelled(totalRendezvousWithoutCancelledV);

        const updatedStatesData = defaultStates.map(state => ({
          ...state,
          quantity: stateQuantities[state.stateName] || state.quantity
        }));
        setStatesData(updatedStatesData);

        const productsData = data.map(item => ({
          idRendezvous: item.bookingDetails.id,
          client: item.bookingDetails.client,
          plaque: item.bookingDetails.plaque,
          chassis: item.bookingDetails.chassis,
          source: item.bookingDetails.source,
          typeDeVisite: item.bookingDetails.typeDeVisite,
          vehicule: item.bookingDetails.vehicule,
          state: item.rendezVousEtat.etat
        }));
        setProducts(productsData);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selectedOption]);

  useEffect(() => {
    const savedSelectedOption = localStorage.getItem('selectedOption');
    if (savedSelectedOption) {
      setSelectedOption(savedSelectedOption);
    }
  }, []);

  useEffect(() => {
    if (selectedOption) {
      localStorage.setItem('selectedOption', selectedOption);
    }
  }, [selectedOption]);

  useEffect(() => {
    const savedSelectedSTOption = localStorage.getItem('selectedSTOption');
    if (savedSelectedSTOption) {
      setSelectedSTOption(savedSelectedSTOption);
    }
  }, []);

  useEffect(() => {
    if (selectedSTOption) {
      localStorage.setItem('selectedSTOption', selectedSTOption);
    }
  }, [selectedSTOption]); // Sauvegarde la valeur dans le localStorage

  const formattedLastUpdate = () => {
    const now = new Date();
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return now.toLocaleDateString('fr-FR', options);
  };

  const handleGlobalFilterChange = (e) => {
    setGlobalFilter(e.target.value);
  };

  const customGlobalFilter = (value, filters) => {
    const searchString = (globalFilter || '').toLowerCase();

    if (searchString.trim() === '') {
      return true;
    }

    return (
      value.name.toLowerCase().includes(searchString) ||
      value.category.toLowerCase().includes(searchString) ||
      value.capsule.toLowerCase().includes(searchString) ||
      value.reference.toLowerCase().includes(searchString)
    );
  };

  const header = (
    <div className="table-header" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
      <span>Recherche  :</span>
      <InputText type="search" onInput={handleGlobalFilterChange} style={{ textAlign: 'left' }} />
      <Button
        label="Exporter CSV"
        icon="pi pi-download"
        onClick={() => exportCSV(getFilteredProductsByState(), selectedState)}
        style={{ marginLeft: '10px' }}
      />
    </div>
  );

  const handleDropdownChange = (e) => {
    if (e.target && e.target.value) {
      setSelectedOption(e.target.value);
      setSelectedState(e.target.value);

      window.location.reload();
    }
  };

  const handleRefreshClick = () => {
    setIsButtonClicked(!isButtonClicked);
    window.location.reload();
  };

  const handleStateClick = (stateName) => {
    setSelectedState(stateName);
    setDialogVisible(true);
  };

  const getFilteredProductsByState = () => {
    return products.filter((product) => product.state === selectedState);
  };

  const exportCSV = (data, fileName) => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, fileName);
    } else {
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  // Gestion du changement pour le nouveau select ST10/ST11
  const handleSTOptionChange = (e) => {
    if (e.target && e.target.value) {
      setSelectedSTOption(e.target.value);
    }
  };
  const handleDashboard2Click = () => {
    navigate('/dashboard2');
  };

  return (
    <div style={{ userSelect: 'none', marginLeft: '75px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <img src={monImage} style={{ maxWidth: '100%', height: 'auto', width: '250px' }} />
        <div style={{ flex: 1, textAlign: 'center' }}>
          <p style={{ whiteSpace: 'nowrap', marginTop: '10px' }}>Dernière Maj : {formattedLastUpdate()}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <select
            className="form-select"
            value={selectedOption}
            onChange={handleDropdownChange}
            style={{
              borderRadius: '20px',
              padding: '8px 16px',
              fontSize: '16px',
              border: '2px solid #007BFF',
              backgroundColor: 'white',
              color: '#333',
              outline: 'none',
              cursor: 'pointer',
              width: '150px',
            }}
          >
            {dropdownOptions.map((option, index) => (
              <option key={index} value={option} style={{ backgroundColor: '#f5f5f5', color: '#333' }}>
                {option}
              </option>
            ))}
          </select>
          <div style={{ marginLeft: '20px' }}></div>
          <select
            className="form-select"
            value={selectedSTOption}
            onChange={handleSTOptionChange}
            style={{
              borderRadius: '20px',
              padding: '8px 16px',
              fontSize: '16px',
              border: '2px solid #007BFF',
              backgroundColor: 'white',
              color: '#333',
              outline: 'none',
              cursor: 'pointer',
              width: '150px',
            }}
          >
            <option value="ST10" style={{ backgroundColor: '#f5f5f5', color: '#333' }}>ST10</option>
            <option value="ST11" style={{ backgroundColor: '#f5f5f5', color: '#333' }}>ST11</option>
          </select>
          <div style={{ marginLeft: '20px' }}></div>
          <button
            className={`fa fa-fw fa-retweet ${isButtonClicked ? 'clicked' : ''}`}
            style={{
              fontSize: '2em',
              backgroundColor: '#007BFF',
              color: 'white',
              padding: '4px',
              borderRadius: '20px',
              border: 'none',
              boxShadow: isButtonClicked ? '0 0 5px rgba(0, 0, 0, 0.3)' : 'none',
            }}
            onClick={handleRefreshClick}
          />
        </div>
        <div style={{ marginLeft: '20px' }}></div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div>
          <div style={{border:'1px solid #ccc', display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '20px', backgroundColor:'white'}}><h4 style={{marginTop: '10px', marginBottom:'10px'}}>Total Rendez-vous : <span style={{ color: '#2BB67D' }}>{totalRendezvousWithoutCancelled}</span></h4></div>
          <div className="state-container">
            {statesData.map((stateInfo, index) => (
              <StateBlock
                key={index}
                stateName={stateInfo.stateName}
                quantity={stateInfo.quantity}
                onClick={() => handleStateClick(stateInfo.stateName)}
              />
            ))}
          </div>
        </div>
        <ResponsiveContainer width="80%" height={130}>
          <PieChartComponent />
        </ResponsiveContainer>
        <div style={{ height: '175px' }}></div>
        <div style={{ display: 'flex', width: '80%' }}>
          <ResponsiveContainer width="50%" height={250} style={{ borderRadius: 20, backgroundColor: 'white' }}>
            <div style={{ margin: 'auto', textAlign: 'center' }}>
              <div style={{ height: '15px' }}></div>
              <h6>Nombre Visites par type d'attentes</h6>
            </div>
            <LineChartComponent />
          </ResponsiveContainer>
          <div style={{ width: '20px' }}></div>
          <ResponsiveContainer width="50%" height={250} style={{ borderRadius: 20, backgroundColor: 'white' }}>
            <div style={{ margin: 'auto', textAlign: 'center' }}>
              <div style={{ height: '15px' }}></div>
              <h6>Nombre de Visites par Commune</h6>
            </div>
            <BarChart />
          </ResponsiveContainer>
        </div>
        <div style={{ height: '20px' }}></div>
      </div>

      {dialogVisible && (
        <Dialog
          header={`Visites : ${selectedState}`}
          visible={dialogVisible}
          style={{ width: '75vw' }}
          maximizable
          modal
          onHide={() => setDialogVisible(false)}
        >
          <DataTable
            value={getFilteredProductsByState()}
            stripedRows
            scrollable
            scrollHeight="flex"
            tableStyle={{ minWidth: '50rem' }}
            paginator
            showGridlines
            rows={4}
            loading={loading}
            dataKey="id"
            filters={filters}
            globalFilter={globalFilter}
            header={header}
            emptyMessage="No products found."
            filter={customGlobalFilter}
          >
            <Column field="idRendezvous" header="idRendezvous"></Column>
            <Column field="client" header="client"></Column>
            <Column field="plaque" header="plaque"></Column>
            <Column field="chassis" header="chassis"></Column>
            <Column field="source" header="source"></Column>
            <Column field="typeDeVisite" header="typeDeVisite"></Column>
            <Column field="vehicule" header="vehicule"></Column>
          </DataTable>
        </Dialog>
      )}

      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          marginLeft: '35px',
          paddingBottom: '10px',
          textAlign: 'center',
        }}
      >
        <Button
          label="Dashboard 1"
          className="p-button-info"
          style={{ marginRight: '10px' }}
          disabled={location.pathname === '/dashboard'}
        />
        <Button
          label="Dashboard 2"
          className="p-button-info"
          onClick={handleDashboard2Click}
        />
      </div>
    </div>
  );
};

export default Dashboard;
