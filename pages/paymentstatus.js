import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PaymentStatusPage = () => {
  const router = useRouter();
  const { paymentStatus, paymentIntentId } = router.query; // Assurez-vous que paymentIntentId est passé en tant que paramètre de requête
  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    const fetchTransaction = async () => {
      if (paymentStatus === 'succeeded' && paymentIntentId) {
        try {
          const response = await fetch(`/.netlify/functions/get-transaction?paymentIntentId=${paymentIntentId}`);
          if (response.ok) {
            const data = await response.json();
            setTransaction(data.transaction);
          } else {
            throw new Error('Failed to fetch transaction data');
          }
        } catch (error) {
          console.error('Error fetching transaction:', error);
        }
      }
    };

    fetchTransaction();
  }, [paymentStatus, paymentIntentId]);

  // Affichage en cas d'accès non autorisé ou de paramètre manquant
  if (!paymentStatus) {
    return (
      <div className="gradient-01 fixed inset-0 z-0">
        <div className="relative z-10 min-h-screen">
          <Navbar />
          <div className="content-container">
            <p>Accès non autorisé à cette page ou paramètre manquant.</p>
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 min-h-screen">
      <Navbar />
      <div className="payment-status-page">
        {paymentStatus === 'succeeded' ? (
          <div className="success-message">
            <h1>Merci pour votre achat !</h1>
            <p>Votre transaction a été réalisée avec succès. Nous apprécions votre confiance et nous espérons que vous serez satisfait de votre achat.</p>

            {transaction && (
              <div className="order-summary">
                <h2>Récapitulatif de la commande</h2>
                <p>Date de la commande: {new Date(transaction.createdAt).toLocaleString()}</p>
                <p>ID de la transaction: {transaction.paymentIntentId}</p>
                <p>Articles commandés: {JSON.stringify(transaction.items)}</p>
                <p>Montant total: {transaction.totalAmount}€</p>
              </div>
            )}

            <Link href="/">
              <button type="button" className="btn btn-primary">
                Retour à l'accueil
              </button>
            </Link>
          </div>
        ) : (
          <div className="error-message">
            <h1>Oups, quelque chose s'est mal passé !</h1>
            <p>Malheureusement, une erreur est survenue lors du traitement de votre paiement. Vous pouvez réessayer le paiement ou contacter notre support pour obtenir de l'aide.</p>
            <Link href="/retry-payment">
              <button type="button" className="btn btn-danger">
                Réessayer le Paiement
              </button>
            </Link>
            <Link href="/">
              <button type="button" className="btn btn-secondary">
                Retour à l'accueil
              </button>
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default PaymentStatusPage;
