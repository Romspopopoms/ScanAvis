import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const EnvoyezVosMessages = () => {
  const [titreMessage, setTitreMessage] = useState('');
  const [corpsMessage, setCorpsMessage] = useState('');
  const [feedback, setFeedback] = useState(''); // Ajout d'un état pour stocker le feedback
  const { envoyerMessage } = useContext(AuthContext); // Accès à la fonction envoyerMessage du contexte

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await envoyerMessage(titreMessage, corpsMessage);
      setFeedback('Message envoyé avec succès !'); // Mise à jour du feedback en cas de succès
      setTitreMessage(''); // Réinitialisation du titre du message
      setCorpsMessage(''); // Réinitialisation du corps du message
    } catch (error) {
      setFeedback('Erreur lors de l\'envoi du message. Veuillez réessayer.'); // Mise à jour du feedback en cas d'erreur
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-lg mx-auto my-12 bg-white p-8 rounded-xl shadow-xl border border-gray-200"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold text-center text-purple-800">Envoyez vos messages</h2>
        {feedback && <div className="text-center my-2 p-3 bg-purple-100 text-purple-800 rounded-lg">{feedback}</div>}
        <div className="space-y-2">
          <label htmlFor="titreMessage" className="block text-lg font-semibold text-gray-700">Titre</label>
          <input
            type="text"
            id="titreMessage"
            name="titreMessage"
            value={titreMessage}
            onChange={(e) => setTitreMessage(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            placeholder="Entrez le titre de votre message"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="corpsMessage" className="block text-lg font-semibold text-gray-700">Message</label>
          <textarea
            id="corpsMessage"
            name="corpsMessage"
            value={corpsMessage}
            onChange={(e) => setCorpsMessage(e.target.value)}
            required
            rows="4"
            className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            placeholder="Entrez votre message ici"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          Envoyer le message
        </motion.button>
      </form>
    </motion.div>
  );
};

export default EnvoyezVosMessages;
