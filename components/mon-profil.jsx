import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const MonProfil = () => {
  const {
    user,
    setUser,
    userSubscriptions,
    handleResubscribe,
    handleCancelSubscription,
    errorMessage,
    setErrorMessage,
    fetchUserDetails,
    updateUserDetails,
  } = useContext(AuthContext);

  const formatAmount = (amount) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

  const [isEditing, setIsEditing] = useState(false);
  const [localEmail, setLocalEmail] = useState(user?.email || '');
  const [localEntreprise, setLocalEntreprise] = useState('');
  const [localGoogleBusiness, setLocalGoogleBusiness] = useState('');

  useEffect(() => {
    setLocalEmail(user?.email || '');
    setLocalEntreprise(user?.entreprise || '');
    setLocalGoogleBusiness(user?.googleBusiness || '');
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserDetails(user.uuid, localEmail, localEntreprise, localGoogleBusiness);

      setUser((prevUser) => ({
        ...prevUser,
        email: localEmail,
        entreprise: localEntreprise,
        googleBusiness: localGoogleBusiness,
      }));

      setIsEditing(false);
      setErrorMessage('');
    } catch (error) {
      console.error('Erreur lors de la mise à jour des détails de l’utilisateur :', error);
      setErrorMessage('Erreur lors de la mise à jour des informations.');
    }
  };

  useEffect(() => {
    if (user?.uuid) {
      fetchUserDetails(user.uuid);
    }
  }, [user?.uuid]);

  return (
    <motion.div className="flex flex-col items-center justify-center min-h-screen">
      <motion.div className="w-full max-w-4xl bg-white shadow-xl rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-center text-purple-800 mb-8">Mon Profil</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="email" className="block">Email:</label>
              <input
                id="email"
                type="email"
                value={localEmail}
                onChange={(e) => setLocalEmail(e.target.value)}
                disabled={!isEditing}
                className="mt-1 p-2 w-full border rounded"
              />
            </div>
            <div>
              <label htmlFor="entreprise" className="block">Entreprise:</label>
              <input
                id="entreprise"
                type="text"
                value={localEntreprise}
                onChange={(e) => setLocalEntreprise(e.target.value)}
                disabled={!isEditing}
                className="mt-1 p-2 w-full border rounded"
              />
            </div>
            <div>
              <label htmlFor="googleBusiness" className="block">Google Business:</label>
              <input
                id="googleBusiness"
                type="text"
                value={localGoogleBusiness}
                onChange={(e) => setLocalGoogleBusiness(e.target.value)}
                disabled={!isEditing}
                className="mt-1 p-2 w-full border rounded"
              />
            </div>
          </div>

          <div className="flex justify-between">
            {isEditing ? (
              <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
                Enregistrer les modifications
              </button>
            ) : (
              <button type="button" onClick={() => setIsEditing(true)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Modifier
              </button>
            )}
          </div>
        </form>

        {errorMessage && <p className="text-red-500 text-center mt-4">{errorMessage}</p>}
      </motion.div>

      <motion.div className="w-full max-w-4xl bg-white shadow-xl rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center text-purple-800 mb-6">Abonnements</h2>
        {userSubscriptions.length > 0 ? (
          userSubscriptions.map((subscription, index) => (
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
          ))
        ) : (
          <p className="text-center">Vous n'avez actuellement aucun abonnement actif.</p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default MonProfil;
