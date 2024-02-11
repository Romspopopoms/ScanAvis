import React, { useState } from 'react';
import { motion } from 'framer-motion';

const EnvoyezVosMessages = () => {
  const [titreMessage, setTitreMessage] = useState('');
  const [corpsMessage, setCorpsMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique d'envoi du message ici
    console.log('Titre:', titreMessage, 'Message:', corpsMessage);
    // Réinitialiser le formulaire après l'envoi
    setTitreMessage('');
    setCorpsMessage('');
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
