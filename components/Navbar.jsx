import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import netlifyIdentity from 'netlify-identity-widget';
import styles from '../styles';
import { navVariants } from '../utils/motion';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const router = useRouter();
  const { cartItems } = useCart();
  const user = netlifyIdentity.currentUser();

  useEffect(() => {
    netlifyIdentity.init({ autoOpen: false });
    netlifyIdentity.on('login', () => {});
    netlifyIdentity.on('logout', () => {});

    return () => {
      netlifyIdentity.off('login');
      netlifyIdentity.off('logout');
    };
  }, []);

  const handleCheckout = () => {
    router.push('/paiement');
  };

  const handleLogout = () => {
    netlifyIdentity.logout();
  };

  const handleLogin = () => {
    netlifyIdentity.open('login');
  };

  return (
    <motion.nav
      variants={navVariants}
      initial="hidden"
      animate="show"
      className={`${styles.xPaddings} py-8 relative`}
    >
      <div className={`${styles.innerWidth} mx-auto flex justify-between items-center`}>
        <h2 className="font-extrabold text-[24px] leading-[30.24px] text-white">
          <a href="/" aria-label="Home">SCAN'AVIS</a>
        </h2>
        {user ? (
          <button type="button" onClick={handleLogout}>Déconnexion</button>
        ) : (
          <button type="button" onClick={handleLogin}>Connexion</button>
        )}
        <div
          onMouseEnter={() => setIsCartOpen(true)}
          onMouseLeave={() => setIsCartOpen(false)}
          className="cart-container"
        >
          <img
            src="/cart-icon.svg"
            alt="Cart"
            className="w-[24px] h-[24px] object-contain cursor-pointer"
          />
          {isCartOpen && cartItems.length > 0 && (
            <button
              type="button"
              className="checkout-btn"
              onClick={handleCheckout}
            >
              Valider la Commande
            </button>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
