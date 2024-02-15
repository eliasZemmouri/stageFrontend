// helpers/keycloakHelper.js
import Keycloak from 'keycloak-js';

let initOptions = {
    url: 'http://localhost:8080/auth',
    realm: 'react-app',
    clientId: 'react-client',
  };
  
let kc = new Keycloak(initOptions);

const initKeycloak =
    kc.init
    ({
        onLoad: 'login-required',
        checkLoginIframe: true,
        pkceMethod: 'S256',
    });

export { initKeycloak, kc };
