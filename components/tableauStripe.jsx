// PaymentForm.js
import React from 'react';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from '@stripe/react-stripe-js';

const PaymentForm = ({ cartItems, handleSubmit }) => {
  // Calculer le total du panier
  const total = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);

  return (
    <div className="payment-form">
      <div className="payment-details">
        <h2>Mon Panier</h2>
        <ul>
          {cartItems.map((item) => (
            <li key={item.id}>
              {item.name} - {item.quantity} x {item.price}$
            </li>
          ))}
        </ul>
        <p className="cart-total">Total à payer: {total}$</p>
      </div>
      <form onSubmit={handleSubmit}>
        <label>
          Numéro de la carte
          <CardNumberElement className="stripe-element" />
        </label>
        <label>
          Date d'expiration
          <CardExpiryElement className="stripe-element" />
        </label>
        <label>
          CVC
          <CardCvcElement className="stripe-element" />
        </label>
        <button type="submit">Payer</button>
      </form>
    </div>
  );
};

export default PaymentForm;
