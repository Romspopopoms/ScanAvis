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
    entreprise,
    setEntreprise,
    setGoogleBusiness,
    googleBusiness,
    fetchUserDetails, // Supposons que cette fonction récupère les détails actuels de l'utilisateur
    updateUserDetails,
  } = useContext(AuthContext);

  useEffect(() => {}, [subscriptionsUpdate]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delay: 0.3, duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.5 } },
  };

  const [isEditing, setIsEditing] = useState(false);

  const formatAmount = (amount) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

  const handleSubmit = async () => {
    await updateUserDetails(user.uuid, entreprise, googleBusiness); // Met à jour les détails dans la base de données
    setIsEditing(false); // Désactive le mode d'édition après la mise à jour
    fetchUserDetails(user.uuid); // Rafraîchit les informations de l'utilisateur après la mise à jour
  };

  return (
    <motion.div className="flex flex-col items-center justify-center min-h-screen">
      <motion.div className="w-full max-w-4xl bg-white shadow-xl rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-center text-purple-800 mb-8">Mon Profil</h1>

        {/* Affichage conditionnel basé sur isEditing */}
        {isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              value={entreprise}
              onChange={(e) => setEntreprise(e.target.value)}
              className="mt-1 p-2 w-full border rounded"
            />
            <input
              type="text"
              value={googleBusiness}
              onChange={(e) => setGoogleBusiness(e.target.value)}
              className="mt-1 p-2 w-full border rounded"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <p><strong>Entreprise:</strong> {entreprise}</p>
            <p><strong>Google Business:</strong> {googleBusiness}</p>
          </div>
        )}

        {isEditing && (
          <div className="text-center mt-6">
            <button type="button"
              onClick={handleSubmit}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
            >
              Enregistrer les modifications
            </button>
          </div>
        )}

        {!isEditing && (
          <div className="text-center mt-6">
            <button type="button"
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Modifier
            </button>
          </div>
        )}

        {errorMessage && <p className="text-red-600 text-center mt-4">{errorMessage}</p>}
      </motion.div>

      <motion.div
        className="w-full max-w-4xl bg-white shadow-xl rounded-lg p-6"
        variants={containerVariants}
      >
        <h2 className="text-2xl font-bold text-center text-purple-800 mb-6">Abonnements</h2>
        {userSubscriptions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userSubscriptions.map((subscription, index) => (
              <div key={index} className="bg-purple-100 shadow-md rounded-lg p-4">
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
            ))}
          </div>
        ) : (
          <p className="text-center">Vous n'avez actuellement aucun abonnement actif.</p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default MonProfil;
