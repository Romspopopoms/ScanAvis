import React from 'react';
import { useCart } from '../context/CartContext'; // Assurez-vous que ce chemin est correct
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
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-center text-4xl font-extrabold text-white mb-10">
        Voici les options disponibles
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-white rounded-lg shadow-xl p-5 flex flex-col items-center">
            <img src={service.imgUrl} alt={`Service ${service.name}`} className="w-32 h-32 object-cover" />
            <ul className="my-4">
              {service.features.map((feature, index) => (
                <FeatureRow key={index} title={feature} imgSrc="/check.png" />
              ))}
            </ul>
            <button
              type="button"
              onClick={() => handleAddToCart(service.id)}
              className="bg-blue-500 text-white text-sm px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300 w-full"
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

