// Structure de données pour les produits (doit correspondre à ce que le backend attend)
const productDetails = {
  base: { name: 'base', id: 'base', price: 2000, imgUrl: 'base.png' }, // prix en centimes pour Stripe
  bronze: { name: 'bronze', id: 'bronze', price: 4000, imgUrl: 'bronze.png' },
  silver: { name: 'silver', id: 'silver', price: 6000, imgUrl: 'silver.png' },
  gold: { name: 'gold', id: 'gold', price: 10000, imgUrl: 'gold.png' },
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
    id: item.id, // Assurez-vous d'inclure l'id pour correspondre au format attendu par le backend
    quantity: item.quantity,
    name: product.name, // Nom du produit pour l'affichage dans le frontend
    imgUrl: product.imgUrl, // URL de l'image du produit pour l'affichage dans le frontend
    price: product.price, // Prix en centimes pour le calcul du total dans le frontend et pour le backend
  };
});

export default { cartItems: enrichedCartItems };
