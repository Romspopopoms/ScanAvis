import React from 'react';
import { useCart } from '../context/CartContext'; // Modifiez le chemin si nécessaire

const CartSummary = () => {
  const { cartItems, removeFromCart, clearCart, totalPrice } = useCart();

  return (
    <div className="cart-container">
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
    </div>
  );
};

export default CartSummary;
