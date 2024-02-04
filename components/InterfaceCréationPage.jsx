import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { delay: 0.3, duration: 0.5 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.5 } },
};

const PageForm = () => {
  const {
    isAuthenticated,
    user,
    userSubscriptions,
    handleError,
  } = useContext(AuthContext);

  const [titre, setTitre] = useState('');
  const [imageDeFond, setImageDeFond] = useState(null);
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isCheckingPage, setIsCheckingPage] = useState(false);
  const [pageUrl, setPageUrl] = useState('');

  useEffect(() => {
    setMessage('');
  }, []);

  const checkPageAvailability = async () => {
    console.log(`Vérification de la disponibilité de la page: ${pageUrl}`);

    try {
      const response = await fetch(pageUrl);
      if (response.ok) {
        setIsCheckingPage(false);
        setMessage('Votre page est prête !');
      } else {
        console.log('La page n\'est pas encore disponible.');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de la disponibilité de la page:', error);
    }
  };

  useEffect(() => {
    if (isCheckingPage) {
      const intervalId = setInterval(checkPageAvailability, 10000); // Vérifie toutes les 10 secondes
      return () => clearInterval(intervalId);
    }
  }, [isCheckingPage, pageUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setMessage('Veuillez vous connecter pour créer une page.');
      return;
    }
    setLoading(true);
    setFormSubmitted(true);
    setIsCheckingPage(true);
    setMessage('Votre page est en cours de préparation. Veuillez patienter...');

    const formData = new FormData();
    formData.append('titre', titre);
    if (imageDeFond) formData.append('imageDeFond', imageDeFond);
    if (logo) formData.append('logo', logo);
    formData.append('userUuid', user.uuid);
    const userSubscriptionId = userSubscriptions.length > 0 ? userSubscriptions[0].subscriptionId : '';
    formData.append('subscriptionId', userSubscriptionId);

    try {
      const response = await fetch('/.netlify/functions/UploadImages', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur lors de l'envoi du formulaire: ${errorText}`);
      }

      const result = await response.json();
      console.log('Réponse du serveur:', result);
      console.log('URL reçue du serveur:', result.pageUrl);

      setMessage(result.message || 'Formulaire envoyé avec succès.');
      setPageUrl(result.pageUrl); // Enregistrez l'URL de la page générée
      setFormSubmitted(true);
      setIsCheckingPage(true); // Commencer à vérifier la disponibilité de la page
    } catch (error) {
      handleError(`Erreur lors de l'envoi du formulaire: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (isCheckingPage) {
    return (
      <div className="text-center p-5">
        <p>La page est en cours de préparation. Veuillez patienter...</p>
      </div>
    );
  }

  if (formSubmitted && !isCheckingPage && pageUrl) {
    return (
      <motion.div
        className="max-w-4xl mx-auto my-12 p-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <h2 className="text-3xl font-bold text-center mb-8">Votre page est prête !</h2>
        <p className="text-center">Voici le lien vers votre nouvelle page :</p>
        <a
          href={pageUrl}
          className="block text-center mt-4 text-purple-600 hover:text-purple-800"
          target="_blank"
          rel="noopener noreferrer"
        >
          Accéder à la page
        </a>
      </motion.div>
    );
  }

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
            required
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
