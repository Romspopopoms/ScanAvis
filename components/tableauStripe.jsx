import React, { useState } from 'react';
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';

const PaymentForm = ({ cartItems, onSuccessfulPayment }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Calculer le total du panier
  const calculateTotal = () => cartItems.reduce((total, item) => total + item.quantity * item.price, 0);

  // Fonction pour créer un PaymentIntent sur le serveur
  const createPaymentIntent = async (amount) => {
    const response = await fetch('/.netlify/functions/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    });
    return response.json();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Vérifier si Stripe.js est chargé et si les éléments sont prêts
    if (!stripe || !elements) {
      console.log('Stripe.js n’a pas encore été chargé!');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    // Récupérer l'élément de la carte de Stripe
    const cardElement = elements.getElement(CardNumberElement);

    try {
      // Créer un PaymentIntent avec le total du panier
      const paymentIntent = await createPaymentIntent(calculateTotal());

      // Confirmer le paiement avec Stripe
      const paymentResult = await stripe.confirmCardPayment(paymentIntent.clientSecret, {
        payment_method: {
          card: cardElement,
          // Ajouter d'autres informations de paiement si nécessaire
        },
      });

      // Gérer le résultat du paiement
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
              {item.name} - {item.quantity} x {item.price}$
            </li>
          ))}
        </ul>
        <p className="cart-total">Total à payer: {calculateTotal()}$</p>
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
