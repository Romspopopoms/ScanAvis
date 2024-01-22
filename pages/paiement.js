import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useRouter } from 'next/router';
import PaymentForm from '../components/tableauStripe';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import Spinner from '../components/Spinner';

// Initialiser Stripe avec la clé publique
const stripePromise = loadStripe('pk_test_51OPtGvDWmnYPaxs1gSpLL1WpDyU6gaxOBszqNCSu9iHVeEYuPcjUEvOpKzjwdbF6NUWquoEPf24Y3qMwIDLmeLvl00FwQkUSKx');

const PagePaiement = () => {
  const [loading, setLoading] = useState(true);
  const { clearCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    // Vérifier que Stripe est chargé avant de retirer l'indicateur de chargement
    stripePromise.then(() => {
      setLoading(false);
    }).catch((error) => {
      console.error('Erreur lors du chargement de Stripe:', error);
      setLoading(false);
    });
  }, []);

  // Fonction appelée lorsque le paiement est réussi
  const onSuccessfulPayment = (paymentIntentId) => {
    clearCart();
    // Rediriger vers la page de statut de paiement avec l'intentID
    router.push(`/paymentstatus?paymentStatus=succeeded&paymentIntentId=${paymentIntentId}`);
  };

  // Fonction appelée en cas d'échec du paiement
  const onFailedPayment = (message) => {
    console.error('Erreur de paiement:', message);
    router.push(`/paymentstatus?paymentStatus=failed&message=${encodeURIComponent(message)}`);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="relative z-10 min-h-screen">
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
