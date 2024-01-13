// pages/tarifs.js
import { TitleText } from './CustomTexts';
import FeatureRow from './FeatureRow';

const TarifsContent = () => {
  const services = [
    {
      id: 1,
      imgUrl: '/planet-01.png',
      features: ['Plaque PVC avec QR Code Personnalisé', 'Augmentez Votre Visibilité Instantanément ', 'Engagez Vos Clients Facilement', 'Contrôlez Votre E-Réputation', 'Améliorez Votre Référencement'],
    },
    {
      id: 2,
      imgUrl: '/planet-02.png',
      features: ['Plaque PVC avec QR Code Personnalisé', 'Augmentez Votre Visibilité Instantanément ', 'Engagez Vos Clients Facilement', 'Contrôlez Votre E-Réputation', 'Améliorez Votre Référencement', 'Collectez les adresses emails'],
    },
    {
      id: 3,
      imgUrl: '/planet-03.png',

      features: ['Plaque PVC avec QR Code Personnalisé', 'Augmentez Votre Visibilité Instantanément ', 'Engagez Vos Clients Facilement', 'Contrôlez Votre E-Réputation', 'Améliorez Votre Référencement', 'Collectez les adresses emails', 'Créez une Base de Données Précieuse', 'Créez une Base de Données Précieuse', 'Interface pour l’envoi de mail à votre base de donnée', 'Renforcez le lien avec vos clients et encouragez les visites répétées'],
    },
    {
      id: 4,
      imgUrl: '/planet-04.png',
      features: ['Plaque PVC avec QR Code Personnalisé', 'Augmentez Votre Visibilité Instantanément ', 'Engagez Vos Clients Facilement', 'Contrôlez Votre E-Réputation', 'Améliorez Votre Référencement', 'Collectez les adresses emails', 'Créez une Base de Données Précieuse', 'Créez une Base de Données Précieuse', 'Interface pour l’envoi de mail à votre base de donnée', 'Renforcez le lien avec vos clients et encouragez les visites répétées', 'Personnalisation Poussée : Envoyer des offres sur-mesure qui résonnent avec chaque client.', 'Fidélisation Accrue'],
    },
  ];

  return (
    <div>
      <TitleText
        title={<> Voici les options disponibles<br className="md:block hidden" /></>}
        textStyles="text-center"
      />
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '16px' }}>
        {services.map((service) => (
          <div key={service.id} style={{ maxWidth: '250px', margin: '10px' }}>
            <img src={service.imgUrl} alt={`Service ${service.id}`} style={{ width: '100%', height: 'auto' }} />
            <p>{service.description}</p>
            <div>
              {service.features.map((feature, index) => (

                <FeatureRow key={index} title={feature} imgSrc="/check.png" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default TarifsContent;
