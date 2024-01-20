import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useCart } from '../context/CartContext';

const CartSummary = ({ isCartOpen, toggleCart }) => {
  const { cartItems, removeFromCart, clearCart, totalPrice } = useCart();

  const cartVariants = {
    open: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 120 } },
    closed: { opacity: 0, scale: 0.95, transition: { type: 'spring', stiffness: 120 } },
  };

  const handleClickOutside = (e) => {
    if (isCartOpen && e.target.classList.contains('cart-bubble')) {
      toggleCart();
    }
  };

  return (
    <motion.div
      className="cart-bubble"
      initial="closed"
      animate={isCartOpen ? 'open' : 'closed'}
      variants={cartVariants}
      onClick={handleClickOutside}
    >
      <h2 className="cart-title">Mon Panier</h2>
      {cartItems.length > 0 ? (
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className="item-details">
                  <h4 className="item-name">{item.name}</h4>
                  <p className="item-price">{(item.price / 100).toFixed(2)}$ - Quantité: {item.quantity}</p>
                </div>
                <button
                  type="button"
                  className="remove-item-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  Retirer
                </button>
              </div>
            ))}
          </div>
          <div className="cart-total">
            <strong className="total-price">Total: {(totalPrice / 100).toFixed(2)}$</strong>
            <button
              type="button"
              className="clear-cart-btn"
              onClick={clearCart}
            >
              Vider le Panier
            </button>
            <button
              type="button"
              className="checkout-btn"
            >
              Payer
              <Link href="/paiement" />
            </button>
          </div>
        </div>
      ) : (
        <p className="empty-message">Votre panier est vide.</p>
      )}
    </motion.div>
  );
};

export default CartSummary;
