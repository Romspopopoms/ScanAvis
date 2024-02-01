// MonProfil.js
import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';

const MonProfil = () => {
  const { user } = useContext(AuthContext);
  const [userSubscriptions, setUserSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Déclaration de fetchSubscriptions avant son utilisation dans cancelSubscription
  const fetchSubscriptions = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/.netlify/functions/getUserSubscriptions?userUuid=${user.uuid}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 404) {
        setUserSubscriptions([]); // Aucune souscription trouvée
      } else if (!response.ok) {
        throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
      } else {
        const data = await response.json();
        setUserSubscriptions(data.subscriptions || []);
      }
    } catch (fetchError) {
      console.error('Erreur lors de la récupération des abonnements utilisateur:', fetchError);
      setError(`Erreur lors de la récupération des abonnements: ${fetchError.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.uuid) {
      fetchSubscriptions();
    }
  }, [user]);

  const cancelSubscription = async (subscriptionId) => {
    try {
      const response = await fetch('/.netlify/functions/cancelSubscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
      }

      // Rafraîchir la liste des abonnements pour mettre à jour l'UI
      fetchSubscriptions();
    } catch (cancelError) { // Renommez 'error' en 'cancelError' pour éviter l'ombre
      console.error('Erreur lors de l’annulation de l’abonnement:', cancelError);
      setError(`Erreur lors de l’annulation de l’abonnement: ${cancelError.message}`);
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Chargement de vos abonnements...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto pt-16 p-4">
        <h1 className="text-2xl font-bold mb-4">Mon Profil</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-16 p-4">
      <h1 className="text-2xl font-bold mb-4">Mon Profil</h1>
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <p><span className="font-bold">Nom:</span> {user.name}</p>
        <p><span className="font-bold">Email:</span> {user.email}</p>
      </div>

      {userSubscriptions.length > 0 ? (
        <div>
          <h2 className="text-xl font-bold mb-4">Abonnements</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {userSubscriptions.map((subscription, index) => (
              <div key={index} className="bg-white shadow-md rounded-lg p-4">
                <p><span className="font-bold">ID de souscription:</span> {subscription.subscriptionId}</p>
                <p><span className="font-bold">Produit:</span> {subscription.items}</p>
                <p><span className="font-bold">Statut:</span> {subscription.status}</p>
                <p><span className="font-bold">Montant Prochain Paiement:</span> {subscription.nextPaymentAmount}</p>
                <p><span className="font-bold">Date du Prochain Paiement:</span> {new Date(subscription.nextPaymentDate).toLocaleDateString()}</p>
                {subscription.status === 'active' && (
                  <button type="button"
                    onClick={() => cancelSubscription(subscription.subscriptionId)}
                    className="bg-red-500 text-white px-4 py-2 rounded mt-4 hover:bg-red-700"
                  >
                    Se désabonner
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>Aucun abonnement trouvé.</p>
      )}
    </div>
  );
};

export default MonProfil;
