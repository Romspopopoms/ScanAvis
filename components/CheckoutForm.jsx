import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { usePayment } from '../context/PaymentContext';

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
const priceAmounts = {
  price_1OekFIDWmnYPaxs1hMaRWF4X: 2000, // Montant pour Base
  price_1OekKWDWmnYPaxs1W80kG5a0: 4000, // Montant pour Bronze
  price_1Oel3hDWmnYPaxs1k69X7veu: 6000, // Montant pour Silver
  price_1Oel3hDWmnYPaxs1icztOYwU: 10000, // Montant pour Gold
};

const CheckoutFormContent = ({ totalCost }) => { // Accepter totalCost en tant que prop
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { cartItem, clearCart, formatCartItemForSubscription } = useCart();
  const { user, refreshUserSubscriptions } = useContext(AuthContext);
  const [clientSecret, setClientSecret] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { setPaymentStatus, setPaymentMessage, setPaymentDetails } = usePayment();

  useEffect(() => {
    const fetchSubscriptionIntent = async () => {
      if (!cartItem || !user) return;

      try {
        const formattedItem = formatCartItemForSubscription();
        const response = await fetch('/.netlify/functions/SubscriptionIntent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ item: formattedItem, userUuid: user.uuid }),
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
  }, [cartItem, user]);

  const onSuccessfulSubscription = async (subscriptionData) => {
    console.log('Subscription Data in CheckoutFormContent:', subscriptionData);
    clearCart();
    setPaymentStatus('succeeded');
    await refreshUserSubscriptions();
    setPaymentDetails(subscriptionData); // Assurez-vous que c'est l'objet complet
    router.push(`/paymentstatus?subscriptionStatus=succeeded&subscriptionId=${subscriptionData.subscriptionId}`);
  };

  const onFailedSubscription = (message) => {
    console.error(`Subscription failed with message: ${message}`);
    setPaymentStatus('failed');
    setPaymentMessage(message);
    // Redirection à la page de statut de paiement avec le message d'erreur
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
      const cardNumberElement = elements.getElement(CardNumberElement);
      const cardExpiryElement = elements.getElement(CardExpiryElement);
      const cardCvcElement = elements.getElement(CardCvcElement);

      if (!cardNumberElement || !cardExpiryElement || !cardCvcElement) {
        throw new Error('Élément de carte non trouvé');
      }

      const { error, setupIntent } = await stripe.confirmCardSetup(clientSecret, {
        payment_method: {
          card: cardNumberElement,
          billing_details: {
            name: user ? user.name : 'Guest User',
          },
        },
      });

      if (error) {
        throw error;
      }

      if (setupIntent.status === 'succeeded') {
        const formattedItem = formatCartItemForSubscription();
        const subscriptionResult = await fetch('/.netlify/functions/complete-subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            setupIntentId: setupIntent.id,
            userUuid: user ? user.uuid : null,
            item: formattedItem,
          }),
        });

        const subscriptionData = await subscriptionResult.json();
        console.log('Subscription Data from Server:', subscriptionData);

        if (!subscriptionResult.ok) {
          throw new Error(subscriptionData.error || 'Erreur lors de la création de l’abonnement');
        }

        onSuccessfulSubscription(subscriptionData);
        console.log('Subscription Data in CheckoutFormContent:', subscriptionData);
      } else {
        throw new Error('La configuration a échoué pour une raison inconnue.');
      }
    } catch (error) {
      console.error('Erreur lors du traitement de l’abonnement:', error);
      setErrorMessage(error.message || 'Erreur lors du traitement de l’abonnement');
      onFailedSubscription(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-6">Détails de l'abonnement</h2>
        {cartItem && (
          <div className="mb-6">
            <div className="flex justify-between text-lg mb-2">
              <span>{cartItem.name}</span>
              <span>€{(totalCost / 100).toFixed(2)}</span> {/* Utiliser totalCost ici */}
            </div>
          </div>
        )}
        <p className="text-lg font-semibold mb-6">Total à payer: €{(totalCost / 100).toFixed(2)}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700">Numéro de la carte</label>
            <CardNumberElement className="stripe-element p-2 border border-gray-300 rounded mt-1" options={cardElementOptions} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date d'expiration</label>
            <CardExpiryElement className="stripe-element p-2 border border-gray-300 rounded mt-1" options={cardElementOptions} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">CVC</label>
            <CardCvcElement className="stripe-element p-2 border border-gray-300 rounded mt-1" options={cardElementOptions} />
          </div>
          <button type="submit" disabled={!stripe || !clientSecret || isProcessing} className={`w-full text-white font-bold py-2 px-4 rounded ${!stripe || isProcessing ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
            {isProcessing ? 'Traitement...' : 'S’abonner'}
          </button>
        </form>
      </div>
    </div>
  );
};

const CheckoutForm = () => {
  const { cartItem } = useCart();
  // Calcul du totalCost en fonction de l'élément du panier
  const totalCost = cartItem ? priceAmounts[cartItem.priceId] : 0;

  return (
    <Elements stripe={stripePromise}>
      <CheckoutFormContent totalCost={totalCost} />
    </Elements>
  );
};

export default CheckoutForm;
