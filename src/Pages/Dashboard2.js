import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import monImage from '../images/s-a.png';
import { ResponsiveContainer } from 'recharts';
import PieChartComponent from '../Components/DashboardComponents/PieChart2';

const Dashboard2 = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedSTOption, setSelectedSTOption] = useState(null);
  const [dropdownOptions, setDropdownOptions] = useState(["aujourd'hui", "semaine", "mois"]);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [selectedState, setSelectedState] = useState(null);

  useEffect(() => {
    const savedSelectedOption = localStorage.getItem('selectedOption');
    if (savedSelectedOption) {
      setSelectedOption(savedSelectedOption);
    }
    
    const savedSelectedSTOption = localStorage.getItem('selectedSTOption');
    if (savedSelectedSTOption) {
      setSelectedSTOption(savedSelectedSTOption);
    }
  }, []);

  const formattedLastUpdate = () => {
    const now = new Date();
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return now.toLocaleDateString('fr-FR', options);
  };

  const handlePage1Click = () => {
    navigate('/dashboard');
  };

  const handleDropdownChange = (e) => {
    if (e.target && e.target.value) {
      setSelectedOption(e.target.value);
      setSelectedState(e.target.value);
      localStorage.setItem('selectedOption', e.target.value);
    }
  };

  const handleSTOptionChange = (e) => {
    if (e.target && e.target.value) {
      setSelectedSTOption(e.target.value);
      localStorage.setItem('selectedSTOption', e.target.value);
    }
  };

  const handleRefreshClick = () => {
    setIsButtonClicked(!isButtonClicked);
    window.location.reload();
  };

  return (
    <div style={{ textAlign: 'center', marginLeft: '75px' }}>
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

      <ResponsiveContainer width="60%" height={130}>
        <PieChartComponent />
      </ResponsiveContainer>

      <div style={{ height: '175px' }}></div>

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
          onClick={handlePage1Click}
        />
        <Button
          label="Dashboard 2"
          className="p-button-info"
          disabled={true}
        />
      </div>
    </div>
  );
};

export default Dashboard2;
