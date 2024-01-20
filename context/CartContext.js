import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

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

  // Fonction pour formater les cartItems pour le paiement
  // Prépare les items du panier dans le format attendu par le backend pour le paiement
  const formatCartItemsForPayment = () => cartItems.map((item) => ({
    id: item.id,
    quantity: item.quantity,
  }));

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      clearCart,
      totalPrice,
      formatCartItemsForPayment, // Exposez cette fonction pour que les composants consommateurs puissent l'utiliser
    }}
    >
      {children}
    </CartContext.Provider>
  );
};

