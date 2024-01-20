import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from '../components/tableauStripe';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

// Chargez Stripe avec votre clé publique
const stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY || 'pk_test_51OPtGvDWmnYPaxs1gSpLL1WpDyU6gaxOBszqNCSu9iHVeEYuPcjUEvOpKzjwdbF6NUWquoEPf24Y3qMwIDLmeLvl00FwQkUSKx');

const PagePaiement = () => {
  const [isClient, setIsClient] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // Ajouté pour suivre le statut du paiement
  const { cartItems, clearCart } = useCart();

  // S'assure que Stripe est chargé du côté client
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSuccessfulPayment = () => {
    setPaymentStatus('success');
    clearCart(); // Optionnel: Vider le panier après un paiement réussi
  };

  const handleFailedPayment = (message) => {
    setPaymentStatus('failure');
    console.error('Erreur de paiement:', message);
  };

  // Afficher un message de chargement jusqu'à ce que Stripe soit chargé
  if (!isClient) {
    return <div>Chargement...</div>;
  }

  // Afficher un message si le panier est vide
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
          {paymentStatus === 'success' ? (
            <div className="payment-success-message">Votre paiement a été réussi !</div>
          ) : paymentStatus === 'failure' ? (
            <div className="payment-failure-message">Une erreur est survenue lors du paiement.</div>
          ) : (
            <PaymentForm
              cartItems={cartItems}
              onSuccessfulPayment={handleSuccessfulPayment}
              onFailedPayment={handleFailedPayment}
            />
          )}
        </div>
      </Elements>
      <Footer />
    </div>
  );
};

export default PagePaiement;
