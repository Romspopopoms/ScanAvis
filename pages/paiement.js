// PagePaiement.js
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from '../components/tableauStripe'; // Assurez-vous que le chemin est correct
import { Navbar, Footer } from '../components'; // Assurez-vous que les chemins sont corrects
import { useCart } from '../context/CartContext'; // Assurez-vous que ce chemin est correct

const stripePromise = loadStripe('pk_test_51OPtGvDWmnYPaxs1gSpLL1WpDyU6gaxOBszqNCSu9iHVeEyuPcjUEvOpKzjwdbF6NUWquoEPf24Y3qMwIDLmeLvl00FwQkUSKx');

const PagePaiement = () => {
  const [isClient, setIsClient] = useState(false);
  const { cartItems } = useCart();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div>Loading...</div>;
  }

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <div className="empty-cart-message">Votre panier est vide.</div>
        <Footer />
      </>
    );
  }

  return (
    <div className="bg-primary-black overflow-hidden">
      <div className="gradient-01 absolute inset-0 z-0" />
      <Navbar />
      <Elements stripe={stripePromise}>
        <div className="page-container">
          <PaymentForm cartItems={cartItems} />
        </div>
      </Elements>
      <Footer />
    </div>
  );
};

export default PagePaiement;
