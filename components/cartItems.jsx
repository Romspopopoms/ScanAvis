// Structure de données actuelle pour les produits
const products = {
  base: { name: 'base', id: 'base', price: 2000, imgUrl: 'base.png' }, // en centimes
  bronze: { name: 'bronze', id: 'bronze', price: 4000, imgUrl: 'bronze.png' }, // en centimes
  silver: { name: 'silver', id: 'silver', price: 6000, imgUrl: 'silver.png' }, // en centimes
  gold: { name: 'gold', id: 'gold', price: 10000, imgUrl: 'gold.png' }, // en centimes
};

// Exemple de données de cartItems
const cartItems = [
  { id: 'base', quantity: 2 }, // 2 articles de type 'base'
  { id: 'gold', quantity: 1 }, // 1 article de type 'gold'
];

// Fonction pour enrichir les cartItems avec les informations des produits
const enrichedCartItems = cartItems.map((item) => {
  const product = products[item.id];
  if (!product) {
    throw new Error(`Produit non trouvé pour l'ID : ${item.id}`);
  }
  return {
    id: item.id, // Assurez-vous d'inclure l'id pour correspondre au format attendu par le backend
    quantity: item.quantity,
    name: product.name,
    price: product.price, // le prix doit être en centimes pour Stripe
    imgUrl: product.imgUrl,
  };
});

export default { cartItems: enrichedCartItems };
