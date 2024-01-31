import React, { createContext, useState, useContext } from 'react';

// Détails des produits disponibles pour ajouter au panier
const productDetails = {
  base: {
    id: 'base',
    name: 'Base',
    price: 2000,
    imgUrl: '/base.png',
    stripePlanId: 'plan_base',
    features: [
      'Plaque PVC avec QR Code Personnalisé',
      'Augmentez Votre Visibilité Instantanément',
      'Contrôlez Votre E-Réputation',
      'Améliorez Votre Référencement',
    ] },
  bronze: {
    id: 'bronze',
    name: 'Bronze',
    price: 4000,
    imgUrl: '/bronze.png',
    stripePlanId: 'plan_bronze',
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
    price: 6000,
    imgUrl: '/silver.png',
    stripePlanId: 'plan_silver',
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
    price: 10000,
    imgUrl: '/gold.png',
    stripePlanId: 'plan_gold',
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
    productDetails, // Ajouté pour accéder aux détails des produits dans les composants
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartProvider;
