import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MonProfil from '../components/mon-profil';

const buttonVariants = {
  hover: {
    scale: 1.1,
    textShadow: '0px 0px 8px rgb(255,255,255)',
    boxShadow: '0px 0px 8px rgb(255,255,255)',
    transition: {
      duration: 0.3,
    },
  },
  initial: {
    scale: 1,
  },
};

const MonProfilPage = () => {
  const [activeSection, setActiveSection] = useState('profil');

  const renderSection = () => {
    switch (activeSection) {
      case 'profil':
        return <MonProfil />;
      case 'creation de votre page':
        return <div>{/* contenu de la section création */}</div>;
      // ... ajoutez d'autres cas ici si nécessaire
      default:
        return <div>Section non trouvée</div>;
    }
  };

  return (
    <div className="relative z-10 min-h-screen">
      <div className="flex justify-start space-x-4 p-4 bg-blue-500 text-white">
        <motion.button
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          onClick={() => setActiveSection('profil')}
          className="hover:bg-blue-700"
        >
          Profil
        </motion.button>
        <motion.button
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          onClick={() => setActiveSection('creation')}
          className="hover:bg-blue-700"
        >
          Création de votre page
        </motion.button>
        {/* Ajoutez plus de boutons ici au besoin */}
      </div>

      {renderSection()}
    </div>
  );
};

export default MonProfilPage;
