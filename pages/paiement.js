import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useRouter } from 'next/router';
import PaymentForm from '../components/tableauStripe';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import Spinner from '../components/Spinner';

// Assurez-vous que votre clé publique Stripe est correctement configurée
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || 'pk_test_51OPtGvDWmnYPaxs1gSpLL1WpDyU6gaxOBszqNCSu9iHVeEYuPcjUEvOpKzjwdbF6NUWquoEPf24Y3qMwIDLmeLvl00FwQkUSKx');

const PagePaiement = () => {
  const [loading, setLoading] = useState(true);
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

  const handleSuccessfulPayment = () => {
    clearCart();
    // Redirigez vers une page de succès avec les informations de paiement si nécessaire
    router.push('/paymentstatus?paymentStatus=succeeded');
  };

  const handleFailedPayment = (message) => {
    console.error('Erreur de paiement:', message);
    // Redirigez vers une page d'échec avec un message d'erreur si nécessaire
    router.push('/paymentstatus?paymentStatus=failed');
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="bg-primary-black overflow-hidden">
      <Navbar />
      <Elements stripe={stripePromise}>
        <div className="page-container">
          <PaymentForm
            onSuccessfulPayment={handleSuccessfulPayment}
            onFailedPayment={handleFailedPayment}
          />
        </div>
      </Elements>
      <Footer />
    </div>
  );
};

export default PagePaiement;
