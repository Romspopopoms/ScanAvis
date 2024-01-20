import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from '../components/tableauStripe'; // Assurez-vous que le chemin est correct
import Navbar from '../components/Navbar'; // Assurez-vous que le chemin est correct
import Footer from '../components/Footer'; // Assurez-vous que le chemin est correct
import { useCart } from '../context/CartContext'; // Assurez-vous que ce chemin est correct

// Chargez Stripe avec votre clé publique
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || 'pk_test_51OPtGvDWmnYPaxs1gSpLL1WpDyU6gaxOBszqNCSu9iHVeEYuPcjUEvOpKzjwdbF6NUWquoEPf24Y3qMwIDLmeLvl00FwQkUSKx');

const PagePaiement = () => {
  const [isClient, setIsClient] = useState(false);
  const { cartItems, clearCart } = useCart();

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

  // Gestion du succès du paiement
  const handleSuccessfulPayment = () => {
    // Vous pouvez ajouter des actions après le paiement réussi ici
    clearCart(); // Vide le panier après le paiement réussi
    // Rediriger vers une page de succès ou afficher un message de succès
  };

  // Gestion de l'échec du paiement
  const handleFailedPayment = (message) => {
    // Vous pouvez gérer l'échec du paiement ici
    console.error('Erreur de paiement:', message);
    // Afficher un message d'erreur ou rediriger vers une page d'erreur
  };

  return (
    <div className="bg-primary-black overflow-hidden">
      <div className="gradient-01 absolute inset-0 z-0" />
      <Navbar />
      <Elements stripe={stripePromise}>
        <div className="page-container">
          <PaymentForm
            cartItems={cartItems}
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
