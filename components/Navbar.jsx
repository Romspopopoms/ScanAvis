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
    closed: { x: '-100%', opacity: 0 },
  };

  return (
    <>
      <motion.nav
        ref={navbarRef}
        className="fixed top-0 left-0 w-full flex justify-between items-center px-4 py-2 bg-white text-gray-800 z-50 shadow-md"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <h2 className="text-xl font-bold">
          <Link href="/">SCAN'AVIS</Link>
        </h2>
        <div className="flex items-center">
          <div onClick={toggleCart} className="ml-4 cursor-pointer">
            <img src="/cart-icon.svg" alt="Panier" className="w-6 h-6" />
          </div>
          <button type="button" onClick={handleToggleMenu} className="ml-4">
            <img src="/menu-icon.svg" alt="Menu" className="w-6 h-6" />
          </button>
        </div>
      </motion.nav>

      <motion.div
        initial="closed"
        animate={isMenuOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
        className="fixed top-0 left-0 h-full z-40 w-3/4 bg-white shadow-xl p-5"
        style={{ top: `${navbarHeight}px` }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <div className="flex flex-col space-y-4">
          {isAuthenticated ? (
            <>
              <Link href="/mon-profil" className="text-gray-800 hover:text-gray-600">
                Mon Profil
              </Link>
              <button type="button"
                onClick={logout}
                className="text-gray-800 hover:text-gray-600"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <Link href="/login" className="text-gray-800 hover:text-gray-600">
              Se connecter
            </Link>
          )}
          <Link href="/" className="text-gray-800 hover:text-gray-600">
            Accueil
          </Link>
          <Link href="/tarifs" className="text-gray-800 hover:text-gray-600">
            Nos offres
          </Link>
          {/* Ajoute d'autres liens ici au besoin */}
        </div>
      </motion.div>

      {isCartOpen && <CartSummary isCartOpen={isCartOpen} toggleCart={toggleCart} />}
    </>
  );
};

export default Navbar;
