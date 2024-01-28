import React, { useState, useContext, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import CartSummary from './CartSummary';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navbarRef = useRef();
  const { isAuthenticated, logout } = useContext(AuthContext);

  // Logique pour basculer le menu et le panier
  const handleToggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const handleCartClick = () => setIsCartOpen(!isCartOpen); // Nouvelle fonction pour gérer le clic sur l'icône du panier

  // Menu animation variants
  const menuVariants = {
    open: { x: 0 },
    closed: { x: '-100%' },
  };

  return (
    <>
      <nav ref={navbarRef} className="fixed top-0 left-0 w-full flex justify-between items-center p-4 bg-gray-900 text-white z-50">
        <h2 className="font-extrabold text-2xl">
          <Link href="/">
            SCAN'AVIS
          </Link>
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
            <Link href="/login"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition rounded text-white"
            >
              Se connecter
            </Link>
          )}
          <div onClick={handleCartClick} className="relative cursor-pointer ml-4">
            <img src="/cart-icon.svg" alt="Cart" className="w-6 h-6" />
            {/* Ici, nous utilisons handleCartClick pour basculer la vue du panier */}
          </div>
          <button
            type="button"
            onClick={handleToggleMenu}
            className="ml-4"
            aria-label="Menu"
          >
            <img src="/menu-icon.svg" alt="Menu" className="w-6 h-6" />
          </button>
        </div>
      </nav>

      <motion.div
        initial="closed"
        animate={isMenuOpen ? 'open' : 'closed'}
        variants={menuVariants}
        className="fixed top-16 left-0 w-64 bg-gray-800 text-white shadow-xl z-40 p-5"
        // Pas besoin de style dynamique ici si le Navbar a une hauteur fixe
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <div className="mt-2"> {/* Ajouter une marge en haut pour éviter le chevauchement avec le navbar */}
          {isAuthenticated && <Link href="/mon-profil" className="block hover:text-gray-300">Mon Profil</Link>}
          <Link href="/" className="block hover:text-gray-300">Accueil</Link>
          <Link href="/tarifs" className="block hover:text-gray-300">Nos offres</Link>
        </div>
      </motion.div>

      {isCartOpen && <CartSummary />}
      {/* Plus besoin de passer toggleCart en props */}
    </>
  );
};
export default Navbar;
