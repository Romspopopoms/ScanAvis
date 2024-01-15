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
  const { cartItems } = useCart(); // Plus besoin d'extraire removeFromCart ici

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

  return (
    <motion.nav
      variants={navVariants}
      initial="hidden"
      animate="show"
      className={`${styles.xPaddings} py-8 relative`}
    >
      <div
        className={`${styles.innerWidth} mx-auto flex justify-between items-center`}
      >
        <img
          src={netlifyIdentity.currentUser() ? '/user.svg' : '/search.svg'}
          alt="User"
          className="w-[24px] h-[24px] object-contain cursor-pointer"
          onClick={toggleUserMenu}
        />
        <h2 className="font-extrabold text-[24px] leading-[30.24px] text-white">
          <a href="/" aria-label="Home">
            SCAN'AVIS
          </a>
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
        {isUserMenuOpen && (
          <div className="user-menu-dropdown">
            <button type="button" className="button">
              <a href="/mon-profil">Mon Profil</a>
            </button>
            <a href="/mon-abonnement">Mon Abonnement</a>
          </div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
