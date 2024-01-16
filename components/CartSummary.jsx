import React from 'react';
import { motion } from 'framer-motion'; // Importez Framer Motion
import { useCart } from '../context/CartContext';

const CartSummary = () => {
  const { cartItems, removeFromCart, clearCart, totalPrice } = useCart();

  // Variants pour l'animation
  const cartVariants = {
    open: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 120 } },
    closed: { opacity: 0, scale: 0.95, transition: { type: 'spring', stiffness: 120 } },
  };

  return (
    <motion.div
      className="cart-container"
      initial="closed"
      animate={cartItems.length > 0 ? 'open' : 'closed'}
      variants={cartVariants}
    >
      <h2>Mon Panier</h2>
      {cartItems.length > 0 ? (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div className="cart-item" key={item.id}>
                <img src={item.imgUrl} alt={item.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <h4>{item.name}</h4>
                  <p>{item.price}$ - Quantité: {item.quantity}</p>
                </div>
                <button type="button" onClick={() => removeFromCart(item.id)}>
                  Retirer
                </button>
              </div>
            ))}
          </div>
          <div className="cart-total">
            <strong>Total: {totalPrice}$</strong>
            <button type="button" onClick={clearCart}>
              Vider le Panier
            </button>
          </div>
        </>
      ) : (
        <p>Votre panier est vide.</p>
      )}
    </motion.div>
  );
};

export default CartSummary;
