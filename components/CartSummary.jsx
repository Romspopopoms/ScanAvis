import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useCart } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const priceAmounts = {
  price_1OekFIDWmnYPaxs1hMaRWF4X: 2000, // Montant pour Base
  price_1OekKWDWmnYPaxs1W80kG5a0: 4000, // Montant pour Bronze
  price_1Oel3hDWmnYPaxs1k69X7veu: 6000, // Montant pour Silver
  price_1Oel3hDWmnYPaxs1icztOYwU: 10000, // Montant pour Gold
};

const CartSummary = () => {
  const { cartItem, removeFromCart, clearCart, isCartOpen, setIsCartOpen } = useCart();
  const { isAuthenticated } = useContext(AuthContext);
  const router = useRouter();

  const cartVariants = {
    open: { x: 0, opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 120 } },
    closed: { x: '-100%', opacity: 0, scale: 0.95, transition: { type: 'spring', stiffness: 120 } },
  };

  const totalCost = cartItem ? priceAmounts[cartItem.priceId] : 0;

  const handleCloseClick = () => {
    setIsCartOpen(false);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      // Sauvegarder l'intention de redirection
      localStorage.setItem('redirectAfterLogin', '/paiement');

      // Rediriger vers la page de login
      router.push('/login');
    } else {
      // Si authentifié, aller directement à la page de paiement
      router.push('/paiement');
    }
  };

  return (
    <motion.div
      className={`fixed bottom-0 left-0 z-50 p-4 bg-white rounded-tl-3xl rounded-tr-3xl shadow-xl transform transition-transform ${isCartOpen ? 'translate-x-0' : '-translate-x-full'}`}
      initial="closed"
      animate={isCartOpen ? 'open' : 'closed'}
      variants={cartVariants}
    >
      <button type="button" onClick={handleCloseClick} className="absolute top-2 right-2 text-lg font-semibold cursor-pointer">&times;</button>
      <div className="overflow-y-auto max-h-96">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Mon Panier</h2>
        {cartItem ? (
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="font-semibold">{cartItem.name}</h4>
              <p className="text-sm text-gray-600">€{(totalCost / 100).toFixed(2)}</p>
            </div>
            <button type="button" className="text-red-500 text-xs" onClick={removeFromCart}>Retirer</button>
          </div>
        ) : (
          <p className="text-gray-600">Votre panier est vide.</p>
        )}
        <div className="mt-4">
          <strong className="text-lg">Total: €{(totalCost / 100).toFixed(2)}</strong>
          <div className="mt-4 flex justify-between">
            <button type="button" className="bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600 transition-colors duration-300" onClick={clearCart}>Vider le Panier</button>
            <button type="button" onClick={handleCheckout} className="bg-blue-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-600 transition-colors duration-300 ml-2">Valider la commande</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartSummary;
