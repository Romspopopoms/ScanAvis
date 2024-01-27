import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';

const MonProfil = () => {
  const { user, logout } = useContext(AuthContext);
  const [userPayments, setUserPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      // Votre code existant pour le début de la fonction

      try {
        const response = await fetch('/.netlify/functions/getUserPayments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userUuid: user.uuid }),
        });

        if (!response.ok) {
          throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
        }

        const data = await response.json(); // Parse la réponse du serveur
        // Vérifiez si data.transactions et data.transactions.body existent et sont des chaînes
        if (data.transactions && typeof data.transactions.body === 'string') {
          const transactionsObject = JSON.parse(data.transactions.body); // Parsez le contenu de body pour obtenir l'objet des transactions
          if (transactionsObject.transactions && transactionsObject.transactions.length > 0) {
            setUserPayments(transactionsObject.transactions);
          } else {
            setError('Aucun paiement trouvé.');
          }
        } else {
          // Gérer le cas où data.transactions.body est undefined ou n'est pas une chaîne
          setError('Réponse inattendue du serveur.');
        }
      } catch (fetchError) {
        console.error('Erreur lors de la récupération des paiements utilisateur :', fetchError);
        setError(`Erreur lors de la récupération des paiements : ${fetchError.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [user]); // La dépendance [user] permet de refaire la requête si l'utilisateur change

  if (loading) {
    return <div>Chargement de votre profil...</div>;
  }

  if (error) {
    return (
      <div className="profile-container">
        <h1>Mon Profil</h1>
        <p>{error}</p>
        <button type="button" onClick={logout}>Déconnexion</button>
      </div>
    );
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
                <p>Articles: {payment.items.map((item) => `ID: ${item.id}, Quantité: ${item.quantity}`).join(', ')}</p>
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
