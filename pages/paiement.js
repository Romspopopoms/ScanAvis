import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from '../components/tableauStripe'; // Vérifiez le chemin
import Navbar from '../components/Navbar'; // Vérifiez le chemin
import Footer from '../components/Footer'; // Vérifiez le chemin
import { useCart } from '../context/CartContext'; // Vérifiez le chemin

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || 'pk_test_51OPtGvDWmnYPaxs1gSpLL1WpDyU6gaxOBszqNCSu9iHVeEYuPcjUEvOpKzjwdbF6NUWquoEPf24Y3qMwIDLmeLvl00FwQkUSKx');

const PagePaiement = () => {
  const [isClient, setIsClient] = useState(false);
  const { clearCart } = useCart();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div>Chargement...</div>;
  }

  const handleSuccessfulPayment = () => {
    clearCart();
    // Redirection ou message de succès
  };

  const handleFailedPayment = (message) => {
    console.error('Erreur de paiement:', message);
    // Gestion de l'échec du paiement
  };

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
