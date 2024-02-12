import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useCart } from '../context/CartContext';

// Supposons que vous ayez un objet qui associe priceIds à leurs montants
// Cela pourrait être placé dans un fichier séparé et importé si utilisé à plusieurs endroits
const priceAmounts = {
  price_1OekFIDWmnYPaxs1hMaRWF4X: 2000, // Montant pour Base
  price_1OekKWDWmnYPaxs1W80kG5a0: 4000, // Montant pour Bronze
  price_1Oel3hDWmnYPaxs1k69X7veu: 6000, // Montant pour Silver
  price_1Oel3hDWmnYPaxs1icztOYwU: 10000, // Montant pour Gold
};

const CartSummary = ({ isCartOpen }) => {
  const { cartItem, removeFromCart, clearCart } = useCart();

  // Animation variants for the cart summary panel
  const cartVariants = {
    open: { x: 0, opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 120 } },
    closed: { x: '-100%', opacity: 0, scale: 0.95, transition: { type: 'spring', stiffness: 120 } },
  };

  // Utilisez priceId pour obtenir le coût total à partir de l'objet priceAmounts
  const totalCost = cartItem ? priceAmounts[cartItem.priceId] : 0;

  return (
    <motion.div
      className={`fixed bottom-0 left-0 z-50 p-4 bg-white rounded-tl-3xl rounded-tr-3xl shadow-xl transform transition-transform ${isCartOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
      initial="closed"
      animate={isCartOpen ? 'open' : 'closed'}
      variants={cartVariants}
    >
      <div className="overflow-y-auto max-h-96">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Mon Panier</h2>
        {cartItem ? (
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="font-semibold">{cartItem.name}</h4>
              <p className="text-sm text-gray-600">€{(totalCost / 100).toFixed(2)}</p>
            </div>
            <button
              type="button"
              className="text-red-500 text-xs"
              onClick={() => removeFromCart()}
            >
              Retirer
            </button>
          </div>
        ) : (
          <p className="text-gray-600">Votre panier est vide.</p>
        )}
        <div className="mt-4">
          <strong className="text-lg">Total: €{(totalCost / 100).toFixed(2)}</strong>
          <div className="mt-4 flex justify-between">
            <button
              type="button"
              className="bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600 transition-colors duration-300"
              onClick={clearCart}
            >
              Vider le Panier
            </button>
            <Link href="/paiement"
              className="inline-block bg-green-500 text-white text-sm px-3 py-1 rounded hover:bg-green-600 transition-colors duration-300 ml-2"
            >
              S’abonner
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartSummary;
