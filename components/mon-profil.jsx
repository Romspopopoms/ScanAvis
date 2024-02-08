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
  // Initialisation des états locaux avec les valeurs actuelles de l'utilisateur
  const [localEmail, setLocalEmail] = useState(user?.email || '');
  const [localEntreprise, setLocalEntreprise] = useState(user?.entreprise || '');
  const [localGoogleBusiness, setLocalGoogleBusiness] = useState(user?.googleBusiness || '');

  // Fonction pour soumettre les modifications
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    try {
      // Appel à updateUserDetails pour mettre à jour les informations de l'utilisateur
      await updateUserDetails(user.uuid, localEmail, localEntreprise, localGoogleBusiness);

      // Mise à jour de l'utilisateur dans le contexte
      setUser((prevUser) => ({
        ...prevUser,
        email: localEmail,
        entreprise: localEntreprise,
        googleBusiness: localGoogleBusiness,
      }));

      setIsEditing(false); // Sortie du mode édition
      setErrorMessage(''); // Réinitialisation des messages d'erreur
    } catch (error) {
      console.error('Erreur lors de la mise à jour des détails de l’utilisateur :', error);
      setErrorMessage('Erreur lors de la mise à jour des informations.');
    }
  };

  // Effet pour récupérer les détails de l'utilisateur à l'initialisation
  useEffect(() => {
    if (user?.uuid) {
      fetchUserDetails(user.uuid);
    }
  }, [user?.uuid, fetchUserDetails]);

  return (
    <motion.div className="flex flex-col items-center justify-center min-h-screen">
      {/* Profil utilisateur */}
      <motion.div className="w-full max-w-4xl bg-white shadow-xl rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-center text-purple-800 mb-8">Mon Profil</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <p><strong>Nom:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
              <input
                id="email"
                type="email"
                value={localEmail}
                onChange={(e) => setLocalEmail(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label htmlFor="entreprise" className="block text-sm font-medium text-gray-700">Entreprise:</label>
              <input
                id="entreprise"
                type="text"
                value={localEntreprise}
                onChange={(e) => setLocalEntreprise(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded shadow-sm p-2"
              />
            </div>
            <div>
              <label htmlFor="googleBusiness" className="block text-sm font-medium text-gray-700">Google Business:</label>
              <input
                id="googleBusiness"
                type="text"
                value={localGoogleBusiness}
                onChange={(e) => setLocalGoogleBusiness(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded shadow-sm p-2"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Enregistrer les modifications
              </button>
            </div>
          </form>
        ) : (
          <div className="text-right">
            <button type="button"
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Modifier
            </button>
          </div>
        )}

        {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
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
