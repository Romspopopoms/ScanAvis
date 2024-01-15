import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import products from './cartItems'; // Assurez-vous que ce chemin est correct

// Chargez Stripe avec votre clé publique
const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLIC_KEY || 'pk_test_51OPtGvDWmnYPaxs1gSpLL1WpDyU6gaxOBszqNCSu9iHVeEYuPcjUEvOpKzjwdbF6NUWquoEPf24Y3qMwIDLmeLvl00FwQkUSKx',
);

const CheckoutForm = ({ cartItems }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Fonction pour calculer le total du panier
    const calculateTotalAmount = () => cartItems.reduce((total, item) => {
      const product = products[item.id];
      if (!product) {
        console.error(`Produit introuvable pour l'ID : ${item.id}`);
        return total;
      }
      return total + item.quantity * product.price;
    }, 0);

    // Créez l'intention de paiement dès que le composant monte ou que cartItems change
    const fetchPaymentIntent = async () => {
      try {
        const response = await fetch(
          '/.netlify/functions/create-payment-intent',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: calculateTotalAmount() }),
          },
        );
        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error(
          'Erreur lors de la création de l’intention de paiement :',
          error,
        );
      }
    };

    fetchPaymentIntent();
  }, [cartItems]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      // Stripe.js n'est pas encore chargé ou il y a une erreur avec Stripe.js ou Elements
      console.log('Stripe.js n’a pas encore été chargé!');
      return;
    }

    setIsProcessing(true); // Commence le traitement du paiement

    const cardElement = elements.getElement(CardElement); // Récupère l'élément de la carte

    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          // Ajoutez des détails de facturation si nécessaire
        },
      });

      if (result.error) {
        // Gère les erreurs survenues lors de la confirmation du paiement
        setErrorMessage(`Erreur de paiement : ${result.error.message}`);
        setIsProcessing(false);
      } else if (result.paymentIntent.status === 'succeeded') {
        // Gère le succès du paiement
        alert('Paiement réussi!');
        setIsProcessing(false);
        // TODO: Ajouter la logique de redirection ou de nettoyage du panier ici
      }
    } catch (error) {
      // Gère les erreurs survenues lors du traitement du paiement
      console.error('Erreur lors du traitement du paiement :', error);
      setErrorMessage(
        'Erreur lors du traitement du paiement. Veuillez réessayer.',
      );
      setIsProcessing(false);
    }
  };

  // Formulaire de paiement avec Stripe CardElement et gestion des messages d'erreur
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
