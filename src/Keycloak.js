import Keycloak from "keycloak-js";
const keycloak = new Keycloak({
    url: 'http://localhost:8080/',
    realm: 'RDV_RENDEZVOUS_CT',
    clientId: 'RDV_RENDEZVOUS_CT_FRONTEND',
});

export default keycloak;