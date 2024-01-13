'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import netlifyIdentity from 'netlify-identity-widget';
import styles from '../styles';
import { navVariants } from '../utils/motion';

const Navbar = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    // S'assurer que la modal ne s'ouvre pas automatiquement
    netlifyIdentity.init({ autoOpen: false });

    // Mettre à jour l'état de l'utilisateur lors de la connexion/déconnexion
    netlifyIdentity.on('login', () => setIsUserMenuOpen(true));
    netlifyIdentity.on('logout', () => setIsUserMenuOpen(false));

    // Nettoyer les événements lors du démontage
    return () => {
      netlifyIdentity.off('login');
      netlifyIdentity.off('logout');
    };
  }, []);

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  return (
    <motion.nav
      variants={navVariants}
      initial="hidden"
      whileInView="show"
      className={`${styles.xPaddings} py-8 relative`}
    >
      <div
        className={`${styles.innerWidth} mx-auto flex justify-between items-center`}
      >
        <img
          src={netlifyIdentity.currentUser() ? '/user-icon.svg' : '/search.svg'}
          alt="User"
          className="w-[24px] h-[24px] object-contain cursor-pointer"
          onClick={toggleUserMenu}
        />
        <h2 className="font-extrabold text-[24px] leading-[30.24px] text-white">
          <a href="/" aria-label="Home">
            SCAN'AVIS
          </a>
        </h2>
        <img
          src="/menu.svg"
          alt="menu"
          className="w-[24px] h-[24px] object-contain"
        />
      </div>
      {isUserMenuOpen && (
        <div className="user-menu-dropdown">
          <a href="/mon-profil">Mon Profil</a>
          <a href="/mon-abonnement">Mon Abonnement</a>
          {/* Vous pouvez ajouter d'autres liens ici si nécessaire */}
        </div>
      )}
    </motion.nav>
  );
};

export default Navbar;
