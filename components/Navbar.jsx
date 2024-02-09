import React, { useState, useContext, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import CartSummary from './CartSummary';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navbarRef = useRef(null);
  const [navbarHeight, setNavbarHeight] = useState(0);

  useEffect(() => {
    if (navbarRef.current) {
      setNavbarHeight(navbarRef.current.offsetHeight);
    }

    const handleResize = () => {
      if (navbarRef.current) {
        setNavbarHeight(navbarRef.current.offsetHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleToggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: '100%', opacity: 0 },
  };

  return (
    <>
      <motion.nav
        ref={navbarRef}
        className="fixed top-0 left-0 w-full flex justify-between items-center px-4 bg-purple-500 text-gray-800 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <h2 className="font-extrabold text-2xl">
          <Link href="/">SCAN'AVIS</Link>
        </h2>
        <div className="flex items-center">
          {isAuthenticated ? (
            <button
              type="button"
              onClick={logout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 transition rounded text-white"
            >
              Déconnexion
            </button>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition rounded text-white"
            >
              Se connecter
            </Link>
          )}
          <div onClick={toggleCart} className="ml-4 relative cursor-pointer">
            <img src="/cart-icon.svg" alt="Panier" className="w-6 h-6" />
          </div>
          <button type="button" onClick={handleToggleMenu} className="ml-4">
            <img src="/menu.svg" alt="Menu" className="w-6 h-6" />
          </button>
        </div>
      </motion.nav>

      <motion.div
        initial="closed"
        animate={isMenuOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
        className="fixed right-0 top-0 h-full bg-purple-500 text-gray-800 shadow-xl z-40 p-5"
        style={{ top: navbarHeight }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <div className="mt-2">
          {isAuthenticated && (
            <Link href="/mon-profil" className="block hover:text-gray-300">
              Mon Profil
            </Link>
          )}
          <Link href="/" className="block hover:text-gray-300">
            Accueil
          </Link>
          <Link href="/tarifs" className="block hover:text-gray-300">
            Nos offres
          </Link>
          {/* Autres liens du menu */}
        </div>
      </motion.div>

      {isCartOpen && (
        <CartSummary isCartOpen={isCartOpen} toggleCart={toggleCart} />
      )}
    </>
  );
};

export default Navbar;
