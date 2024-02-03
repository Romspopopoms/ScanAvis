import React, { useContext } from 'react';
import { motion } from 'framer-motion';
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

  const cardVariants = {
    offscreen: {
      y: 50,
      opacity: 0,
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        bounce: 0.4,
        duration: 0.8,
      },
    },
  };

  if (!user) {
    return <div>Chargement...</div>;
  }

  return (
    <motion.div
      initial="offscreen"
      animate="onscreen"
      variants={cardVariants}
      className="container mx-auto p-4"
    >
      <h1 className="text-3xl font-bold text-center text-purple-800 mb-8">Mon Profil</h1>

      <motion.div
        className="bg-white shadow-xl rounded-lg p-6 mb-6"
        variants={cardVariants}
      >
        <p className="text-lg"><span className="font-semibold">Nom :</span> {user.name}</p>
        <p className="text-lg"><span className="font-semibold">Email :</span> {user.email}</p>
      </motion.div>

      {errorMessage && <p className="text-red-600">{errorMessage}</p>}

      {userSubscriptions.length > 0 ? (
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={cardVariants}
        >
          <h2 className="text-2xl font-bold text-purple-800 col-span-full">Abonnements</h2>

          {userSubscriptions.map((subscription, index) => (
            <motion.div
              key={index}
              className="bg-white shadow-xl rounded-lg p-6"
              variants={cardVariants}
            >
              <p className="text-lg"><span className="font-semibold">Produit :</span> {subscription.items}</p>
              <p className="text-lg"><span className="font-semibold">Statut :</span> {subscription.status}</p>
              <p className="text-lg"><span className="font-semibold">Montant Prochain Paiement :</span> {formatAmount(subscription.nextPaymentAmount)}</p>
              <p className="text-lg"><span className="font-semibold">Date du Prochain Paiement :</span> {new Date(subscription.nextPaymentDate).toLocaleDateString('fr-FR')}</p>
              {subscription.status === 'active' ? (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCancelSubscription(subscription.subscriptionId)}
                  className="bg-red-600 text-white px-4 py-2 rounded mt-4 hover:bg-red-700"
                >
                  Se désabonner
                </motion.button>
              ) : (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleResubscribe(subscription.subscriptionId)}
                  className="bg-green-600 text-white px-4 py-2 rounded mt-4 hover:bg-green-700"
                >
                  Se réabonner
                </motion.button>
              )}
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <p className="text-center">Aucun abonnement trouvé.</p>
      )}
    </motion.div>
  );
};

export default MonProfil;
