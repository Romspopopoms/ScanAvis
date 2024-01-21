import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe } from '@stripe/react-stripe-js';
import { useRouter } from 'next/router';
import PaymentForm from '../components/tableauStripe';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import Spinner from '../components/Spinner';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || 'pk_test_...');

const PagePaiement = () => {
  const [loading, setLoading] = useState(true);
  const stripe = useStripe(); // Utilisation de useStripe pour accéder à l'objet stripe
  const { clearCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    stripePromise.then(() => {
      setLoading(false);
    }).catch((error) => {
      console.error('Erreur lors du chargement de Stripe:', error);
      setLoading(false);
    });
  }, []);

  const handlePayment = async () => {
    if (!stripe) {
      console.error("Stripe n'est pas initialisé");
      return;
    }

    setLoading(true);
    try {
      // Remplacez ceci par votre logique d'appel API pour traiter le paiement
      const paymentResult = await stripe.confirmCardPayment(/* ... */);

      if (paymentResult.error) {
        throw new Error(paymentResult.error.message);
      } else if (paymentResult.paymentIntent.status === 'succeeded') {
        clearCart();
        router.push('/paymentstatus?paymentStatus=succeeded');
      } else {
        throw new Error('Le paiement a échoué pour une raison inconnue.');
      }
    } catch (error) {
      console.error('Erreur de paiement:', error.message);
      router.push(`/paymentstatus?paymentStatus=failed&message=${encodeURIComponent(error.message)}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="bg-primary-black overflow-hidden">
      <Navbar />
      <Elements stripe={stripePromise}>
        <div className="page-container">
          <PaymentForm onProcessPayment={handlePayment} />
        </div>
      </Elements>
      <Footer />
    </div>
  );
};

export default PagePaiement;
