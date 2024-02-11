import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useCart } from '../context/CartContext';

const priceAmounts = {
  price_1OekFIDWmnYPaxs1hMaRWF4X: 2000, // Montant pour Base
  price_1OekKWDWmnYPaxs1W80kG5a0: 4000, // Montant pour Bronze
  price_1Oel3hDWmnYPaxs1k69X7veu: 6000, // Montant pour Silver
  price_1Oel3hDWmnYPaxs1icztOYwU: 10000, // Montant pour Gold
};

const CartSummary = ({ isCartOpen }) => {
  const { cartItem, removeFromCart, clearCart } = useCart();

  const cartVariants = {
    open: { x: 0, opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 120 } },
    closed: { x: '-100%', opacity: 0, scale: 0.95, transition: { type: 'spring', stiffness: 120 } },
  };

  const totalCost = cartItem ? priceAmounts[cartItem.priceId] : 0;

  return (
    <motion.div
      className={`fixed inset-x-0 bottom-0 z-50 p-6 bg-white rounded-t-3xl shadow-xl transform transition-transform ${isCartOpen ? 'translate-x-0' : '-translate-x-full'}`}
      initial="closed"
      animate={isCartOpen ? 'open' : 'closed'}
      variants={cartVariants}
    >
      <div className="flex flex-col max-h-96 overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Mon Panier</h2>
        {cartItem ? (
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="font-semibold">{cartItem.name}</h4>
              <p className="text-sm text-gray-600">${(totalCost / 100).toFixed(2)}</p>
            </div>
            <button type="button"
              onClick={() => removeFromCart(cartItem.id)}
              className="text-red-500 hover:text-red-600 transition-colors duration-300"
            >
              &#10005;
            </button>
          </div>
        ) : (
          <p className="text-gray-600">Votre panier est vide.</p>
        )}
        <div className="mt-auto">
          <div className="flex justify-between items-center border-t pt-4">
            <strong className="text-lg">Total: ${(totalCost / 100).toFixed(2)}</strong>
            <button type="button"
              onClick={clearCart}
              className="text-sm bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-300"
            >
              Vider le Panier
            </button>
          </div>
          {cartItem && (
            <Link href="/paiement"
              className="mt-4 block text-center text-sm bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-300"
            >
              Passer au paiement
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CartSummary;
