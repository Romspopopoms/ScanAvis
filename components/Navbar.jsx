import React, { useState, useContext, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import CartSummary from './CartSummary';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const navbarRef = useRef();
  const { isAuthenticated, logout } = useContext(AuthContext);

  const handleToggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const menuVariants = {
    open: { x: 0 },
    closed: { x: '-100%' },
  };

  useEffect(() => {
    if (navbarRef.current) {
      setNavbarHeight(navbarRef.current.offsetHeight);
    }
  }, [navbarRef]);

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
        style={{ top: `${navbarHeight}px` }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <div className="flex justify-end -mt-12 mr-4">
          <button
            type="button"
            onClick={handleToggleMenu}
            className="text-white"
            aria-label="Fermer"
          >
            <img src="/iconarrow.png" alt="Fermer" className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4">
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
