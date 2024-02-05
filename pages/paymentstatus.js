import React from 'react';
import Link from 'next/link';
import { usePayment } from '../context/PaymentContext';
import Spinner from '../components/Spinner';

const PaymentStatusPage = () => {
  const { paymentStatus, paymentMessage, paymentDetails } = usePayment();

  // Affichez les logs pour le débogage
  console.log('Payment Status:', paymentStatus);
  console.log('Payment Message:', paymentMessage);
  console.log('Payment Details in PaymentStatusPage:', paymentDetails);

  if (!paymentStatus || paymentStatus === 'loading') {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen flex justify-center items-center p-4">
      <div className="max-w-lg w-full bg-white shadow-xl rounded-lg p-8">
        {paymentStatus === 'failed' && (
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-600 mb-4">Oups !</h2>
            <p className="mb-4">Erreur : {paymentMessage}</p>
            <Link href="/paiement" passHref
              className="inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition duration-200"
            >
              Réessayer le paiement
            </Link>
          </div>
        )}
        {paymentStatus === 'succeeded' && paymentDetails && (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-green-600 mb-4">Merci pour votre achat !</h1>
            <p className="mb-4">Votre transaction a été réalisée avec succès.</p>
            <div className="text-left">
              <p className="font-semibold">Montant : <span className="font-normal">${paymentDetails.amount ? paymentDetails.amount.toFixed(2) : 'Non disponible'}</span></p>
              <p className="font-semibold">Nom du service : <span className="font-normal">{paymentDetails.serviceName ?? 'Non disponible'}</span></p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Retrouvez vos informations dans votre page profil !</h2>
              <div className="inline-block">
                <Link href="/" passHref
                  className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition duration-200 mr-4"
                >
                  Retour à l'accueil
                </Link>
                <Link href="/mon-profil" className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition duration-200 ml-4">
                  Mon Profil
                </Link>
              </div>
            </div>
          </div>
        )}
        {paymentStatus !== 'failed' && paymentStatus !== 'succeeded' && (
          <div className="text-center">
            <h2 className="text-xl font-bold text-yellow-500 mb-4">Statut de Paiement Inconnu</h2>
            <p className="mb-4">Accès non autorisé à cette page ou paramètre manquant.</p>
            <Link href="/" passHref
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
