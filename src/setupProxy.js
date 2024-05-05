// my-react-app/src/setupProxy.js
//A l'execution  de ce fichier, react lancera ce fichier pour  rediriger les appels à des API vers le serveur indiqué
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',  // Définissez le chemin de l'API Spring Boot
    createProxyMiddleware({
      target: 'http://localhost:9005',  // URL de l'API Spring Boot
      changeOrigin: true,
    })
  );
};
