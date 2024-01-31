import React, { createContext, useState, useMemo, useContext } from 'react';

const productDetails = {
  base: { name: 'Base', price: 2000, imgUrl: 'base.png', stripePlanId: 'plan_base' },
  bronze: { name: 'Bronze', price: 4000, imgUrl: 'bronze.png', stripePlanId: 'plan_bronze' },
  silver: { name: 'Silver', price: 6000, imgUrl: 'silver.png', stripePlanId: 'plan_silver' },
  gold: { name: 'Gold', price: 10000, imgUrl: 'gold.png', stripePlanId: 'plan_gold' },
};

const CartContext = createContext({
  cartItem: null,
  totalCost: 0,
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  formatCartItemForSubscription: () => null,
});

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItem, setCartItem] = useState(null);
  const [totalCost, setTotalCost] = useState(0);

  const addToCart = (newItemId) => {
    const product = productDetails[newItemId];
    if (!product) {
      console.error(`Produit non trouvé pour l'ID : ${newItemId}`);
      return;
    }
    setCartItem({
      id: newItemId,
      ...product,
    });
    setTotalCost(product.price);
  };

  const removeFromCart = () => {
    setCartItem(null);
    setTotalCost(0);
  };

  const clearCart = () => {
    setCartItem(null);
    setTotalCost(0);
  };

  const formatCartItemForSubscription = () => {
    if (!cartItem || !cartItem.stripePlanId) {
      console.error('Aucun abonnement sélectionné ou abonnement manquant stripePlanId');
      return null;
    }
    return { price: cartItem.stripePlanId };
  };

  const value = useMemo(
    () => ({
      cartItem,
      totalCost,
      addToCart,
      removeFromCart,
      clearCart,
      formatCartItemForSubscription,
    }),
    [cartItem, totalCost],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartProvider;
