const stripe = require('stripe')('sk_test_51OPtGvDWmnYPaxs1DJZliUMMDttrNP1a4usU0uBgZgjnfe4Ho3WuCzFivSpwXhqL0YgVl9c41lbsuHI1O4nHAUhz00ibE6rzPX');

const productDetails = {
  base: {
    id: 'base',
    name: 'Base',
    price: 2000,
    imgUrl: '/planet-01.png',
    stripePlanId: 'plan_base',
    features: [
      'Plaque PVC avec QR Code Personnalisé',
      'Augmentez Votre Visibilité Instantanément',
      'Contrôlez Votre E-Réputation',
      'Améliorez Votre Référencement',
    ],
  },
  bronze: {
    id: 'bronze',
    name: 'Bronze',
    price: 4000,
    imgUrl: '/planet-02.png',
    stripePlanId: 'plan_bronze',
    features: [
      'Plaque PVC avec QR Code Personnalisé',
      'Augmentez Votre Visibilité Instantanément ',
      'Engagez Vos Clients Facilement',
      'Contrôlez Votre E-Réputation',
      'Améliorez Votre Référencement',
      'Collectez les adresses emails',
    ],
  },
  silver: {
    id: 'silver',
    name: 'Silver',
    price: 6000,
    imgUrl: '/planet-03.png',
    stripePlanId: 'plan_silver',
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
  gold: {
    id: 'gold',
    name: 'Gold',
    price: 10000,
    imgUrl: '/planet-04.png',
    stripePlanId: 'plan_gold',
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
};

async function createStripeProductsAndPrices() {
  try {
    const keys = Object.keys(productDetails);

    await keys.reduce(async (previousPromise, key) => {
      await previousPromise; // attendre que la promesse précédente soit résolue

      const product = productDetails[key];

      // Création d'un produit Stripe
      const stripeProduct = await stripe.products.create({
        name: product.name,
        description: product.features.join(', '),
      });

      // Création d'un plan de tarification pour le produit
      await stripe.prices.create({
        unit_amount: product.price,
        currency: 'eur', // ou 'usd' ou toute autre devise selon vos besoins
        recurring: { interval: 'month' }, // ou 'year', selon votre modèle d'abonnement
        product: stripeProduct.id,
      });

      console.log(`Produit Stripe créé: ${stripeProduct.name}`);
    }, Promise.resolve()); // initialiser avec une promesse résolue
  } catch (error) {
    console.error('Erreur lors de la création des produits Stripe:', error);
  }
}

createStripeProductsAndPrices();

