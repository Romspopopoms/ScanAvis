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
    <div className="bg-gradient-to-r from-purple-600 to-blue-400 min-h-screen py-8 px-4">
      <h2 className="text-center text-4xl font-extrabold text-white mb-12">
        Voici les options disponibles
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-white rounded-lg shadow overflow-hidden">
            <img src={service.imgUrl} alt={`Service ${service.name}`} className="w-full" />
            <div className="p-4 space-y-2"> {/* Add spacing between feature rows */}
              {service.features.map((feature, index) => (
                <FeatureRow key={index} title={feature} imgSrc="/check.png" />
              ))}
            </div>
            <button
              type="button"
              onClick={() => handleAddToCart(service.id)}
              className="bg-green-500 text-white text-sm px-4 py-2 rounded hover:bg-green-600 transition-colors duration-300 w-full"
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

