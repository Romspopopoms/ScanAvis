import React, { useState, useContext } from 'react';
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { useCart } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const PaymentForm = ({ onSuccessfulPayment, onFailedPayment }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { cartItems, formatCartItemsForPayment } = useCart();
  const { user } = useContext(AuthContext);

  const calculateTotal = () => cartItems.reduce((total, item) => total + item.quantity * item.price, 0);

  const createPaymentIntent = async () => {
    try {
      const formattedCartItems = formatCartItemsForPayment();
      const response = await fetch('/.netlify/functions/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Assurez-vous d'envoyer l'uuid de l'utilisateur
        body: JSON.stringify({ items: formattedCartItems, userUuid: user.uuid }), // Utilisez user.uuid ici
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erreur du serveur');
      return data.clientSecret;
    } catch (error) {
      console.error('Erreur lors de la création de l’intention de paiement:', error);
      setErrorMessage(error.message);
      if (onFailedPayment) onFailedPayment(error.message);
      throw error;
    }
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
      const clientSecret = await createPaymentIntent();
      const cardElement = elements.getElement(CardNumberElement);

      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (paymentResult.error) {
        setErrorMessage(paymentResult.error.message);
        if (onFailedPayment) onFailedPayment(paymentResult.error.message);
      } else if (paymentResult.paymentIntent && paymentResult.paymentIntent.status === 'succeeded') {
        if (onSuccessfulPayment) onSuccessfulPayment(paymentResult.paymentIntent.id);
      } else {
        throw new Error('Le paiement a échoué pour une raison inconnue.');
      }
    } catch (error) {
      console.error('Erreur de paiement:', error);
      setErrorMessage(error.message);
      if (onFailedPayment) onFailedPayment(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-6">Mon Panier</h2>
        <ul className="mb-6">
          {cartItems.map((item) => (
            <li key={item.id} className="flex justify-between text-lg mb-2">
              <span>{item.name} - {item.quantity}</span>
              <span>${(item.price / 100).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <p className="text-lg font-semibold mb-6">Total à payer: ${(calculateTotal() / 100).toFixed(2)}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && <div className="text-red-500">{errorMessage}</div>}

          <div>
            <label className="block text-sm font-medium text-gray-700">Numéro de la carte</label>
            <CardNumberElement className="stripe-element p-2 border border-gray-300 rounded mt-1" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date d'expiration</label>
            <CardExpiryElement className="stripe-element p-2 border border-gray-300 rounded mt-1" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">CVC</label>
            <CardCvcElement className="stripe-element p-2 border border-gray-300 rounded mt-1" />
          </div>

          <button type="submit" disabled={!stripe || isProcessing} className={`w-full text-white font-bold py-2 px-4 rounded ${!stripe || isProcessing ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
            {isProcessing ? 'Traitement...' : 'Payer'}
          </button>
        </form>
      </div>
    </div>
  );
};
export default PaymentForm;
