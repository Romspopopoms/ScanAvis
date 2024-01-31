import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useCart } from '../context/CartContext';

const CartSummary = ({ isCartOpen }) => {
  const { cartItems, totalCost, removeFromCart, clearCart } = useCart();

  const cartVariants = {
    open: { x: 0, opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 120 } },
    closed: { x: '-100%', opacity: 0, scale: 0.95, transition: { type: 'spring', stiffness: 120 } },
  };

  return (
    <motion.div
      className={`fixed bottom-0 left-0 z-50 p-4 bg-white rounded-tl-3xl rounded-tr-3xl shadow-xl transform transition-transform ${
        isCartOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
      initial="closed"
      animate={isCartOpen ? 'open' : 'closed'}
      variants={cartVariants}
    >
      <div className="overflow-y-auto max-h-96">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Mon Panier</h2>
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold">{item.name}</h4>
                <p className="text-sm text-gray-600">${(item.price / 100).toFixed(2)}</p>
              </div>
              <button
                type="button"
                className="text-red-500 text-xs"
                onClick={() => removeFromCart(item.id)}
              >
                Retirer
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-600">Votre panier est vide.</p>
        )}
        {cartItems.length > 0 && (
          <div className="mt-4">
            <strong className="text-lg">Total: ${(totalCost / 100).toFixed(2)}</strong>
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
        )}
      </div>
    </motion.div>
  );
};

export default CartSummary;
