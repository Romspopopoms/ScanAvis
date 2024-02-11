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
    const updateNavbarHeight = () => {
      setNavbarHeight(navbarRef.current?.offsetHeight || 0);
    };

    window.addEventListener('resize', updateNavbarHeight);
    updateNavbarHeight(); // Initial call to set the navbar height

    return () => {
      window.removeEventListener('resize', updateNavbarHeight);
    };
  }, []);

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isCartOpen) setIsCartOpen(false);
  };
  const handleToggleCart = () => {
    setIsCartOpen(!isCartOpen);
    if (isMenuOpen) setIsMenuOpen(false);
  };

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '100%' },
  };

  return (
    <>
      <motion.nav
        ref={navbarRef}
        className="fixed top-0 left-0 w-full flex justify-between items-center px-6 py-3 bg-opacity-90 backdrop-filter backdrop-blur-lg bg-white/30 text-gray-800 z-50 shadow-lg"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <Link href="/"
          className="text-xl md:text-2xl font-bold tracking-tighter"
        >SCAN'AVIS
        </Link>
        <div className="flex items-center">
          <button type="button" onClick={handleToggleCart} className="mr-4">
            <img src="/cart-icon.svg" alt="Panier" className="w-8 h-8" />
          </button>
          <button type="button" onClick={handleToggleMenu} className="text-gray-800 outline-none">
            <img src="/menu.png" alt="Menu" className="w-8 h-8" />
          </button>
        </div>
      </motion.nav>

      <motion.div
        initial="closed"
        animate={isMenuOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
        className="fixed inset-y-0 right-0 z-40 w-5/6 sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4 bg-white shadow-xl p-6 flex flex-col justify-between transform transition-transform duration-300 ease-in-out"
        style={{ top: navbarHeight }}
        transition={{ type: 'tween' }}
      >
        <button type="button" onClick={handleToggleMenu} className="self-end">
          <img src="/icon-close.png" alt="Fermer" className="w-8 h-8" />
        </button>
        <nav className="flex-grow">
          <Link href="/"
            className="block py-2 text-gray-800 hover:text-gray-600 transition duration-150"
          >Accueil
          </Link>
          <Link href="/mon-profil"
            className="block py-2 text-gray-800 hover:text-gray-600 transition duration-150"
          >Mon Profil
          </Link>
          <Link href="/tarifs"
            className="block py-2 text-gray-800 hover:text-gray-600 transition duration-150"
          >Nos offres
          </Link>
          {/* Autres liens */}
        </nav>
        <div className="pt-6">
          {isAuthenticated ? (
            <button type="button"
              onClick={logout}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white transition-colors duration-300 rounded-lg"
            >
              Déconnexion
            </button>
          ) : (
            <Link href="/login"
              className="w-full block text-center py-3 bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300 rounded-lg"
            >Connexion
            </Link>
          )}
        </div>
      </motion.div>

      {isCartOpen && <CartSummary isCartOpen={isCartOpen} toggleCart={handleToggleCart} />}
    </>
  );
};

export default Navbar;
