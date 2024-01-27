import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext'; // Assurez-vous que le chemin est correct

const MonProfil = () => {
  const { user, logout } = useContext(AuthContext);
  const [userPayments, setUserPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      if (!user || !user.uuid) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch('/.netlify/functions/getUserPayments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userUuid: user.uuid }), // Assurez-vous que user.uuid est correct et contient l'UUID de l'utilisateur
        });

        if (!response.ok) {
          throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
        }

        const { transactions } = await response.json(); // Assurez-vous que la clé est 'transactions' dans la réponse JSON
        setUserPayments(transactions);
      } catch (error) {
        console.error('Erreur lors de la récupération des paiements utilisateur :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [user]);

  if (!user || loading) {
    return <div>Chargement de votre profil...</div>;
  }

  return (
    <div className="profile-container">
      <h1>Mon Profil</h1>
      <button type="button" onClick={logout}>Déconnexion</button>
      <div className="profile-details">
        <p>Nom: {user.name}</p>
        <p>Email: {user.email}</p>
        {userPayments.length > 0 ? (
          <div>
            <h2>Paiements</h2>
            {userPayments.map((payment, index) => (
              <div key={index} className="payment-details">
                <p>Transaction ID: {payment.transactionId}</p>
                <p>Items: {JSON.stringify(payment.items)}</p>
                <p>Montant Total: {payment.totalAmount}</p>
                <p>Date: {new Date(payment.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>Aucun paiement trouvé.</p>
        )}
      </div>
    </div>
  );
};

export default MonProfil;
