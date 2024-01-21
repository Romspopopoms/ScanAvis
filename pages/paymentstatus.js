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
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      if (!paymentStatus || !paymentIntentId) {
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
    <div className="gradient-01 fixed inset-0 z-0">
      <Navbar />
      <div className="content-container">
        {error ? (
          <div className="error-container">
            <h2>Oups !</h2>
            <p>Erreur : {error}</p>
            <Link href="/">
              <button type="button" className="btn btn-primary">Retour à l'accueil</button>
            </Link>
          </div>
        ) : !paymentStatus ? (
          <div className="status-container">
            <h2>Statut de Paiement Inconnu</h2>
            <p>Accès non autorisé à cette page ou paramètre manquant.</p>
            <Link href="/">
              <button type="button" className="btn btn-secondary">Retour à l'accueil</button>
            </Link>
          </div>
        ) : paymentStatus === 'succeeded' && transaction ? (
          <div className="success-container">
            <h1>Merci pour votre achat !</h1>
            <p>Votre transaction a été réalisée avec succès.</p>
            {/* Ici, vous pouvez ajouter des détails sur la transaction si nécessaire */}
            <Link href="/">
              <button type="button" className="btn btn-success">Retour à l'accueil</button>
            </Link>
          </div>
        ) : (
          <div className="failure-container">
            <h1>Oups, quelque chose s'est mal passé !</h1>
            <p>Malheureusement, une erreur est survenue lors du traitement de votre paiement.</p>
            <Link href="/retry-payment">
              <button type="button" className="btn btn-danger">Réessayer le Paiement</button>
            </Link>
            <Link href="/">
              <button type="button" className="btn btn-secondary">Retour à l'accueil</button>
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default PaymentStatusPage;
