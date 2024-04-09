import React from 'react';
import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import { useNavigate } from 'react-router-dom';
import { kc } from '../Helpers/KeycloakHelper';

function MySideNav() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Appeler kc.logout pour déconnecter l'utilisateur
        kc.logout();
    };

    return (
        <SideNav
            onSelect={(selected) => {
                console.log(selected);
                if (selected === 'logout') {
                    // Retirer la sélection lors de la déconnexion
                    localStorage.removeItem('selectedST');
                    // Si l'élément sélectionné est "logout", effectuer la déconnexion
                    handleLogout();
                } else {
                    // Naviguer vers la route correspondante
                    navigate(selected);
                }
            }}
            className='mysidenav'
            style={{ userSelect: 'none' }}
        >
            <SideNav.Toggle />
            <SideNav.Nav defaultSelected="tableau">
                <NavItem eventKey="/">
                    <NavIcon><i className='fa fa-fw fa-home' style={{ fontSize: "1.5em" }}></i></NavIcon>
                    <NavText>Tableau</NavText>
                </NavItem>
                <NavItem eventKey="dashboard">
                    <NavIcon><i className='fa fa-fw fa-line-chart' style={{ fontSize: "1.5em" }}></i></NavIcon>
                    <NavText>Dashboard</NavText>
                </NavItem>
                <NavItem eventKey="parametres">
                    <NavIcon><i className='fa fa-fw fa-gear' style={{ fontSize: "1.5em" }}></i></NavIcon>
                    <NavText>Parametres</NavText>
                </NavItem>
                <NavItem eventKey="logout">
                    <NavIcon><i className='fa fa-fw fa-sign-out' style={{ fontSize: "1.5em" }}></i></NavIcon>
                    <NavText>Logout</NavText>
                </NavItem>
            </SideNav.Nav>
        </SideNav>
    );
}

export default MySideNav;
