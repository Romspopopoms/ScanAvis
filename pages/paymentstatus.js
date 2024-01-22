import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
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
    <div className="page-container">
      <Navbar />
      <div className="payment-status-main">
        {error ? (
          <div className="message-container error-message">
            <h2>Oups !</h2>
            <p>Erreur : {error}</p>
            <Link href="/" passHref>
              <button type="button" className="btn btn-primary">Retour à l'accueil</button>
            </Link>
          </div>
        ) : !paymentStatus || paymentStatus === 'failed' ? (
          <div className="message-container error-message">
            <h2>Statut de Paiement Inconnu</h2>
            <p>Accès non autorisé à cette page ou paramètre manquant.</p>
            <Link href="/" passHref>
              <button type="button" className="btn btn-secondary">Retour à l'accueil</button>
            </Link>
          </div>
        ) : (
          <div className="message-container success-message">
            <h1>Merci pour votre achat !</h1>
            <p>Votre transaction a été réalisée avec succès.</p>
            {transaction && (
              <div>
                <p>ID de transaction : {transaction.transactionId}</p>
                <p>Montant : {transaction.totalAmount}</p>
                <p>Date de création : {new Date(transaction.createdAt).toLocaleString()}</p>
                {/* Afficher les articles de la transaction si vous le souhaitez */}
                <p>Articles :</p>
                <ul>
                  {transaction.items.map((item, index) => (
                    <li key={index}>{item.name} - Quantité : {item.quantity} - Prix : {item.price}</li>
                  ))}
                </ul>
                {/* Ajoutez d'autres détails de transaction si nécessaire */}
              </div>
            )}
            <Link href="/" passHref>
              <button type="button" className="btn btn-success">Retour à l'accueil</button>
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default PaymentStatusPage;
