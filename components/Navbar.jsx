import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import netlifyIdentity from 'netlify-identity-widget';
import styles from '../styles';
import { navVariants } from '../utils/motion';

const Navbar = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
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
