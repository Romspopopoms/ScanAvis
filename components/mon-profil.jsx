import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const MonProfil = () => {
  const {
    user,
    errorMessage,
    entreprise,
    googleBusiness,
    fetchUserDetails,
    updateUserDetails,
  } = useContext(AuthContext);

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
  }, [user?.email, entreprise, googleBusiness]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateUserDetails(localEmail, localEntreprise, localGoogleBusiness);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-20">
      <motion.div className="w-full max-w-4xl bg-white shadow-xl rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-center text-purple-800 mb-8">Mon Profil</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <p><strong>Nom:</strong> {user?.name}</p>
          {isEditing ? (
            <div>
              <label htmlFor="email" className="block">Email:</label>
              <input
                id="email"
                type="email"
                value={localEmail}
                onChange={(e) => setLocalEmail(e.target.value)}
                className="mt-1 p-2 w-full border rounded"
                required
              />
            </div>
          ) : (
            <p><strong>Email:</strong> {user?.email}</p>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="entreprise" className="block">Entreprise:</label>
                <input
                  id="entreprise"
                  type="text"
                  value={localEntreprise}
                  onChange={(e) => setLocalEntreprise(e.target.value)}
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
                  className="mt-1 p-2 w-full border rounded"
                />
              </div>
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <button type="button" onClick={() => window.open(localGoogleBusiness, '_blank')} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Tester Google Business
              </button>
              <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
                Enregistrer les modifications
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <p><strong>Entreprise:</strong> {entreprise || 'Veuillez remplir ce champs'}</p>
            <p><strong>Google Business:</strong> {googleBusiness || 'Veuillez remplir ce champs'}</p>
          </div>
        )}

        <div className="text-center mt-6">
          {!isEditing && (
            <button type="button" onClick={() => setIsEditing(true)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Modifier
            </button>
          )}
        </div>

        {errorMessage && <p className="text-red-600 text-center mt-4">{errorMessage}</p>}
      </motion.div>

      <motion.div className="w-full max-w-4xl bg-white shadow-xl rounded-lg p-6 mt-6">
        <h2 className="text-2xl font-bold text-center text-purple-800 mb-6">Guide Google Business</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-md mb-4">Vous avez déjà une fiche Google pour votre établissement ?</p>
            <a href="https://aide.neocamino.com/fr/articles/2613724-comment-trouver-et-partager-mon-adresse-google-my-business-google-maps" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
              Cliquez-ici pour le guide explicatif.
            </a>
          </div>
          <div>
            <p className="text-md mb-4">Vous n'avez pas, ou ne savez pas comment configurer votre fiche Google pour votre établissement ?</p>
            <a href="https://support.google.com/business/answer/2911778?hl=fr" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
              Cliquez ici pour le guide explicatif.
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MonProfil;
