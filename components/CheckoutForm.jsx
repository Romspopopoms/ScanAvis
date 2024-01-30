import React, { useState, useEffect, useContext } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useRouter } from 'next/router';
import { useCart } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const stripePromise = loadStripe('pk_test_51OPtGvDWmnYPaxs1gSpLL1WpDyU6gaxOBszqNCSu9iHVeEYuPcjUEvOpKzjwdbF6NUWquoEPf24Y3qMwIDLmeLvl00FwQkUSKx');

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { cartItems, formatCartItemsForSubscription, clearCart } = useCart();
  const { user } = useContext(AuthContext);
  const [clientSecret, setClientSecret] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchSubscriptionIntent = async () => {
      if (cartItems.length === 0 || !user) return;
      const formattedCartItems = formatCartItemsForSubscription();
      try {
        const response = await fetch('/.netlify/functions/SubscriptionIntent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: formattedCartItems, userUuid: user.uuid }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Erreur du serveur');
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error('Erreur lors de la création de l’intention de souscription:', error);
        setErrorMessage(error.message);
      }
    };

    fetchSubscriptionIntent();
  }, [cartItems, formatCartItemsForSubscription, user]);

  const onSuccessfulSubscription = (subscriptionId) => {
    clearCart();
    router.push(`/subscriptionstatus?subscriptionStatus=succeeded&subscriptionId=${subscriptionId}`);
  };

  const onFailedSubscription = (message) => {
    router.push(`/subscriptionstatus?subscriptionStatus=failed&message=${encodeURIComponent(message)}`);
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
      const setupResult = await stripe.confirmCardSetup(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (setupResult.error) {
        throw new Error(`Erreur de configuration: ${setupResult.error.message}`);
      } else if (setupResult.setupIntent && setupResult.setupIntent.status === 'succeeded') {
        // Envoyez l'ID de l'intention de configuration à votre serveur pour créer l'abonnement
        const subscriptionResult = await fetch('/.netlify/functions/complete-subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ setupIntentId: setupResult.setupIntent.id }),
        });

        const subscriptionData = await subscriptionResult.json();
        if (!subscriptionResult.ok) throw new Error(subscriptionData.error || 'Erreur lors de la création de l’abonnement');

        onSuccessfulSubscription(subscriptionData.subscriptionId);
      } else {
        throw new Error('La configuration a échoué pour une raison inconnue.');
      }
    } catch (error) {
      console.error('Erreur lors du traitement de l’abonnement:', error);
      setErrorMessage(error.message);
      onFailedSubscription(error.message);
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
          {isProcessing ? 'Traitement...' : 'S’abonner'}
        </button>
      </form>
    </Elements>
  );
};

export default CheckoutForm;
