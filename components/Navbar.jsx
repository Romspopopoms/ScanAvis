import React, { useState, useContext, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import CartSummary from './CartSummary';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navbarRef = useRef < HTMLDivElement > (null);
  const [navbarHeight, setNavbarHeight] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setNavbarHeight(navbarRef.current?.offsetHeight ?? 0);
    };

    handleResize(); // Set initial navbar height
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const sidebarVariants = {
    open: { x: 0, opacity: 1, transition: { stiffness: 260, damping: 20 } },
    closed: { x: '-100%', opacity: 0, transition: { stiffness: 260, damping: 20 } },
  };

  return (
    <>
      <motion.nav
        ref={navbarRef}
        className="fixed top-0 left-0 w-full flex justify-between items-center px-4 py-2 bg-white text-gray-800 z-50 shadow-md transition-all duration-300 ease-in-out"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
      >
        <Link href="/" className="font-extrabold text-2xl cursor-pointer">
          SCAN'AVIS
        </Link>
        <div className="flex items-center">
          <div className="hidden sm:flex">
            {isAuthenticated ? (
              <button type="button" onClick={logout} className="px-4 py-2 bg-red-600 hover:bg-red-700 transition rounded text-white">
                Déconnexion
              </button>
            ) : (
              <Link href="/login"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition rounded text-white"
              >
                Se connecter
              </Link>
            )}
            <div onClick={toggleCart} className="ml-4 relative cursor-pointer">
              <img src="/cart-icon.svg" alt="Panier" className="w-6 h-6" />
            </div>
          </div>
          <button type="button" onClick={toggleMenu} className="sm:hidden ml-4">
            <img src="/menu.png" alt="Menu" className="w-6 h-6" />
          </button>
        </div>
      </motion.nav>

      <motion.div
        initial="closed"
        animate={isMenuOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
        className="fixed sm:hidden right-0 top-0 h-full bg-white text-gray-800 shadow-xl z-40 p-5"
        style={{ top: `${navbarHeight}px` }}
      >
        <div className="mt-2">
          {isAuthenticated && (
            <Link href="/mon-profil"
              className="block hover:text-gray-300"
            >Mon Profil
            </Link>
          )}
          <Link href="/"
            className="block hover:text-gray-300"
          >Accueil
          </Link>
          <Link href="/tarifs"
            className="block hover:text-gray-300"
          >Nos offres
          </Link>
          {/* Autres liens du menu */}
        </div>
      </motion.div>

      {isCartOpen && <CartSummary />}
    </>
  );
};

export default Navbar;
