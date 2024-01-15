import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import netlifyIdentity from 'netlify-identity-widget';
import styles from '../styles';
import { navVariants } from '../utils/motion';
import { useCart } from '../context/CartContext';
import CartSummary from './CartSummary';

const Navbar = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const router = useRouter();
  const { cartItems } = useCart();
  const user = netlifyIdentity.currentUser();

  useEffect(() => {
    netlifyIdentity.init({ autoOpen: false });
    netlifyIdentity.on('login', () => setIsUserMenuOpen(true));
    netlifyIdentity.on('logout', () => setIsUserMenuOpen(false));

    return () => {
      netlifyIdentity.off('login');
      netlifyIdentity.off('logout');
    };
  }, []);

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleCheckout = () => {
    router.push('/paiement');
  };

  const handleLogout = () => {
    netlifyIdentity.logout();
    setIsUserMenuOpen(false);
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
        {user ? (
          <img
            src="/user.svg"
            alt="User"
            className="w-[24px] h-[24px] object-contain cursor-pointer"
            onClick={toggleUserMenu}
          />
        ) : (
          <button type="button" onClick={handleLogin}>Connexion</button>
        )}
        <h2 className="font-extrabold text-[24px] leading-[30.24px] text-white">
          <a href="/" aria-label="Home">SCAN'AVIS</a>
        </h2>
        <div
          onMouseEnter={() => setIsCartOpen(true)}
          onMouseLeave={() => setIsCartOpen(false)}
          className="cart-container"
        >
          <img
            src="/cart-icon.svg"
            alt="Cart"
            className="w-[24px] h-[24px] object-contain cursor-pointer"
            onClick={() => setIsCartOpen(!isCartOpen)}
          />
          {isCartOpen && (
            <div className="cart-dropdown">
              <CartSummary />
              {cartItems.length > 0 && (
                <button
                  type="button"
                  className="checkout-btn"
                  onClick={handleCheckout}
                >
                  Valider la Commande
                </button>
              )}
            </div>
          )}
        </div>
        {isUserMenuOpen && user && (
          <div className="user-menu-dropdown">
            <button type="button" className="button">
              <a href="/mon-profil">Mon Profil</a>
            </button>
            <a href="/mon-abonnement">Mon Abonnement</a>
            <button type="button" className="button" onClick={handleLogout}>
              Déconnexion
            </button>
          </div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
