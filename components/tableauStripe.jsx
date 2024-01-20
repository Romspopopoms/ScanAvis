import React, { useState } from 'react';
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { useCart } from '../context/CartContext'; // Utilisation du hook personnalisé

const PaymentForm = ({ onSuccessfulPayment }) => {
  // Utilisation du hook personnalisé pour accéder aux données du panier
  const { cartItems, formatCartItemsForPayment } = useCart();

  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const calculateTotal = () => cartItems.reduce((total, item) => total + item.quantity * item.price, 0) / 100;

  const createPaymentIntent = async () => {
    try {
      const formattedCartItems = formatCartItemsForPayment();
      const response = await fetch('/.netlify/functions/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: formattedCartItems }),
      });
      const data = await response.json();
      return data.clientSecret;
    } catch (error) {
      console.error('Erreur lors de la création de l’intention de paiement:', error);
      setErrorMessage(error.message);
      throw error;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      console.log('Stripe.js n’a pas encore été chargé!');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      const clientSecret = await createPaymentIntent();
      const cardElement = elements.getElement(CardNumberElement);
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (paymentResult.error) {
        setErrorMessage(paymentResult.error.message);
      } else if (paymentResult.paymentIntent.status === 'succeeded') {
        onSuccessfulPayment();
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="payment-form">
      <div className="payment-details">
        <h2>Mon Panier</h2>
        <ul>
          {cartItems.map((item) => (
            <li key={item.id}>
              {item.name} - {item.quantity} x {(item.price / 100).toFixed(2)}$
            </li>
          ))}
        </ul>
        <p className="cart-total">Total à payer: {calculateTotal().toFixed(2)}$</p>
      </div>
      <form onSubmit={handleSubmit}>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <div>
          <label>Numéro de la carte</label>
          <CardNumberElement className="stripe-element" />
        </div>
        <div>
          <label>Date d'expiration</label>
          <CardExpiryElement className="stripe-element" />
        </div>
        <div>
          <label>CVC</label>
          <CardCvcElement className="stripe-element" />
        </div>
        <button type="submit" disabled={!stripe || isProcessing}>
          {isProcessing ? 'Traitement...' : 'Payer'}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
