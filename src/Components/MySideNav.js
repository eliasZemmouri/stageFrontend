import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, makeStyles, IconButton, Button } from '@material-ui/core';
import { Home as HomeIcon, Dashboard as DashboardIcon, Settings as SettingsIcon, Menu as MenuIcon, ExitToApp as ExitToAppIcon } from '@material-ui/icons';
import { kc } from '../Helpers/KeycloakHelper';

const drawerWidth = 73; // Largeur initiale de la barre latérale réduite
const expandedDrawerWidth = 240; // Largeur de la barre latérale lorsqu'elle est agrandie

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    transition: theme.transitions.create(['width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  drawerExpanded: {
    width: expandedDrawerWidth,
    transition: theme.transitions.create(['width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: '#00adff', // Changer la couleur de fond en bleu
    transition: theme.transitions.create(['width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  drawerPaperExpanded: {
    width: expandedDrawerWidth,
    transition: theme.transitions.create(['width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  logoutButton: {
    marginTop: 'auto',
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Fond blanc semi-transparent par défaut
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fond blanc semi-transparent plus foncé au survol
    },
  },
}));

const MySideNav = () => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);

  const toggleDrawerWidth = () => {
    setExpanded(!expanded);
  };

  const handleLogout = () => {
    console.log("Déconnexion");
    localStorage.removeItem('selectedST');
    localStorage.removeItem('dateRange');
    kc.logout();
  };

  return (
    <Drawer
      className={`${classes.drawer} ${expanded ? classes.drawerExpanded : ''}`}
      classes={{
        paper: `${classes.drawerPaper} ${expanded ? classes.drawerPaperExpanded : ''}`,
      }}
      variant="permanent"
      open={true}
    >
      <List>
        <IconButton onClick={toggleDrawerWidth}>
          <MenuIcon />
        </IconButton>
        <ListItem button component={Link} to="/" >
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          {expanded && <ListItemText primary="Home" />}
        </ListItem>
        <ListItem button component={Link} to="/dashboard">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          {expanded && <ListItemText primary="Dashboard" />}
        </ListItem>
        <ListItem button component={Link} to="/parametres">
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          {expanded && <ListItemText primary="Settings" />}
        </ListItem>
        {/* Ajoutez d'autres éléments de liste pour les routes supplémentaires */}
      </List>
      <Button
        className={classes.logoutButton}
        fullWidth
        color="black"
        variant="outlined"
        startIcon={<ExitToAppIcon />}
        onClick={handleLogout}
        >
        {/* Ne pas inclure de texte ici */}
      </Button>


    </Drawer>
  );
};

export default MySideNav;
