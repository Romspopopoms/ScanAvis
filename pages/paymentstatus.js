import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Spinner from '../components/Spinner';

const PaymentStatusPage = () => {
  const router = useRouter();
  const { paymentStatus, paymentIntentId } = router.query;
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      if (paymentStatus !== 'succeeded' || !paymentIntentId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/.netlify/functions/get-transaction?paymentIntentId=${paymentIntentId}`);
        if (!response.ok) throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
        const data = await response.json();
        if (!data.transaction) throw new Error('Aucune donnée de transaction reçue');
        setTransaction(data.transaction);
      } catch (err) {
        console.error('Erreur lors de la récupération de la transaction:', err);
        setError('Échec de la récupération des données de transaction');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionDetails();
  }, [paymentStatus, paymentIntentId]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen flex justify-center items-center p-4">
      <div className="max-w-lg w-full bg-white shadow-xl rounded-lg p-8">
        {error ? (
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-600 mb-4">Oups !</h2>
            <p className="mb-4">Erreur : {error}</p>
            <Link href="/"
              className="inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition duration-200"
            >
              Retour à l'accueil
            </Link>
          </div>
        ) : !paymentStatus || paymentStatus === 'failed' ? (
          <div className="text-center">
            <h2 className="text-xl font-bold text-yellow-500 mb-4">Statut de Paiement Inconnu</h2>
            <p className="mb-4">Accès non autorisé à cette page ou paramètre manquant.</p>
            <Link href="/"
              className="inline-block bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition duration-200"
            >
              Retour à l'accueil
            </Link>
          </div>
        ) : (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-green-600 mb-4">Merci pour votre achat !</h1>
            <p className="mb-4">Votre transaction a été réalisée avec succès.</p>
            {transaction && (
              <div className="text-left">
                <p className="font-semibold">ID de transaction : <span className="font-normal">{transaction.transactionId}</span></p>
                <p className="font-semibold">Montant : <span className="font-normal">${(transaction.totalAmount / 100).toFixed(2)}</span></p>
                <p className="font-semibold">Date de création : <span className="font-normal">{new Date(transaction.createdAt).toLocaleString()}</span></p>
                <p className="font-semibold mb-2">Articles :</p>
                <ul className="list-disc pl-5">
                  {transaction.items.map((item, index) => (
                    <li key={index} className="mb-1">
                      <span className="font-semibold">{item.name}</span> - Quantité : <span className="font-normal">{item.quantity}</span> - Prix : <span className="font-normal">${(item.price / 100).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <Link href="/"
              className="inline-block bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition duration-200 mt-4"
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
