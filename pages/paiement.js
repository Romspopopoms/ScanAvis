import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useRouter } from 'next/router';
import PaymentForm from '../components/tableauStripe'; // Vérifiez le chemin
import Navbar from '../components/Navbar'; // Vérifiez le chemin
import Footer from '../components/Footer'; // Vérifiez le chemin
import { useCart } from '../context/CartContext'; // Vérifiez le chemin
import Spinner from '../components/Spinner'; // Ajoutez votre composant spinner si vous en avez un

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || 'pk_test_51OPtGvDWmnYPaxs1gSpLL1WpDyU6gaxOBszqNCSu9iHVeEYuPcjUEvOpKzjwdbF6NUWquoEPf24Y3qMwIDLmeLvl00FwQkUSKx');

const PagePaiement = () => {
  const [loading, setLoading] = useState(true); // Gérer l'état de chargement
  const { clearCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    stripePromise.then(() => {
      setLoading(false); // Arrêter le chargement une fois que Stripe est prêt
    }).catch((error) => {
      console.error('Erreur lors du chargement de Stripe:', error);
      setLoading(false); // Arrêter le chargement en cas d'erreur
      // Gérer l'erreur (peut-être modifier l'état pour afficher un message d'erreur à l'utilisateur)
    });
  }, []);

  if (loading) {
    return <Spinner />; // Utiliser un spinner ou autre indication de chargement
  }

  const handleSuccessfulPayment = () => {
    clearCart();
    router.push('/payment-status?paymentStatus=succeeded');
  };

  const handleFailedPayment = (message) => {
    console.error('Erreur de paiement:', message);
    router.push('/payment-status?paymentStatus=failed');
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
