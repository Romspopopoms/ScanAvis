import React, { useState, useEffect, useContext } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useRouter } from 'next/router';
import { useCart } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext'; // Assurez-vous d'importer AuthContext correctement

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { cartItems, formatCartItemsForPayment, clearCart } = useCart();
  const { user } = useContext(AuthContext); // Utilisez AuthContext pour accéder à l'`uuid` de l'utilisateur
  const [clientSecret, setClientSecret] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      if (cartItems.length === 0 || !user) return;
      const formattedCartItems = formatCartItemsForPayment();
      try {
        const response = await fetch('/.netlify/functions/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: formattedCartItems, userUuid: user.uuid }), // Passez l'`uuid` de l'utilisateur
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Erreur du serveur');
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error('Erreur lors de la création de l’intention de paiement:', error);
        setErrorMessage(error.message);
      }
    };

    fetchPaymentIntent();
  }, [cartItems, formatCartItemsForPayment, user]);

  const onSuccessfulPayment = (paymentIntentId) => {
    clearCart();
    router.push(`/paymentstatus?paymentStatus=succeeded&paymentIntentId=${paymentIntentId}`);
  };

  const onFailedPayment = (message) => {
    router.push(`/paymentstatus?paymentStatus=failed&message=${encodeURIComponent(message)}`);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      setErrorMessage('Stripe.js n’a pas encore été chargé!');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      const cardElement = elements.getElement(CardElement);
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (paymentResult.error) {
        throw new Error(`Erreur de paiement: ${paymentResult.error.message}`);
      } else if (paymentResult.paymentIntent && paymentResult.paymentIntent.status === 'succeeded') {
        onSuccessfulPayment(paymentResult.paymentIntent.id);
      } else {
        throw new Error('Le paiement a échoué pour une raison inconnue.');
      }
    } catch (error) {
      console.error('Erreur lors du traitement du paiement:', error);
      setErrorMessage(error.message);
      onFailedPayment(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Elements stripe={stripePromise}>
      <form onSubmit={handleSubmit}>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <CardElement />
        <button type="submit" disabled={!stripe || !clientSecret || isProcessing}>
          {isProcessing ? 'Traitement...' : 'Payer'}
        </button>
      </form>
    </Elements>
  );
};

export default CheckoutForm;
