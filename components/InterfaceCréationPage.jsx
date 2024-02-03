import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const PageForm = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [titre, setTitre] = useState('');
  const [imageDeFond, setImageDeFond] = useState(null);
  const [logo, setLogo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Veuillez vous connecter pour créer une page.');
    }
    const formData = new FormData();
    formData.append('titre', titre);
    if (imageDeFond) formData.append('imageDeFond', imageDeFond);
    if (logo) formData.append('logo', logo);

    try {
      const response = await fetch('/chemin/vers/votre/endpoint', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Erreur lors de l\'envoi du formulaire.');
      console.log('Formulaire envoyé avec succès.');
    } catch (error) {
      console.error('Erreur lors de l\'envoi du formulaire:', error);
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
        >
          Créer la page
        </motion.button>
      </form>
    </motion.div>
  );
};

export default PageForm;
