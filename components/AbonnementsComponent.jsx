// AbonnementsComponent.js
import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const AbonnementsComponent = () => {
  const {
    userSubscriptions,
    handleResubscribe,
    handleCancelSubscription,
  } = useContext(AuthContext);

  const formatAmount = (amount) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-20">
      <motion.div className="w-full max-w-4xl bg-white shadow-xl rounded-lg p-6">
        <h2 className="text-3xl font-bold text-center text-purple-800 mb-6">Abonnements</h2>
        {userSubscriptions.length > 0 ? (
          userSubscriptions.map((subscription, index) => (
            <div key={index} className="bg-purple-100 shadow-md rounded-lg p-4 mb-4">
              <p className="text-lg font-semibold">Produit : <span className="font-normal">{subscription.items}</span></p>
              <p className="text-lg font-semibold">Statut : <span className="font-normal">{subscription.status}</span></p>
              <p className="text-lg font-semibold">Montant Prochain Paiement : <span className="font-normal">{formatAmount(subscription.nextPaymentAmount)}</span></p>
              <p className="text-lg font-semibold">Date du Prochain Paiement : <span className="font-normal">{new Date(subscription.nextPaymentDate).toLocaleDateString('fr-FR')}</span></p>
              <div className="mt-4 text-center">
                {subscription.status === 'active' ? (
                  <button type="button"
                    onClick={() => handleCancelSubscription(subscription.subscriptionId)}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Se désabonner
                  </button>
                ) : (
                  <button type="button"
                    onClick={() => handleResubscribe(subscription.subscriptionId)}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Se réabonner
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">Vous n'avez actuellement aucun abonnement actif.</p>
        )}
      </motion.div>
    </div>
  );
};

export default AbonnementsComponent;
