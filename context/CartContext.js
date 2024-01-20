import React, { createContext, useState, useMemo, useContext } from 'react';

// Création du contexte avec une valeur par défaut
const CartContext = createContext({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  totalPrice: 0,
  formatCartItemsForPayment: () => {},
});

// Utilisation d'un hook personnalisé pour accéder au contexte
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (newItem) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === newItem.id);
      if (existingItem) {
        // Augmenter la quantité si l'article existe déjà dans le panier
        return prevItems.map((item) => (item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      // Ajouter un nouvel article
      return [...prevItems, { ...newItem, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const formatCartItemsForPayment = () => cartItems.map((item) => ({
    id: item.id,
    quantity: item.quantity,
  }));

  // Mémorisation des valeurs du contexte
  const value = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    totalPrice,
    formatCartItemsForPayment,
  }), [cartItems, totalPrice]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
