import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

// Détails des produits disponibles pour ajouter au panier
const productDetails = {
  base: {
    id: 'base',
    name: 'Base',
    priceId: 'price_1OekFIDWmnYPaxs1hMaRWF4X',
    imgUrl: '/planet-01.png',
    productId: 'prod_PThekMi7OB5KkH',
    features: [
      'Plaque PVC avec QR Code Personnalisé',
      'Augmentez Votre Visibilité Instantanément',
      'Contrôlez Votre E-Réputation',
      'Améliorez Votre Référencement',
    ] },
  bronze: {
    id: 'bronze',
    name: 'Bronze',
    priceId: 'price_1OekKWDWmnYPaxs1W80kG5a0',
    imgUrl: '/planet-02.png',
    productId: 'prod_PThkckUFRUVnCj',
    features: [
      'Plaque PVC avec QR Code Personnalisé',
      'Augmentez Votre Visibilité Instantanément ',
      'Engagez Vos Clients Facilement',
      'Contrôlez Votre E-Réputation',
      'Améliorez Votre Référencement',
      'Collectez les adresses emails',
    ] },
  silver: {
    id: 'silver',
    name: 'Silver',
    priceId: 'price_1Oel3hDWmnYPaxs1k69X7veu',
    imgUrl: '/planet-03.png',
    productId: 'prod_PTiU9653SZEkkH',
    features: [
      'Plaque PVC avec QR Code Personnalisé',
      'Augmentez Votre Visibilité Instantanément ',
      'Engagez Vos Clients Facilement',
      'Contrôlez Votre E-Réputation',
      'Améliorez Votre Référencement',
      'Collectez les adresses emails',
      'Créez une Base de Données Précieuse',
      'Créez une Base de Données Précieuse',
      'Interface pour l’envoi de mail à votre base de donnée',
      'Renforcez le lien avec vos clients et encouragez les visites répétées',
    ] },
  gold: {
    id: 'gold',
    name: 'Gold',
    priceId: 'price_1Oel3hDWmnYPaxs1icztOYwU',
    imgUrl: '/planet-04.png',
    productId: 'prod_PTiUNcfl970gAj',
    features: [
      'Plaque PVC avec QR Code Personnalisé',
      'Augmentez Votre Visibilité Instantanément ',
      'Engagez Vos Clients Facilement',
      'Contrôlez Votre E-Réputation',
      'Améliorez Votre Référencement',
      'Collectez les adresses emails',
      'Créez une Base de Données Précieuse',
      'Créez une Base de Données Précieuse',
      'Interface pour l’envoi de mail à votre base de donnée',
      'Renforcez le lien avec vos clients et encouragez les visites répétées',
      'Personnalisation Poussée : Envoyer des offres sur-mesure qui résonnent avec chaque client.',
      'Fidélisation Accrue',
    ] },
};

const CartProvider = ({ children }) => {
  const [cartItem, setCartItem] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Charger l'état initial du panier depuis localStorage uniquement côté client
  useEffect(() => {
    const savedItem = localStorage.getItem('cartItem');
    if (savedItem) {
      setCartItem(JSON.parse(savedItem));
    }
  }, []);

  // Sauvegarder l'état du panier dans localStorage à chaque modification de cartItem
  useEffect(() => {
    localStorage.setItem('cartItem', JSON.stringify(cartItem));
  }, [cartItem]);

  const addToCart = (productId) => {
    const product = productDetails[productId];
    if (product) {
      setCartItem(product);
    } else {
      console.error(`Produit non trouvé pour l'ID: ${productId}`);
    }
  };

  const removeFromCart = () => {
    setCartItem(null);
  };

  const clearCart = () => {
    setCartItem(null);
  };

  const value = {
    cartItem,
    addToCart,
    removeFromCart,
    clearCart,
    isCartOpen,
    setIsCartOpen,
    productDetails,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartProvider;
