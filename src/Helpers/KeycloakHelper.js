// helpers/keycloakHelper.js
import Keycloak from 'keycloak-js';

let initOptions = {
    url: 'http://192.168.110.208:8080/',
    realm: 'RDV_RENDEZVOUS_CT',
    clientId: 'react-client',
    'enable-cors': true,
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
