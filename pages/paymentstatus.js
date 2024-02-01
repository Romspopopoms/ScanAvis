import React from 'react';
import Link from 'next/link';
import { usePayment } from '../context/PaymentContext';
import Spinner from '../components/Spinner';

const PaymentStatusPage = () => {
  const { paymentStatus, paymentMessage, paymentDetails } = usePayment();
  console.log('Payment Status:', paymentStatus);
  console.log('Payment Message:', paymentMessage);
  console.log('Payment Details:', paymentDetails);

  if (!paymentStatus || paymentStatus === 'loading') {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen flex justify-center items-center p-4">
      <div className="max-w-lg w-full bg-white shadow-xl rounded-lg p-8">
        {paymentStatus === 'failed' ? (
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-600 mb-4">Oups !</h2>
            <p className="mb-4">Erreur : {paymentMessage}</p>
            <Link href="/paiement"
              className="inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition duration-200"
            >
              Réessayer le paiement

            </Link>
          </div>
        ) : paymentStatus === 'succeeded' ? (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-green-600 mb-4">Merci pour votre achat !</h1>
            <p className="mb-4">Votre transaction a été réalisée avec succès.</p>
            {paymentDetails && (
              <div className="text-left">
                <p className="font-semibold">ID de souscription : <span className="font-normal">{paymentDetails.subscriptionId}</span></p>
                <p className="font-semibold">Montant : <span className="font-normal">${paymentDetails.amount.toFixed(2)}</span></p>
                <p className="font-semibold">Nom du service : <span className="font-normal">{paymentDetails.serviceName}</span></p>
                <p className="font-semibold">Date de création : <span className="font-normal">{new Date(paymentDetails.createdAt).toLocaleString()}</span></p>
              </div>
            )}
            <Link href="/"
              className="inline-block bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition duration-200 mt-4"
            >
              Retour à l'accueil
            </Link>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-xl font-bold text-yellow-500 mb-4">Statut de Paiement Inconnu</h2>
            <p className="mb-4">Accès non autorisé à cette page ou paramètre manquant.</p>
            <Link href="/"
              className="inline-block bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition duration-200"
            >
              Retour à l'accueil
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentStatusPage;
