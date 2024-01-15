import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import netlifyIdentity from 'netlify-identity-widget';
import { useCart } from '../context/CartContext';
import CartSummary from './CartSummary';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { cartItems } = useCart();
  const user = netlifyIdentity.currentUser();

  const handleLogout = () => {
    netlifyIdentity.logout();
    setIsOpen(false);
  };

  const handleCheckout = () => {
    router.push('/paiement');
    setIsOpen(false);
  };

  // Animation variants for the sidebar
  const sidebarVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
    closed: {
      x: '-100%',
      opacity: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <motion.aside
      variants={sidebarVariants}
      initial="closed"
      animate={isOpen ? 'open' : 'closed'}
      className={`sidebar ${isOpen ? 'open' : 'closed'}`}
    >
      <button type="button" onClick={() => setIsOpen(!isOpen)}>Menu</button>
      {user ? (
        <div>
          <a href="/mon-profil">Mon Profil</a>
          <a href="/mon-abonnement">Mon Abonnement</a>
          <button type="button" onClick={handleLogout}>Déconnexion</button>
        </div>
      ) : (
        <button type="button" onClick={() => netlifyIdentity.open('login')}>Connexion</button>
      )}
      <CartSummary />
      {cartItems.length > 0 && (
        <button type="button" onClick={handleCheckout}>Valider la Commande</button>
      )}
      {/* Ajoutez ici d'autres liens de navigation si nécessaire */}
    </motion.aside>
  );
};

export default Sidebar;
