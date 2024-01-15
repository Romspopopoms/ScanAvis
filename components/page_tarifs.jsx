import React from 'react';
import { useCart } from '../context/CartContext'; // Assurez-vous que ce chemin est correct
import { TitleText } from './CustomTexts';
import FeatureRow from './FeatureRow';

const TarifsContent = () => {
  const { addToCart } = useCart();

  const services = [
    {
      id: 1,
      name: 'base',
      prince: 20,
      imgUrl: '/planet-01.png',
      features: [
        'Plaque PVC avec QR Code Personnalisé',
        'Augmentez Votre Visibilité Instantanément ',
        'Engagez Vos Clients Facilement',
        'Contrôlez Votre E-Réputation',
        'Améliorez Votre Référencement',
      ],
    },

    {
      id: 2,
      name: 'bronze',
      prince: 40,
      imgUrl: '/planet-02.png',
      features: [
        'Plaque PVC avec QR Code Personnalisé',
        'Augmentez Votre Visibilité Instantanément ',
        'Engagez Vos Clients Facilement',
        'Contrôlez Votre E-Réputation',
        'Améliorez Votre Référencement',
        'Collectez les adresses emails',
      ],
    },
    {
      id: 3,
      name: 'silver',
      prince: 60,
      imgUrl: '/planet-03.png',

      features: [
        'Plaque PVC avec QR Code Personnalisé',
        'Augmentez Votre Visibilité Instantanément ',
        'Engagez Vos Clients Facilement',
        'Contrôlez Votre E-Réputation',
        'Améliorez Votre Référencement',
        'Collectez les adresses emails',
        'Créez une Base de Données Précieuse',
        'Créez une Base de Données Précieuse',
        'Interface pour l’envoi de mail à votre base de donnée',
        'Renforcez le lien avec vos clients et encouragez les visites répétées',
      ],
    },
    {
      id: 4,
      name: 'gold',
      prince: 100,
      imgUrl: '/planet-04.png',
      features: [
        'Plaque PVC avec QR Code Personnalisé',
        'Augmentez Votre Visibilité Instantanément ',
        'Engagez Vos Clients Facilement',
        'Contrôlez Votre E-Réputation',
        'Améliorez Votre Référencement',
        'Collectez les adresses emails',
        'Créez une Base de Données Précieuse',
        'Créez une Base de Données Précieuse',
        'Interface pour l’envoi de mail à votre base de donnée',
        'Renforcez le lien avec vos clients et encouragez les visites répétées',
        'Personnalisation Poussée : Envoyer des offres sur-mesure qui résonnent avec chaque client.',
        'Fidélisation Accrue',
      ],
    },
  ];

  const handleAddToCart = (serviceId) => {
    const item = services.find((service) => service.id === serviceId);
    if (item) {
      addToCart({ ...item, id: serviceId, price: item.prince * 100 }); // Convertir le prix en centimes si nécessaire
      alert(`Service ${item.name} ajouté au panier`);
    }
  };

  return (
    <div>
      <TitleText
        title={(
          <>
            Voici les options disponibles
            <br className="md:block hidden" />
          </>
)}
        textStyles="text-center"
      />
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '16px' }}>
        {services.map((service) => (
          <div key={service.id} style={{ maxWidth: '250px', margin: '10px' }}>
            <img src={service.imgUrl} alt={`Service ${service.name}`} style={{ width: '100%', height: 'auto' }} />
            <div>
              {service.features.map((feature, index) => (
                <FeatureRow key={index} title={feature} imgSrc="/check.png" />
              ))}
            </div>
            <button
              type="button"
              onClick={() => handleAddToCart(service.id)}
              className="button"
            >
              Ajouter au panier
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TarifsContent;

