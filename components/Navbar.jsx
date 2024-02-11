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
    const handleResize = () => {
      setNavbarHeight(navbarRef.current?.offsetHeight ?? 0);
    };
    handleResize(); // Set initial navbar height
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' },
  };

  return (
    <>
      <motion.nav
        ref={navbarRef}
        className="fixed top-0 left-0 w-full flex justify-between items-center px-4 bg-white text-gray-800 z-50 shadow-md"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        {/* ... other navbar content ... */}
        <div className="flex items-center">
          <div onClick={toggleCart} className="ml-4 relative cursor-pointer">
            {/* Cart icon */}
          </div>
          <button type="button" onClick={handleToggleMenu} className="md:hidden ml-4">
            {/* Menu icon */}
          </button>
          {isAuthenticated && (
            <button type="button" onClick={logout} className="px-4 py-2 bg-red-600 hover:bg-red-700 transition rounded text-white hidden md:block">
              Déconnexion
            </button>
          )}
        </div>
      </motion.nav>

      <motion.div
        initial="closed"
        animate={isMenuOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
        className="fixed md:hidden right-0 top-0 h-full bg-white text-gray-800 shadow-xl z-40 p-5"
        style={{ top: navbarHeight }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <div className="flex flex-col mt-2">
          {/* Menu items here */}
          {isAuthenticated ? (
            <>
              {/* User profile link */}
              <Link href="/mon-profil">
                <span className="block hover:text-gray-300 cursor-pointer">
                  Mon Profil
                </span>
              </Link>
              {/* Logout button */}
              <button type="button" onClick={logout} className="text-red-600 hover:text-red-700 cursor-pointer mt-4">
                Déconnexion
              </button>
            </>
          ) : (
            <>
              {/* Login link for mobile */}
              <Link href="/login">
                <span className="block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded cursor-pointer mt-4">
                  Se connecter
                </span>
              </Link>
            </>
          )}
          {/* Additional menu items */}
          <Link href="/">
            <span className="block hover:text-gray-300 cursor-pointer mt-4">
              Accueil
            </span>
          </Link>
          <Link href="/tarifs">
            <span className="block hover:text-gray-300 cursor-pointer mt-4">
              Nos offres
            </span>
          </Link>
          {/* ... other links ... */}
        </div>
      </motion.div>

      {/* Cart summary */}
      {isCartOpen && <CartSummary isCartOpen={isCartOpen} toggleCart={toggleCart} />}
    </>
  );
};

export default Navbar;
