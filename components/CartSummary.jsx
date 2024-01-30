import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useCart } from '../context/CartContext';

const CartSummary = ({ isCartOpen }) => {
  const { cartItems, removeFromCart, clearCart, formatCartItemsForSubscription } = useCart();

  const cartVariants = {
    open: { x: 0, opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 120 } },
    closed: { x: '-100%', opacity: 0, scale: 0.95, transition: { type: 'spring', stiffness: 120 } },
  };

  // Fonction pour calculer le total, adaptée pour les abonnements
  const calculateTotal = () => {
    const formattedCartItems = formatCartItemsForSubscription();
    return formattedCartItems.reduce((total, item) => total + item.price, 0);
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
          <>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div className="flex justify-between items-center" key={item.id}>
                  <div>
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-sm text-gray-600">{(item.price / 100).toFixed(2)}$ - Quantité: {item.quantity}</p>
                  </div>
                  <button
                    type="button"
                    className="text-red-500 text-xs"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Retirer
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <strong className="text-lg">Total: {(calculateTotal() / 100).toFixed(2)}$</strong>
              <div className="mt-4">
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
          </>
        ) : (
          <p className="text-gray-600">Votre panier est vide.</p>
        )}
      </div>
    </motion.div>
  );
};

export default CartSummary;
