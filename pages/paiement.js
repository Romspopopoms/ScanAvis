import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from '../components/tableauStripe'; // Assurez-vous que le chemin est correct
import Navbar from '../components/Navbar'; // Assurez-vous que le chemin est correct
import Footer from '../components/Footer'; // Assurez-vous que le chemin est correct
import { useCart } from '../context/CartContext'; // Assurez-vous que ce chemin est correct

// Chargez Stripe avec votre clé publique
const stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY || 'pk_test_51OPtGvDWmnYPaxs1gSpLL1WpDyU6gaxOBszqNCSu9iHVeEyuPcjUEvOpKzjwdbF6NUWquoEPf24Y3qMwIDLmeLvl00FwQkUSKx');

const PagePaiement = () => {
  const [isClient, setIsClient] = useState(false);
  const { cartItems } = useCart();

  // S'assure que Stripe est chargé du côté client
  useEffect(() => {
    setIsClient(true);
  }, []);

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

  // Afficher le formulaire de paiement si le panier n'est pas vide
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
