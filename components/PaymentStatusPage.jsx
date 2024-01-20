// pages/payment-status.js

import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const PaymentStatusPage = () => {
  const router = useRouter();
  const { paymentStatus } = router.query;

  return (
    <div className="payment-status-page">
      {paymentStatus === 'succeeded' ? (
        <>
          <h1>Paiement Réussi !</h1>
          <p>Votre paiement a été traité avec succès.</p>
          <Link href="/">
            <button type="button" className="btn btn-success">
              Retour à l'accueil
            </button>
          </Link>
        </>
      ) : (
        <>
          <h1>Paiement Échoué</h1>
          <p>Une erreur est survenue lors du traitement de votre paiement.</p>
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
        </>
      )}
    </div>
  );
};

export default PaymentStatusPage;
