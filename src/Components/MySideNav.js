import SideNav, { Toggle,NavItem,NavIcon,NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import { useNavigate } from 'react-router-dom';

function MySideNav(){
    const navigate= useNavigate();
    return (
    <SideNav
        onSelect={(selected)=>{
            console.log(selected);
            navigate('/'+selected);
        }}
        className='mysidenav'
        >
            <SideNav.Toggle />
            <SideNav.Nav defaultSelected="home">
                <NavItem eventKey="tableau">
                    <NavIcon><i className='fa fa-fw fa-columns' style={{fontSize:"1.5em"}}></i></NavIcon>
                    <NavText>Tableau</NavText>
                </NavItem>
                <NavItem eventKey="dashboard">
                    <NavIcon><i className='fa fa-fw fa-line-chart' style={{fontSize:"1.5em"}}></i></NavIcon>
                    <NavText>Dashboard</NavText>
                </NavItem>
                <NavItem eventKey="parametres">
                    <NavIcon><i className='fa fa-fw fa-gear' style={{fontSize:"1.5em"}}></i></NavIcon>
                    <NavText>Parametres</NavText>
                </NavItem>
                <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)' }}>
                    <NavItem eventKey="logout">
                        <NavIcon><i className='fa fa-fw fa-sign-out' style={{ fontSize: "1.5em" }}></i></NavIcon>
                        <NavText>Logout</NavText>
                    </NavItem>
                </div>
            </SideNav.Nav>
        </SideNav>
    );
}

export default MySideNav;