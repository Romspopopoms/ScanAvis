import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const PageForm = () => {
  const {
    isAuthenticated,
    user,
    errorMessage,
    handleError, // Assurez-vous que cette fonction est exposée via AuthContext pour gérer les erreurs
  } = useContext(AuthContext);

  const [titre, setTitre] = useState('');
  const [imageDeFond, setImageDeFond] = useState(null);
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(errorMessage);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setMessage('Veuillez vous connecter pour créer une page.');
      return;
    }

    setLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('titre', titre);
    if (imageDeFond) formData.append('imageDeFond', imageDeFond);
    if (logo) formData.append('logo', logo);
    formData.append('userUuid', user.uuid); // Ajouter l'UUID de l'utilisateur pour l'associer à la page créée

    try {
      const response = await fetch('/.netlify/functions/uploadImages', { // Assurez-vous que l'URL est correcte
        method: 'POST',
        body: formData,
      });

      const result = await response.json(); // Supposer que la réponse est toujours du JSON

      if (!response.ok) {
        throw new Error(`Erreur lors de l'envoi du formulaire: ${result.message || response.statusText}`);
      }

      setMessage(result.message || 'Formulaire envoyé avec succès.');

      // Réinitialiser le formulaire
      setTitre('');
      setImageDeFond(null);
      setLogo(null);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du formulaire:', error);
      handleError(error.message); // Utiliser la fonction handleError du contexte
    } finally {
      setLoading(false);
    }
  };

  // Écouter les changements du message d'erreur dans le contexte
  useEffect(() => {
    if (errorMessage) {
      setMessage(errorMessage);
    }
  }, [errorMessage]);

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-lg mx-auto my-12 bg-white p-8 rounded-xl shadow-xl border border-gray-200"
    >
      {message && <div className="my-3 p-3 text-center text-white bg-purple-600 rounded-md">{message}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold text-center text-purple-800">Créer votre page</h2>

        <div className="space-y-2">
          <label htmlFor="titre" className="block text-lg font-semibold text-gray-700">Nom de la société</label>
          <input
            type="text"
            id="titre"
            name="titre"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            placeholder="Entrez le nom de votre société"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="imageDeFond" className="block text-lg font-semibold text-gray-700">Image de fond (JPG, PNG)</label>
          <input
            type="file"
            id="imageDeFond"
            name="imageDeFond"
            accept=".jpg, .jpeg, .png"
            onChange={(e) => setImageDeFond(e.target.files[0])}
            className="mt-1 block w-full file:px-4 file:py-2 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="logo" className="block text-lg font-semibold text-gray-700">Logo (JPG, PNG)</label>
          <input
            type="file"
            id="logo"
            name="logo"
            accept=".jpg, .jpeg, .png"
            onChange={(e) => setLogo(e.target.files[0])}
            className="mt-1 block w-full file:px-4 file:py-2 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          disabled={loading}
        >
          {loading ? 'Envoi en cours...' : 'Créer la page'}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default PageForm;
