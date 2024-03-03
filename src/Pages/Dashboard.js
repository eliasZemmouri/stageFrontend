// Dashboard.js (composant principal)
import React, {useState} from 'react';
import { ResponsiveContainer } from 'recharts';
import LineChartComponent from '../Components/DashboardComponents/LineChart';
import PieChartComponent from '../Components/DashboardComponents/PieChart';
import StateBlock from '../Components/DashboardComponents/StateBlock';
import './Dashboard.css'
import monImage from '../images/s-a.png'
import BarChart from '../Components/DashboardComponents/BarChart'; 
import Swal from 'sweetalert2'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDOMServer from 'react-dom/server';


const Dashboard = () => {
  const statesData = [
    { stateName: 'COURS', quantity: 120 },
    { stateName: 'ACCEPTE', quantity: 90 },
    { stateName: 'REFUSE', quantity: 75 },
    { stateName: 'RETARD', quantity: 60 },
    { stateName: 'NOSHOW', quantity: 45 },
    { stateName: 'ANNULE', quantity: 30 },
  ];
  const products = [
    { reference: '001', name: 'Product 1', category: 'Category A',capsule: 'Satelite'},
    { reference: '002', name: 'Product 2', category: 'Category B',capsule: 'Satelite'},
    { reference: '003', name: 'Product 3', category: 'Category A',capsule: 'Satelite'},
    { reference: '004', name: 'Product 4', category: 'Category C',capsule: 'Satelite' },
    { reference: '005', name: 'Product 5', category: 'Category B',capsule: 'Satelite' },
    { reference: '001', name: 'Product 1', category: 'Category A',capsule: 'Satelite'},
    { reference: '002', name: 'Product 2', category: 'Category B',capsule: 'Satelite'},
    { reference: '003', name: 'Product 3', category: 'Category A',capsule: 'Satelite'},
    { reference: '004', name: 'Product 4', category: 'Category C',capsule: 'Satelite' },
    { reference: '005', name: 'Product 5', category: 'Category B',capsule: 'Satelite' },
    
  ];
  const [globalFilter, setGlobalFilter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});

  const handleGlobalFilterChange = (e) => {
    setGlobalFilter(e.target.value);
  };
  const customGlobalFilter = (value, filters) => {
    const searchString = (globalFilter || '').toLowerCase();
  
    if (searchString.trim() === '') {
      return true; // Aucun filtre appliqué
    }
  
    return (
      value.name.toLowerCase().includes(searchString) ||
      value.country.name.toLowerCase().includes(searchString) ||
      value.representative.name.toLowerCase().includes(searchString) ||
      value.balance.toString().toLowerCase().includes(searchString) ||
      value.status.toLowerCase().includes(searchString)
    );
  };
  const header = (
    <div className="table-header">
      <span>Global Search: </span>
      <InputText type="search" onInput={handleGlobalFilterChange} style={{textAlignl:'Left'}}/>
    </div>
  );
  const handleStateClick = (stateName) => {
    // Handle click for the specific state
    const productsTable = ReactDOMServer.renderToString(
      <div >
        <DataTable
        value={products}
        paginator
        showGridlines
        rows={4}
        loading={loading}
        dataKey="id"
        filters={filters}
        globalFilter={globalFilter}
        header={header}
        emptyMessage="No customers found."
        filter={customGlobalFilter}
      >
          <Column field="reference" header="Reference"></Column>
          <Column field="name" header="Name"></Column>
          <Column field="category" header="Category"></Column>
          <Column field="capsule" header="Capsule"></Column>
          <Column field="name" header="Other Name"></Column>
          <Column field="capsule" header="Capsule"></Column>
          <Column field="capsule" header="Capsule"></Column>
          <Column field="capsule" header="Capsule"></Column>
          <Column field="capsule" header="Capsule"></Column>
        </DataTable>
      </div>
    );
  
    Swal.fire({
      title: `Cliqué sur ${stateName}`,
      html: productsTable,
      confirmButtonText: 'Fermer',
      width:'50%',
    });
  };
  const handleDropdownChange = (selectedOption) => {
    // Handle dropdown selection change
    console.log(`Selected option: ${selectedOption}`);
    setSelectedOption(selectedOption);
  };

  const dropdownOptions = ["aujord'hui", 'semaine', 'mois'];
  const [selectedOption, setSelectedOption] = useState(dropdownOptions[0]);
  const [isButtonClicked, setButtonClicked] = useState(false);

  const handleRefreshClick = () => {
    // Logique de rechargement ici
    setButtonClicked(true);

    // Ajouter une pause pour montrer l'effet de clic (peut être ajusté)
    setTimeout(() => {
      setButtonClicked(false);
    }, 200);
    window.location.reload();
  };
  const borderRadius = '10px';
  const BoxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';

  const boxStyle = {
    boxShadow: BoxShadow,
    borderRadius,
  };

  return (
    
    <div style={{userSelect:'none'}}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <img src={monImage} style={{ maxWidth: '100%', height: 'auto', width: '250px', marginLeft: '75px' }} />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <select class="form-select" value={selectedOption} onChange={(e) => handleDropdownChange(e.target.value)} style={{borderRadius:'20px'}}>
            {dropdownOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
          <div style={{ marginLeft: '20px' }}></div> {/* Espace entre le bouton et la liste déroulante */}
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
          <div style={{ marginLeft: '10px' }}></div> 
        </div>
      </div>

      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
        {/* State Blocks */}
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

        {/* PieChart */}
        <ResponsiveContainer width="80%" height={130}>
          <PieChartComponent />
        </ResponsiveContainer>

        {/* Ajout d'espace entre les graphiques */}
        <div style={{ height: '175px' }}></div>

         {/* LineChart and BarChart on the same line */}
         <div style={{ display: 'flex', width: '80%' }}>
          {/* LineChart */}
          
          
          <ResponsiveContainer width="50%" height={250} style={{...boxStyle, borderRadius:20,backgroundColor:'white'}}>
          <div style={{margin:'auto',textAlign:'center'}}>
          <div style={{ height: '15px' }}></div>
          <h6>Nombre Visites par type d'attentes</h6>
          </div>  
            <LineChartComponent />
          </ResponsiveContainer>

          {/* Ajout d'espace entre les graphiques */}
          <div style={{ width: '20px' }}></div>

          {/* BarChart */}
          <ResponsiveContainer width="50%" height={250} style={{...boxStyle, borderRadius:20,backgroundColor:'white'}}>
          <div style={{margin:'auto',textAlign:'center'}}>
          <div style={{ height: '15px' }}></div>
            <h6>Nombre de Visites par Commune</h6>
          </div>
            <BarChart />
          </ResponsiveContainer>
        </div>


        {/* Ajout d'espace entre les graphiques */}
        <div style={{ height: '20px' }}></div>

        {/* ... Ajoute d'autres graphiques ici ... */}
      </div>
    </div>
  );
};

export default Dashboard;
