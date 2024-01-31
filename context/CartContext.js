import React, { createContext, useState, useContext } from 'react';

// Détails des produits disponibles pour ajouter au panier
const productDetails = {
  base: { name: 'Base', price: 2000, imgUrl: '/base.png', stripePlanId: 'plan_base' },
  bronze: { name: 'Bronze', price: 4000, imgUrl: '/bronze.png', stripePlanId: 'plan_bronze' },
  silver: { name: 'Silver', price: 6000, imgUrl: '/silver.png', stripePlanId: 'plan_silver' },
  gold: { name: 'Gold', price: 10000, imgUrl: '/gold.png', stripePlanId: 'plan_gold' },
};

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItem, setCartItem] = useState(null);

  const addToCart = (productId) => {
    const product = productDetails[productId];
    if (product) {
      setCartItem(product);
    } else {
      console.error(`Produit non trouvé pour l'ID : ${productId}`);
    }
  };

  const removeFromCart = () => {
    setCartItem(null);
  };

  const clearCart = () => {
    setCartItem(null);
  };

  const formatCartItemForSubscription = () => {
    if (!cartItem) {
      console.error('Aucun abonnement sélectionné ou abonnement manquant stripePlanId');
      return null;
    }
    return { price: cartItem.stripePlanId };
  };

  const value = {
    cartItem,
    addToCart,
    removeFromCart,
    clearCart,
    formatCartItemForSubscription,
    productDetails,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartProvider;
