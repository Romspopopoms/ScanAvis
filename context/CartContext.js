import React, { createContext, useState, useContext } from 'react';

// Détails des produits disponibles pour ajouter au panier
const productDetails = {
  base: {
    id: 'base',
    name: 'Base',
    price: 'price_1OekFIDWmnYPaxs1hMaRWF4X',
    imgUrl: '/planet-01.png',
    stripePlanId: '"prod_PThekMi7OB5KkH"',
    features: [
      'Plaque PVC avec QR Code Personnalisé',
      'Augmentez Votre Visibilité Instantanément',
      'Contrôlez Votre E-Réputation',
      'Améliorez Votre Référencement',
    ] },
  bronze: {
    id: 'bronze',
    name: 'Bronze',
    price: 'price_1OekKWDWmnYPaxs1W80kG5a0',
    imgUrl: '/planet-02.png',
    stripePlanId: 'prod_PThkckUFRUVnCj',
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
    price: 'price_1Oel3hDWmnYPaxs1k69X7veu',
    imgUrl: '/planet-03.png',
    stripePlanId: 'prod_PTiU9653SZEkkH',
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
    price: 'price_1Oel3hDWmnYPaxs1icztOYwU',
    imgUrl: '/planet-04.png',
    stripePlanId: 'prod_PTiUNcfl970gAj',
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

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItem, setCartItem] = useState(null);

  const addToCart = (productId) => {
    const product = productDetails[productId];
    if (product) {
      setCartItem(product); // Ici, 'product' est déjà l'objet contenant tous les détails
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
    // Assurez-vous que cette ligne renvoie bien l'objet avec stripePlanId
    return { price: cartItem.stripePlanId };
  };

  const value = {
    cartItem,
    addToCart,
    removeFromCart,
    clearCart,
    formatCartItemForSubscription,
    productDetails, // Ajouté pour accéder aux détails des produits dans les composants
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartProvider;
