import React, { createContext, useState, useMemo, useContext } from 'react';

const CartContext = createContext({
  cartItems: [],
  totalCost: 0, // Coût total pour les abonnements
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  formatCartItemsForSubscription: () => [],
});

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalCost, setTotalCost] = useState(0);

  const updateTotalCost = () => {
    const newTotalCost = cartItems.reduce((total, item) => total + item.price, 0);
    setTotalCost(newTotalCost);
  };

  const addToCart = (newItem) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((item) => item.id === newItem.id);
      if (existingItemIndex === -1) {
        // Si l'abonnement n'est pas déjà dans le panier, ajoutez-le
        const updatedItems = [...prevItems, newItem];
        updateTotalCost(); // Mettre à jour le coût total
        return updatedItems;
      }
      // Optionnel : Gérer la mise à jour de la quantité ici si nécessaire
      return prevItems;
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item.id !== itemId);
      updateTotalCost(); // Mettre à jour le coût total
      return updatedItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setTotalCost(0);
  };

  const formatCartItemsForSubscription = () => cartItems.map((item) => {
    if (!item.stripePlanId) {
      console.error('Item missing stripePlanId:', item);
      throw new Error('All cart items must have a valid stripePlanId');
    }
    return { price: item.stripePlanId };
  });

  const value = useMemo(
    () => ({
      cartItems,
      totalCost,
      addToCart,
      removeFromCart,
      clearCart,
      formatCartItemsForSubscription,
    }),
    [cartItems, totalCost],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartProvider;
