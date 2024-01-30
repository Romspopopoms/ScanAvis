import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../components/CheckoutForm'; // Utilisez CheckoutForm pour les abonnements
import Spinner from '../components/Spinner';

const stripePromise = loadStripe('pk_test_51OPtGvDWmnYPaxs1gSpLL1WpDyU6gaxOBszqNCSu9iHVeEYuPcjUEvOpKzjwdbF6NUWquoEPf24Y3qMwIDLmeLvl00FwQkUSKx');

const PagePaiement = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    stripePromise.then(() => {
      setLoading(false);
    }).catch((error) => {
      console.error('Erreur lors du chargement de Stripe:', error);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="relative z-10 min-h-screen">
      <Elements stripe={stripePromise}>
        <div className="page-container">
          {/* Utilisez CheckoutForm pour les abonnements */}
          <CheckoutForm />
        </div>
      </Elements>
    </div>
  );
};

export default PagePaiement;
