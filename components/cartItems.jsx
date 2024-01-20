// Structure de données pour les produits
const productDetails = {
  base: { name: 'Base', price: 2000, imgUrl: 'base.png' },
  bronze: { name: 'Bronze', price: 4000, imgUrl: 'bronze.png' },
  silver: { name: 'Silver', price: 6000, imgUrl: 'silver.png' },
  gold: { name: 'Gold', price: 10000, imgUrl: 'gold.png' },
};

// Exemple de données de cartItems
const cartItems = [
  { id: 'base', quantity: 2 }, // 2 articles de type 'base'
  { id: 'gold', quantity: 1 }, // 1 article de type 'gold'
];

// Fonction pour enrichir les cartItems avec les informations des produits
const enrichedCartItems = cartItems.map((item) => {
  const product = productDetails[item.id];
  if (!product) {
    throw new Error(`Produit non trouvé pour l'ID : ${item.id}`);
  }
  return {
    id: item.id, // Conservez l'id sous forme de chaîne
    quantity: item.quantity,
    name: product.name,
    imgUrl: product.imgUrl,
    price: product.price, // Prix en centimes
  };
});

export default { cartItems: enrichedCartItems };
