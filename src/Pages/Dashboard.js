import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Utilisation de useNavigate pour la navigation
import { ResponsiveContainer } from 'recharts';
import LineChartComponent from '../Components/DashboardComponents/LineChart';
import PieChartComponent from '../Components/DashboardComponents/PieChart';
import StateBlock from '../Components/DashboardComponents/StateBlock';
import './Dashboard.css';
import monImage from '../images/s-a.png';
import BarChart from '../Components/DashboardComponents/BarChart';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import Papa from 'papaparse';

const Dashboard = () => {
  const navigate = useNavigate(); // Utilisation de useNavigate pour la navigation
  const location = useLocation();

  

  const handleDashboard2Click = () => {
    navigate('/dashboard2');
  };
  const statesData = [
    { stateName: 'AVENIR', quantity: 120 },
    { stateName: 'VALIDE', quantity: 90 },
    { stateName: 'REFUSE', quantity: 75 },
    { stateName: 'RETARD', quantity: 45 },
    { stateName: 'NOSHOW', quantity: 0 },
  ];

  const products = [
    { reference: '001', name: 'Product 1', category: 'Category A', capsule: 'Satellite', state: 'VALIDE' },
    { reference: '002', name: 'Product 2', category: 'Category B', capsule: 'Satellite', state: 'VALIDE' },
    { reference: '003', name: 'Product 3', category: 'Category B', capsule: 'Satellite', state: 'VALIDE' },
    { reference: '004', name: 'Product 4', category: 'Category B', capsule: 'Satellite', state: 'VALIDE' },
    { reference: '005', name: 'Product 5', category: 'Category A', capsule: 'Satellite', state: 'AVENIR' },
    // ... (ajoutez vos autres produits avec l'état correspondant)
  ];
  const formattedLastUpdate = () => {
    const now = new Date();
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return now.toLocaleDateString('fr-FR', options);
  };
  const [globalFilter, setGlobalFilter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedState, setSelectedState] = useState(null);

  // Ajout de l'état et des fonctions nécessaires pour la sélection de l'option dans le Dropdown
  const [selectedOption, setSelectedOption] = useState(null);
  const [dropdownOptions, setDropdownOptions] = useState(["aujourd'hui","semaine","mois"]); // Remplacez ceci par vos options réelles
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  

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

  // Ajout de la fonction handleDropdownChange pour gérer la sélection dans le Dropdown
  const handleDropdownChange = (e) => {
    if (e.value && e.value.stateName) {
      setSelectedOption(e.value);
      setSelectedState(e.value.stateName);
    }
  };

  // Ajout de la fonction handleRefreshClick pour gérer le clic sur le bouton de rafraîchissement
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
  return (
    <div style={{ userSelect: 'none', marginLeft: '75px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Image à gauche */}
        <img src={monImage} style={{ maxWidth: '100%', height: 'auto', width: '250px' }} />

        {/* Conteneur du centre */}
        <div style={{ flex: 1, textAlign: 'center' }}>
          <p style={{ whiteSpace: 'nowrap', marginTop: '10px' }}>Dernière Maj : {formattedLastUpdate()}</p>
        </div>

        {/* Conteneur à droite */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* Select */}
          <select
            className="form-select"
            value={selectedOption}
            onChange={(e) => handleDropdownChange(e.target.value)}
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

          {/* Espace entre le select et le bouton */}
          <div style={{ marginLeft: '20px' }}></div>

          {/* Bouton */}
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
          <div style={{border:'1px solid #ccc', display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '20px', backgroundColor:'white'}}><h4 style={{marginTop: '10px', marginBottom:'10px'}}>Total Rendez-vous : <span style={{ color: '#2BB67D' }}>330</span></h4></div>
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
          <ResponsiveContainer width="50%" height={250} style={{ borderRadius: 20, backgroundColor: 'white' }}>
            <div style={{ margin: 'auto', textAlign: 'center' }}>
              <div style={{ height: '15px' }}></div>
              <h6>Nombre Visites par type d'attentes</h6>
            </div>
            <LineChartComponent />
          </ResponsiveContainer>

          {/* Ajout d'espace entre les graphiques */}
          <div style={{ width: '20px' }}></div>

          {/* BarChart */}
          <ResponsiveContainer width="50%" height={250} style={{ borderRadius: 20, backgroundColor: 'white' }}>
            <div style={{ margin: 'auto', textAlign: 'center' }}>
              <div style={{ height: '15px' }}></div>
              <h6>Nombre de Visites par Commune</h6>
            </div>
            <BarChart />
          </ResponsiveContainer>
        </div>

        {/* Ajout d'espace entre les graphiques */}
        <div style={{ height: '20px' }}></div>
      </div>

      {/* Conditionnellement afficher le Dialog */}
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
        </Dialog>
      )}

       {/* Boutons en bas de la page */}
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
        {/* Bouton pour le dashboard 1 */}
        <Button
          label="Dashboard 1"
          className="p-button-info"
          style={{ marginRight: '10px' }}
          disabled={location.pathname === '/dashboard'} // Désactiver le bouton si l'URL est '/'
        />
        {/* Bouton pour le dashboard 2 */}
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
