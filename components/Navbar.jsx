import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import CartSummary from './CartSummary';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { isAuthenticated, logout } = useContext(AuthContext);

  const handleToggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const menuVariants = {
    open: { x: 0 },
    closed: { x: '-100%' },
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-4 bg-gray-900 text-white z-50">
        <h2 className="font-extrabold text-2xl">
          <Link href="/">SCAN'AVIS</Link>
        </h2>
        <div className="flex items-center">
          {isAuthenticated ? (
            // Bouton de déconnexion
            <button
              type="button"
              onClick={logout}
              style={{ cursor: 'pointer' }}
              aria-label="Déconnexion"
            >
              Déconnexion
            </button>
          ) : (
            <>
              <button
                type="button"
                style={{ cursor: 'pointer' }}
                aria-label="Se connecter"
              />
              <Link href="/login">Se connecter</Link>
            </>
          )}
          <div onClick={toggleCart} className="relative cursor-pointer ml-4">
            <img
              src="/cart-icon.svg"
              alt="Cart"
              style={{ width: '24px', height: '24px' }}
            />
            {/* Afficher le nombre d'articles ici si nécessaire */}
          </div>
          <button
            type="button"
            onClick={handleToggleMenu}
            className="ml-4"
            aria-label="Menu"
          >
            <img
              src="/menu.svg"
              alt="Menu"
              style={{ width: '24px', height: '24px' }}
            />
          </button>
        </div>
        <motion.div
          initial="closed"
          animate={isMenuOpen ? 'open' : 'closed'}
          variants={menuVariants}
          className="fixed top-0 left-0 w-[250px] h-full bg-gray-800 shadow-lg z-40"
        >
          <button type="button" onClick={handleToggleMenu} aria-label="Fermer">
            Fermer
          </button>
          {isAuthenticated && <Link href="/mon-profil">Mon Profil</Link>}
          <Link href="/">Accueil</Link>
          <Link href="/tarifs">Nos offres</Link>
        </motion.div>
      </nav>

      {isCartOpen && (
        <CartSummary isCartOpen={isCartOpen} toggleCart={toggleCart} />
      )}
    </>
  );
};

export default Navbar;
