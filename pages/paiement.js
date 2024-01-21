import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useRouter } from 'next/router';
import PaymentForm from '../components/tableauStripe';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import Spinner from '../components/Spinner';

const stripePromise = loadStripe('pk_test_51OPtGvDWmnYPaxs1gSpLL1WpDyU6gaxOBszqNCSu9iHVeEYuPcjUEvOpKzjwdbF6NUWquoEPf24Y3qMwIDLmeLvl00FwQkUSKx');

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

  // Fonction appelée lorsque le paiement est réussi
  const onSuccessfulPayment = () => {
    clearCart();
    router.push('/paymentstatus?paymentStatus=succeeded');
  };

  // Fonction appelée en cas d'échec du paiement
  const onFailedPayment = (message) => {
    console.error('Erreur de paiement:', message);
    router.push(`/paymentstatus?paymentStatus=failed&message=${encodeURIComponent(message)}`);
  };

  // La fonction handlePayment n'est plus nécessaire ici et doit être déplacée dans PaymentForm

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="bg-primary-black overflow-hidden">
      <Navbar />
      <Elements stripe={stripePromise}>
        <div className="page-container">
          {/* Passons les fonctions de gestion de paiement au composant PaymentForm */}
          <PaymentForm onSuccessfulPayment={onSuccessfulPayment} onFailedPayment={onFailedPayment} />
        </div>
      </Elements>
      <Footer />
    </div>
  );
};

export default PagePaiement;
