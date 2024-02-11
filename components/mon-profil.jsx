import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const MonProfil = () => {
  const { user, errorMessage, entreprise, googleBusiness, fetchUserDetails, updateUserDetails } = useContext(AuthContext);

  const [isEditing, setIsEditing] = useState(false);
  const [localEmail, setLocalEmail] = useState(user?.email || '');
  const [localEntreprise, setLocalEntreprise] = useState(entreprise || '');
  const [localGoogleBusiness, setLocalGoogleBusiness] = useState(googleBusiness || '');

  useEffect(() => {
    if (user?.uuid) {
      fetchUserDetails(user.uuid);
    }
  }, [user?.uuid, fetchUserDetails]);

  useEffect(() => {
    setLocalEmail(user?.email || '');
    setLocalEntreprise(entreprise || '');
    setLocalGoogleBusiness(googleBusiness || '');
  }, [user, entreprise, googleBusiness]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateUserDetails(localEmail, localEntreprise, localGoogleBusiness);
    setIsEditing(false);
  };

  const profileCardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen pt-16 bg-gray-50"
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5 }}
    >
      <motion.section
        className="w-full max-w-2xl px-6 py-4 mx-auto bg-white rounded-md shadow-lg"
        variants={profileCardVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8">
          Mon Profil
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium text-gray-700 block">
              Email:
            </label>
            <input
              id="email"
              type="email"
              value={localEmail}
              onChange={(e) => setLocalEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="entreprise" className="text-sm font-medium text-gray-700 block">
              Entreprise:
            </label>
            <input
              id="entreprise"
              type="text"
              value={localEntreprise}
              onChange={(e) => setLocalEntreprise(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="googleBusiness" className="text-sm font-medium text-gray-700 block">
              Google Business:
            </label>
            <input
              id="googleBusiness"
              type="text"
              value={localGoogleBusiness}
              onChange={(e) => setLocalGoogleBusiness(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={!isEditing}
            />
          </div>

          {isEditing && (
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-gray-600 bg-transparent border border-gray-300 rounded-md py-2 px-4 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="text-white bg-purple-600 border border-transparent rounded-md py-2 px-4 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                Enregistrer
              </button>
            </div>
          )}

          {!isEditing && (
            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="text-white bg-blue-500 border border-transparent rounded-md py-2 px-4 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                Modifier le profil
              </button>
            </div>
          )}
        </form>

        {errorMessage && (
          <p className="mt-4 text-center text-sm text-red-600">
            {errorMessage}
          </p>
        )}
      </motion.section>
    </motion.div>
  );
};

export default MonProfil;
