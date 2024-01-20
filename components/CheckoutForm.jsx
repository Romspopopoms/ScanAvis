import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '../context/CartContext'; // Utilisation du hook personnalisé

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || 'pk_test_51OPtGvDWmnYPaxs1gSpLL1WpDyU6gaxOBszqNCSu9iHVeEYuPcjUEvOpKzjwdbF6NUWquoEPf24Y3qMwIDLmeLvl00FwQkUSKx');

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { cartItems, formatCartItemsForPayment } = useCart(); // Utilisation de useCart

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      if (cartItems.length > 0) {
        const formattedCartItems = formatCartItemsForPayment();
        try {
          const response = await fetch('/.netlify/functions/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: formattedCartItems }),
          });
          const data = await response.json();
          setClientSecret(data.clientSecret);
        } catch (error) {
          console.error('Erreur lors de la création de l’intention de paiement:', error);
          setErrorMessage(error.message);
        }
      }
    };

    fetchPaymentIntent();
  }, [cartItems, formatCartItemsForPayment]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      console.log('Stripe.js n’a pas encore été chargé!');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    const cardElement = elements.getElement(CardElement);
    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (result.error) {
        setErrorMessage(`Erreur de paiement: ${result.error.message}`);
        setIsProcessing(false);
      } else if (result.paymentIntent.status === 'succeeded') {
        alert('Paiement réussi!');
        setIsProcessing(false);
        // Logique supplémentaire en cas de succès
      }
    } catch (error) {
      console.error('Erreur lors du traitement du paiement:', error);
      setErrorMessage('Erreur lors du traitement du paiement. Veuillez réessayer.');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <CardElement />
      <button type="submit" disabled={!stripe || !clientSecret || isProcessing}>
        {isProcessing ? 'Traitement...' : 'Payer'}
      </button>
    </form>
  );
};

const StripeCheckout = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default StripeCheckout;
