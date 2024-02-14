import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext'; // Vérifiez que le chemin d'accès est correct

const CarteFideliteClient = () => {
  // État local pour gérer les avantages
  const [avantages, setAvantages] = useState(Array(10).fill(''));

  // État local pour gérer l'affichage de l'indicateur de chargement
  const [isLoading, setIsLoading] = useState(false);

  // Accès aux fonctions et états du contexte
  const {
    envoyerAvantagesAuWebhook,
    isFormLocked,
    updateFormLock,
    confirmationMessage,
    updateConfirmationMessage,
  } = useContext(AuthContext);

  // Gère les modifications des champs d'input
  const handleInputChange = (index, value) => {
    if (!isFormLocked) {
      const newAvantages = [...avantages];
      newAvantages[index] = value;
      setAvantages(newAvantages);
    }
  };

  // Gère la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Active l'indicateur de chargement
    try {
      await envoyerAvantagesAuWebhook(avantages); // Envoie les avantages via le webhook
      updateFormLock(true); // Verrouille le formulaire après la soumission réussie
      updateConfirmationMessage('Formulaire bien sauvegardé.'); // Met à jour le message de confirmation
    } catch (error) {
      updateConfirmationMessage('Erreur lors de la sauvegarde. Veuillez réessayer.'); // Gère les erreurs
    }
    setIsLoading(false); // Désactive l'indicateur de chargement
  };

  // Permet de déverrouiller le formulaire pour modification
  const handleEdit = () => {
    updateFormLock(false);
    updateConfirmationMessage(''); // Réinitialise le message de confirmation
  };

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-lg mx-auto my-12 bg-white p-8 rounded-xl shadow-xl border border-gray-200"
    >
      {confirmationMessage && <p className="text-green-500">{confirmationMessage}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold text-center text-purple-800">Carte de fidélité client</h2>
        {avantages.map((avantage, index) => (
          <div className="space-y-2" key={index}>
            <label htmlFor={`avantage-${index}`} className="block text-lg font-semibold text-gray-700">Avantage #{index + 1}</label>
            <input
              type="text"
              id={`avantage-${index}`}
              name={`avantage-${index}`}
              value={avantage}
              onChange={(e) => handleInputChange(index, e.target.value)}
              className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              placeholder={`Avantage #${index + 1}`}
              disabled={isFormLocked || isLoading} // Désactive les inputs si le formulaire est verrouillé ou en chargement
            />
          </div>
        ))}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          disabled={isFormLocked || isLoading} // Désactive le bouton de soumission pendant le chargement ou si le formulaire est verrouillé
        >
          {isLoading ? 'Envoi en cours...' : 'Enregistrer les avantages'}
        </motion.button>
        {isFormLocked && (
          <button
            type="button"
            onClick={handleEdit}
            className="mt-4 w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-lg font-medium text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Modifier
          </button>
        )}
      </form>
    </motion.div>
  );
};

export default CarteFideliteClient;
