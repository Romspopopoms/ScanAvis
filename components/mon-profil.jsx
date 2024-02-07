import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const MonProfil = () => {
  const {
    user,
    userSubscriptions,
    handleResubscribe,
    handleCancelSubscription,
    errorMessage,
    subscriptionsUpdate,
  } = useContext(AuthContext);

  const [entreprise, setEntreprise] = useState('');
  const [googleBusiness, setGoogleBusiness] = useState('');

  useEffect(() => {
  }, [subscriptionsUpdate]);

  const formatAmount = (amount) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delay: 0.3, duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.5 } },
  };

  const handleSubmit = () => {
    console.log("Mise à jour de l'entreprise :", entreprise);
    console.log('Mise à jour du Google Business :', googleBusiness);
    // Ici, ajoutez le code pour insérer/actualiser les valeurs dans votre base de données
  };

  if (!user) {
    return <div>Chargement...</div>;
  }

  return (
    <motion.div
      className="flex flex-col items-center justify-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div
        className="w-full max-w-4xl bg-white shadow-xl rounded-lg p-6 mb-6 mx-4"
        variants={containerVariants}
      >
        <h1 className="text-3xl font-bold text-center text-purple-800 mb-8">Mon Profil</h1>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <label htmlFor="entreprise" className="block text-lg font-semibold">Mon Entreprise:</label>
            <input
              id="entreprise"
              type="text"
              value={entreprise}
              onChange={(e) => setEntreprise(e.target.value)}
              className="mt-1 p-2 w-full border rounded"
            />
          </div>
          <div className="md:ml-4">
            <label htmlFor="googleBusiness" className="block text-lg font-semibold">Mon Google Business:</label>
            <input
              id="googleBusiness"
              type="text"
              value={googleBusiness}
              onChange={(e) => setGoogleBusiness(e.target.value)}
              className="mt-1 p-2 w-full border rounded"
            />
            <p className="mt-2 text-purple-800 hover:text-purple-600 cursor-pointer">Cliquez ici pour savoir quoi rentrer</p>
          </div>
          {errorMessage && <p className="text-red-600">{errorMessage}</p>}
        </div>
        <div className="mt-4 text-center">
          <button type="button"
            onClick={handleSubmit}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
          >
            Valider les Modifications
          </button>
        </div>
      </motion.div>

      <motion.div
        className="w-full max-w-4xl bg-white shadow-xl rounded-lg p-6 mx-4"
        variants={containerVariants}
      >
        <h2 className="text-2xl font-bold text-center text-purple-800 mb-6">Abonnements</h2>
        {userSubscriptions.length > 0 ? (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            {userSubscriptions.map((subscription, index) => (
              <div key={index} className="flex-1 bg-purple-100 shadow-md rounded-lg p-4">
                <p className="text-lg font-semibold">Produit : <span className="font-normal">{subscription.items}</span></p>
                <p className="text-lg font-semibold">Statut : <span className="font-normal">{subscription.status}</span></p>
                <p className="text-lg font-semibold">Montant Prochain Paiement : <span className="font-normal">{formatAmount(subscription.nextPaymentAmount)}</span></p>
                <p className="text-lg font-semibold">Date du Prochain Paiement : <span className="font-normal">{new Date(subscription.nextPaymentDate).toLocaleDateString('fr-FR')}</span></p>
                <div className="mt-4 text-center">
                  {subscription.status === 'active' ? (
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCancelSubscription(subscription.subscriptionId)}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Se désabonner
                    </motion.button>
                  ) : (
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleResubscribe(subscription.subscriptionId)}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Se réabonner
                    </motion.button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <p className="text-lg">Vous n'avez actuellement aucun abonnement actif.</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default MonProfil;
