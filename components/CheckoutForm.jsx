import React, { useState, useEffect, useContext } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const stripePromise = loadStripe('pk_test_51OPtGvDWmnYPaxs1gSpLL1WpDyU6gaxOBszqNCSu9iHVeEYuPcjUEvOpKzjwdbF6NUWquoEPf24Y3qMwIDLmeLvl00FwQkUSKx');

const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

const CheckoutFormContent = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { cartItem, clearCart } = useCart();
  const { user } = useContext(AuthContext);
  const [clientSecret, setClientSecret] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      if (!cartItem || !user) return;

      try {
        const response = await fetch('/.netlify/functions/complete-subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ priceId: cartItem.priceId, userUuid: user.uuid }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Server error');
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error('Error fetching payment intent:', error);
        setErrorMessage(error.message);
      }
    };

    fetchPaymentIntent();
  }, [cartItem, user]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setErrorMessage('Stripe.js has not loaded yet.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    const cardNumberElement = elements.getElement(CardNumberElement);
    const cardExpiryElement = elements.getElement(CardExpiryElement);
    const cardCvcElement = elements.getElement(CardCvcElement);

    if (!cardNumberElement || !cardExpiryElement || !cardCvcElement) {
      setErrorMessage('Card details cannot be found.');
      setIsProcessing(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardNumberElement,
        billing_details: { name: user ? user.name : 'Guest User' },
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setIsProcessing(false);
    } else if (paymentIntent.status === 'succeeded') {
      clearCart();
      // Redirect to success page or show success message
    }
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-6">Subscription Details</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <CardNumberElement options={cardElementOptions} />
          <CardExpiryElement options={cardElementOptions} />
          <CardCvcElement options={cardElementOptions} />
          <button type="submit" disabled={!stripe || !clientSecret || isProcessing} className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
            {isProcessing ? 'Processing...' : 'Subscribe'}
          </button>
        </form>
      </div>
    </div>
  );
};

const CheckoutForm = () => (
  <Elements stripe={stripePromise}>
    <CheckoutFormContent />
  </Elements>
);

export default CheckoutForm;
