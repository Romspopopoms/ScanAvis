import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import CartSummary from './CartSummary'; // Assurez-vous que le chemin d'importation est correct
import { AuthContext } from '../context/AuthContext'; // Importez AuthContext
import { LoginButton, LogoutButton } from './AuthButtons'; // Importez LoginButton et LogoutButton

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { isAuthenticated } = useContext(AuthContext); // Utilisez AuthContext

  // Fonctions pour basculer les états du menu et du panier
  const handleToggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  // Variants pour l'animation de framer-motion
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
            <LogoutButton /> // Utilisez LogoutButton pour la déconnexion
          ) : (
            <LoginButton /> // Utilisez LoginButton pour la connexion
          )}
          <div onClick={toggleCart} className="relative cursor-pointer ml-4">
            <img src="/cart-icon.svg" alt="Cart" style={{ width: '24px', height: '24px' }} />
            <span className="absolute top-0 right-0 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
              {/* Afficher le nombre d'articles ici si nécessaire */}
            </span>
          </div>
          <button type="button" onClick={handleToggleMenu} className="ml-4">
            <img src="/menu.svg" alt="Menu" style={{ width: '24px', height: '24px' }} />
          </button>
        </div>
        <motion.div
          initial="closed"
          animate={isMenuOpen ? 'open' : 'closed'}
          variants={menuVariants}
          className="fixed top-0 left-0 w-[250px] h-full bg-gray-800 shadow-lg z-40"
        >
          {/* Contenu du menu */}
          <button type="button" onClick={handleToggleMenu}>Fermer</button>
          {isAuthenticated && <Link href="/mon-profil">Mon Profil</Link>}
          <Link href="/">Accueil</Link>
          <Link href="/tarifs">Nos offres</Link>
        </motion.div>
      </nav>

      {/* Affichage conditionnel de CartSummary basé sur isCartOpen */}
      {isCartOpen && <CartSummary isCartOpen={isCartOpen} toggleCart={toggleCart} />}
    </>
  );
};

export default Navbar;
