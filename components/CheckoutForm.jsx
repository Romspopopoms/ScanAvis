import React, { useState, useEffect, useContext } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import CartContext from '../context/CartContext'; // Assurez-vous que le chemin est correct

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || 'pk_test_51OPtGvDWmnYPaxs1gSpLL1WpDyU6gaxOBszqNCSu9iHVeEyuPcjUEvOpKzjwdbF6NUWquoEPf24Y3qMwIDLmeLvl00FwQkUSKx');

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { cartItems, formatCartItemsForPayment } = useContext(CartContext);

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      try {
        const formattedCartItems = formatCartItemsForPayment();

        console.log('Sending these items to backend:', formattedCartItems); // Log for debugging

        const response = await fetch('/.netlify/functions/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: formattedCartItems }),
        });

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error('Error creating payment intent:', error);
        setErrorMessage(error.message);
      }
    };

    if (cartItems.length > 0) {
      fetchPaymentIntent();
    }
  }, [cartItems, formatCartItemsForPayment]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      console.log('Stripe.js has not yet loaded!');
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
        setErrorMessage(`Payment error: ${result.error.message}`);
        setIsProcessing(false);
      } else if (result.paymentIntent.status === 'succeeded') {
        alert('Payment successful!');
        setIsProcessing(false);
        // TODO: Add redirection or cart clearing logic here
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      setErrorMessage('Error processing payment. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <CardElement />
      <button type="submit" disabled={!stripe || !clientSecret || isProcessing}>
        {isProcessing ? 'Processing...' : 'Pay'}
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
