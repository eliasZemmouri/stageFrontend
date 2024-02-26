// helpers/keycloakHelper.js
import Keycloak from 'keycloak-js';

let initOptions = {
    url: 'http://localhost:8180/',
    realm: 'RDV_RENDEZVOUS_CT',
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
