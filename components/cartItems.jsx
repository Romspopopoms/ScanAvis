// Supposons que cet objet est votre structure de données actuelle pour les produits
const products = {
  base: { name: 'base', id: 'base', price: 20, imgUrl: 'base.png' },
  bronze: { name: 'bronze', id: 'bronze', price: 40, imgUrl: 'bronze.png' },
  silver: { name: 'silver', id: 'silver', price: 60, imgUrl: 'silver.png' },
  gold: { name: 'gold', id: 'gold', price: 100, imgUrl: 'gold.png' },
};

// Exemple de données de cartItems
const cartItems = [
  { id: 'base', quantity: 2 }, // 2 articles de type 'base'
  { id: 'gold', quantity: 1 }, // 1 article de type 'gold'
];

// Fonction pour enrichir les cartItems avec les informations des produits
const enrichedCartItems = cartItems.map((item) => {
  const product = products[item.id];
  return {
    ...item,
    name: product.name,
    price: product.price,
    imgUrl: product.imgUrl,
  };
});

export default { cartItems: enrichedCartItems };

