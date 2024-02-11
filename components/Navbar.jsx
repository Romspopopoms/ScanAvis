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

  const handleToggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleCart = () => setIsCartOpen(!isCartOpen);

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
          {isAuthenticated ? (
            <button type="button"
              onClick={logout}
              className="hidden sm:block px-4 py-2 mr-4 bg-red-600 hover:bg-red-700 text-white transition-colors duration-300 rounded-lg"
            >
              Déconnexion
            </button>
          ) : (
            <Link href="/login"
              className="hidden sm:block px-4 py-2 mr-4 bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300 rounded-lg"
            >Connexion
            </Link>
          )}
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
          <img src="/iconarrow.png" alt="Fermer" className="w-8 h-8" />
        </button>
        <nav className="mt-8 flex-grow">
          <Link href="/"
            className="block py-2 text-gray-800 hover:text-gray-600 transition duration-150"
          >
            Accueil
          </Link>
          <Link href="/mon-profil"
            className="block py-2 text-gray-800 hover:text-gray-600 transition duration-150"
          >
            Mon Profil
          </Link>
          <Link href="/tarifs"
            className="block py-2 text-gray-800 hover:text-gray-600 transition duration-150"
          >
            Nos offres
          </Link>
          {/* Autres liens */}
        </nav>
        {isAuthenticated && (
          <button type="button"
            onClick={() => {
              logout();
              handleToggleMenu();
            }}
            className="w-full py-3 mt-4 bg-red-600 hover:bg-red-700 text-white transition-colors duration-300 rounded-lg"
          >
            Déconnexion
          </button>
        )}
      </motion.div>

      {isCartOpen && <CartSummary isCartOpen={isCartOpen} toggleCart={toggleCart} />}
    </>
  );
};

export default Navbar;
