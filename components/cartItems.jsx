// Structure de données pour les produits
const productDetails = {
  base: { name: 'Base', price: 2000, imgUrl: 'base.png', stripePlanId: 'plan_base' },
  bronze: { name: 'Bronze', price: 4000, imgUrl: 'bronze.png', stripePlanId: 'plan_bronze' },
  silver: { name: 'Silver', price: 6000, imgUrl: 'silver.png', stripePlanId: 'plan_silver' },
  gold: { name: 'Gold', price: 10000, imgUrl: 'gold.png', stripePlanId: 'plan_gold' },
};

// Exemple de données de cartItems adaptées aux abonnements
const cartItems = [
  { id: 'base' }, // Abonnement de type 'base'
  { id: 'gold' }, // Abonnement de type 'gold'
];

// Fonction pour enrichir les cartItems avec les informations des produits et les identifiants de plan Stripe
const enrichedCartItems = cartItems.map((item) => {
  const product = productDetails[item.id];
  if (!product) {
    throw new Error(`Produit non trouvé pour l'ID : ${item.id}`);
  }
  return {
    id: item.id, // Conservez l'id sous forme de chaîne
    name: product.name,
    imgUrl: product.imgUrl,
    price: product.price, // Prix en centimes
    stripePlanId: product.stripePlanId, // Identifiant du plan Stripe pour les abonnements
  };
});

export default { cartItems: enrichedCartItems };
