import React, { useState, useContext, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import CartSummary from './CartSummary';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [navbarHeight, setNavbarHeight] = useState(0); // Définir la variable d'état pour la hauteur du navbar
  const navbarRef = useRef(); // Ref pour accéder au DOM du navbar
  const { isAuthenticated, logout } = useContext(AuthContext);

  // Mise en place d'un effet pour mettre à jour la hauteur du navbar
  useEffect(() => {
    const updateNavbarHeight = () => {
      setNavbarHeight(navbarRef.current.offsetHeight);
    };

    // Mettre à jour la hauteur lors du premier rendu
    updateNavbarHeight();

    // Ajouter un écouteur d'événement pour les changements de taille de la fenêtre
    window.addEventListener('resize', updateNavbarHeight);

    // Nettoyer l'écouteur d'événement lors du démontage
    return () => {
      window.removeEventListener('resize', updateNavbarHeight);
    };
  }, []);

  const handleToggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const menuVariants = {
    open: { x: 0 },
    closed: { x: '-100%' },
  };

  return (
    <>
      <nav ref={navbarRef} className="fixed top-0 left-0 w-full flex justify-between items-center px-4 bg-gray-900 text-white z-50">
        <h2 className="font-extrabold text-2xl">
          <Link href="/">SCAN'AVIS</Link>
        </h2>
        <div className="flex items-center">
          {isAuthenticated ? (
            <button
              type="button"
              onClick={logout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 transition rounded text-white"
              aria-label="Déconnexion"
            >
              Déconnexion
            </button>
          ) : (
            <Link href="/login" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition rounded text-white">
              Se connecter
            </Link>
          )}
          <div onClick={toggleCart} className="relative cursor-pointer ml-4">
            <img src="/cart-icon.svg" alt="Cart" className="w-6 h-6" />
          </div>
          <button
            type="button"
            onClick={handleToggleMenu}
            className="ml-4"
            aria-label="Menu"
          >
            <img src="/menu.svg" alt="Menu" className="w-6 h-6" />
          </button>
        </div>
      </nav>

      <motion.div
        initial="closed"
        animate={isMenuOpen ? 'open' : 'closed'}
        variants={menuVariants}
        className="fixed left-0 w-64 bg-gray-800 text-white shadow-xl z-40 p-5"
        style={{ top: `${navbarHeight}px` }} // Appliquer la hauteur du navbar pour le style top du sidebar
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <div className="mt-4"> {/* Ajouter une marge en haut pour éviter le chevauchement avec le navbar */}
          {isAuthenticated && <Link href="/mon-profil" className="block hover:text-gray-300">Mon Profil</Link>}
          <Link href="/" className="block hover:text-gray-300">Accueil</Link>
          <Link href="/tarifs" className="block hover:text-gray-300">Nos offres</Link>
        </div>
      </motion.div>

      {isCartOpen && (
        <CartSummary isCartOpen={isCartOpen} toggleCart={toggleCart} />
      )}
    </>
  );
};

export default Navbar;
