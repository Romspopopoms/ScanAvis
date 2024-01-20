// pages/payment-status.js

import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const PaymentStatusPage = () => {
  const router = useRouter();
  const { paymentStatus } = router.query;

  if (!paymentStatus) {
    // Rediriger vers une page appropriée ou afficher un message si paymentStatus n'est pas défini
    return <div>Accès non autorisé à cette page ou paramètre manquant.</div>;
  }

  return (
    <div className="payment-status-page">
      {paymentStatus === 'succeeded' ? (
        <div className="success-message">
          <h1>Merci pour votre achat !</h1>
          <p>Votre transaction a été réalisée avec succès. Nous apprécions votre confiance et nous espérons que vous serez satisfait de votre achat.</p>
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
  );
};

export default PaymentStatusPage;
