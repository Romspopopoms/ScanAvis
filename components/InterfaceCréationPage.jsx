import React from 'react';
import { motion } from 'framer-motion';
import { useHtml } from '../context/HtmlContext'; // Assurez-vous que le chemin est correct

const PageForm = () => {
  const {
    titre,
    setTitre,
    setImageDeFond,
    setLogo,
    loading,
    pageReady,
    userPageUrl,
    handleSubmit,
  } = useHtml();

  // Gère le changement des champs de fichier pour imageDeFond et logo
  const handleImageChange = (e, setImage) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  // Fonction pour afficher un message d'état approprié
  const renderStatusMessage = () => {
    if (loading) {
      return 'Votre page est en cours de préparation. Veuillez patienter...';
    } if (pageReady && userPageUrl) {
      return 'Votre page est prête !';
    }
    return ''; // Aucun message par défaut
  };

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-lg mx-auto my-12 bg-white p-8 rounded-xl shadow-xl border border-gray-200"
    >
      {/* Affichage du message d'état du processus */}
      <div className="my-3 p-3 text-center text-white bg-purple-600 rounded-md">
        {renderStatusMessage()}
      </div>

      {/* Affichage conditionnel basé sur l'état de la page */}
      {pageReady && userPageUrl ? (
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8">Votre page est prête !</h2>
          <p>Voici le lien vers votre nouvelle page :</p>
          <a
            href={userPageUrl}
            className="block mt-4 text-purple-600 hover:text-purple-800"
            target="_blank"
            rel="noopener noreferrer"
          >
            Accéder à la page
          </a>
        </div>
      ) : (
        // Le formulaire reste visible mais désactivé
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
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="imageDeFond" className="block text-lg font-semibold text-gray-700">Image de fond (JPG, PNG)</label>
            <input
              type="file"
              id="imageDeFond"
              name="imageDeFond"
              accept=".jpg, .jpeg, .png"
              onChange={(e) => handleImageChange(e, setImageDeFond)}
              className="mt-1 block w-full file:px-4 file:py-2 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="logo" className="block text-lg font-semibold text-gray-700">Logo (JPG, PNG)</label>
            <input
              type="file"
              id="logo"
              name="logo"
              accept=".jpg, .jpeg, .png"
              onChange={(e) => handleImageChange(e, setLogo)}
              className="mt-1 block w-full file:px-4 file:py-2 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              disabled={loading}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            disabled={loading}
          >
            {loading ? 'Préparation...' : 'Créer la page'}
          </motion.button>
        </form>
      )}
    </motion.div>
  );
};

export default PageForm;
