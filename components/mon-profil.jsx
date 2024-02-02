import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const MonProfil = () => {
  const {
    user,
    userSubscriptions,
    handleResubscribe,
    handleCancelSubscription,
    errorMessage,
  } = useContext(AuthContext);

  const formatAmount = (amount) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

  if (!user) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto pt-16 p-4">
      <h1 className="text-2xl font-bold mb-4">Mon Profil</h1>
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <p><span className="font-bold">Nom :</span> {user.name}</p>
        <p><span className="font-bold">Email :</span> {user.email}</p>
      </div>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      {userSubscriptions.length > 0 ? (
        <div>
          <h2 className="text-xl font-bold mb-4">Abonnements</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {userSubscriptions.map((subscription, index) => (
              <div key={index} className="bg-white shadow-md rounded-lg p-4">
                <p><span className="font-bold">Produit :</span> {subscription.items}</p>
                <p><span className="font-bold">Statut :</span> {subscription.status}</p>
                <p><span className="font-bold">Montant Prochain Paiement :</span> {formatAmount(subscription.nextPaymentAmount)}</p>
                <p><span className="font-bold">Date du Prochain Paiement :</span> {new Date(subscription.nextPaymentDate).toLocaleDateString()}</p>
                {subscription.status === 'active' ? (
                  <button
                    type="button"
                    onClick={() => handleCancelSubscription(subscription.subscriptionId)}
                    className="bg-red-500 text-white px-4 py-2 rounded mt-4 hover:bg-red-700"
                  >
                    Se désabonner
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleResubscribe(subscription.subscriptionId)}
                    className="bg-green-500 text-white px-4 py-2 rounded mt-4 hover:bg-green-700"
                  >
                    Se réabonner
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
