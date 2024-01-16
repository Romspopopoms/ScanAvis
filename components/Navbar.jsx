import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import netlifyIdentity from 'netlify-identity-widget';
import Link from 'next/link';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = netlifyIdentity.currentUser();

  useEffect(() => {
    netlifyIdentity.init();
  }, []);

  const handleLogin = () => {
    netlifyIdentity.open('login');
  };

  const handleLogout = () => {
    netlifyIdentity.logout();
  };

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Variants pour l'animation du menu
  const menuVariants = {
    open: { x: 0 },
    closed: { x: '-100%' },
  };

  return (
    <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-4 bg-gray-900 text-white z-50">
      <h2 className="font-extrabold text-2xl">
        <Link href="/">
          SCAN'AVIS
        </Link>
      </h2>
      <div className="flex items-center">
        {user ? (
          <button type="button" onClick={handleLogout} className="mr-4">
            Déconnexion
          </button>
        ) : (
          <button type="button" onClick={handleLogin}>
            Connexion
          </button>
        )}
        <button type="button" onClick={handleToggleMenu} className="ml-4">
          Menu
        </button>
      </div>
      <motion.div
        initial={false}
        animate={isMenuOpen ? 'open' : 'closed'}
        variants={menuVariants}
        className="fixed top-0 left-0 w-[250px] h-full bg-gray-800 shadow-lg z-40"
      >
        <nav className="flex flex-col">
          <button
            type="button"
            onClick={handleToggleMenu}
            className="text-right px-4 py-2"
          >
            Fermer
          </button>
          {user && (
          <Link href="/mon-profil" className="px-4 py-2 hover:bg-gray-700">
            Mon Profil
          </Link>
          )}
          <Link href="/" className="px-4 py-2 hover:bg-gray-700">
            Accueil
          </Link>
          <Link href="/tarifs" className="px-4 py-2 hover:bg-gray-700">
            Nos offres
          </Link>
        </nav>
      </motion.div>

    </nav>
  );
};
export default Navbar;
