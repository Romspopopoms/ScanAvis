import React, { createContext, useState, useMemo, useContext } from 'react';

// Détails des produits disponibles pour l'abonnement
const productDetails = {
  base: { name: 'Base', price: 2000, imgUrl: 'base.png', stripePlanId: 'plan_base' },
  bronze: { name: 'Bronze', price: 4000, imgUrl: 'bronze.png', stripePlanId: 'plan_bronze' },
  silver: { name: 'Silver', price: 6000, imgUrl: 'silver.png', stripePlanId: 'plan_silver' },
  gold: { name: 'Gold', price: 10000, imgUrl: 'gold.png', stripePlanId: 'plan_gold' },
};

const CartContext = createContext({
  abonnement: null,
  total: 0,
  ajouterAuPanier: () => {},
  retirerDuPanier: () => {},
  viderLePanier: () => {},
  preparerAbonnementPourStripe: () => {},
});

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [abonnement, setAbonnement] = useState(null);
  const [total, setTotal] = useState(0);

  const ajouterAuPanier = (id) => {
    const detailAbonnement = productDetails[id];
    if (detailAbonnement) {
      setAbonnement(detailAbonnement);
      setTotal(detailAbonnement.price);
    } else {
      console.error(`Abonnement non trouvé pour l'ID: ${id}`);
    }
  };

  const retirerDuPanier = () => {
    setAbonnement(null);
    setTotal(0);
  };

  const viderLePanier = () => {
    setAbonnement(null);
    setTotal(0);
  };

  const preparerAbonnementPourStripe = () => (abonnement ? { price: abonnement.stripePlanId } : null);

  const value = useMemo(() => ({
    abonnement,
    total,
    ajouterAuPanier,
    retirerDuPanier,
    viderLePanier,
    preparerAbonnementPourStripe,
  }), [abonnement, total]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartProvider;
