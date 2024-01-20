import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import products from './cartItems'; // Assurez-vous que le chemin d'accès est correct

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || 'pk_test_...');

const CheckoutForm = ({ cartItems }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      try {
        // Enrichir les cartItems avec les informations des produits
        const enrichedCartItems = cartItems.map((item) => {
          const product = products[item.id];
          if (!product) {
            console.error(`Produit introuvable pour l'ID : ${item.id}`);
            return null;
          }
          return { ...item, price: product.price * 100 }; // Multiplier par 100 pour convertir en centimes
        }).filter((item) => item !== null); // Filtrer les éléments non valides

        const response = await fetch('/.netlify/functions/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: enrichedCartItems }),
        });

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error('Erreur lors de la création de l’intention de paiement :', error);
      }
    };

    fetchPaymentIntent();
  }, [cartItems]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      console.log('Stripe.js n’a pas encore été chargé!');
      return;
    }

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);

    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (result.error) {
        setErrorMessage(`Erreur de paiement : ${result.error.message}`);
        setIsProcessing(false);
      } else if (result.paymentIntent.status === 'succeeded') {
        alert('Paiement réussi!');
        setIsProcessing(false);
        // TODO: Ajouter la logique de redirection ou de nettoyage du panier ici
      }
    } catch (error) {
      console.error('Erreur lors du traitement du paiement :', error);
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

const StripeCheckout = ({ cartItems }) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm cartItems={cartItems} />
  </Elements>
);

export default StripeCheckout;
