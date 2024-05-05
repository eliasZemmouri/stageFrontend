import Keycloak from "keycloak-js";
//192.168.110.208
const keycloak = new Keycloak({
    url: 'http://localhost:8180/',
    realm: 'RDV_RENDEZVOUS_CT',
    clientId: 'RDV_RENDEZVOUS_CT_FRONTEND',
});

export default keycloak;