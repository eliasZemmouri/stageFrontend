import React from 'react';
import monImage from '../images/s-a.png'

const HomePage = () => {
  return (
    <div style={{ marginLeft: '75px' }}>
       <img src={monImage} style={{ maxWidth: '100%', height: 'auto', width: '150px'}} /> 
      <header>
        <h1>SecuriteAutomobile.be</h1>
        <p>Bienvenue sur notre plateforme dédiée à la sécurité automobile.</p>
      </header>
      <main>
        <section>
          <h2>À propos de nous</h2>
          <p>
            SecuriteAutomobile.be s'engage à promouvoir la sécurité sur les routes et à fournir des informations
            essentielles pour les conducteurs et les passionnés d'automobile.
          </p>
        </section>

        <section>
          <h2>Nos Services</h2>
          <ul>
            <li>Conseils en sécurité routière</li>
            <li>Informations sur les réglementations automobiles</li>
            <li>Actualités et tendances du secteur automobile</li>
            {/* Ajoutez d'autres services selon les besoins */}
          </ul>
        </section>

        <section>
          <h2>Contactez-nous</h2>
          <p>
            Pour toute question ou assistance, n'hésitez pas à nous contacter :
          </p>
          <ul>
            <li>Email: info@securiteautomobile.be</li>
            <li>Téléphone: +XX XXX XXX XXX</li>
            {/* Ajoutez d'autres informations de contact si nécessaire */}
          </ul>
        </section>
      </main>
      <footer>
        <p>&copy; 2024 SecuriteAutomobile.be. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default HomePage;
