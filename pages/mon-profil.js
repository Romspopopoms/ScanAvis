import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MonProfil from '../components/mon-profil';

const menuItems = [
  { name: 'Profil', key: 'profil' },
  { name: 'Création de votre page', key: 'creation' },
  // Ajoutez d'autres éléments de menu ici
];

const variants = {
  open: { opacity: 1, height: 'auto' },
  collapsed: { opacity: 0, height: 0 },
};

const MonProfilPage = () => {
  const [activeSection, setActiveSection] = useState('profil');

  const renderSection = (key) => {
    switch (key) {
      case 'profil':
        return <MonProfil />;
      case 'creation':
        return <div>Contenu de la section "Création de votre page"</div>;
      // Ajoutez d'autres sections ici si nécessaire
      default:
        return <div>Section non trouvée</div>;
    }
  };

  return (
    <div className="relative z-10 min-h-screen bg-gradient-to-b from-purple-800 to-purple-500">
      <div className="fixed top-0 left-0 w-full z-30">
        <div className="flex justify-center space-x-4 p-4 bg-purple-800 shadow-md">
          {menuItems.map((item) => (
            <motion.div
              key={item.key}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`cursor-pointer px-4 py-2 rounded-lg text-white shadow-lg 
                          ${activeSection === item.key ? 'bg-purple-600' : 'bg-purple-700 hover:bg-purple-600'}`}
              onClick={() => setActiveSection(item.key)}
            >
              {item.name}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Augmentez la valeur de pt pour descendre le contenu en dessous de la navbar */}
      <div className="pt-32"> {/* Ajustez cette valeur selon la hauteur de votre navbar */}
        <AnimatePresence>
          {menuItems.map((item) => activeSection === item.key && (
            <motion.div
              key={item.key}
              initial="collapsed"
              animate="open"
              exit="collapsed"
              variants={variants}
              transition={{ duration: 0.8 }}
              className="overflow-hidden"
            >
              {renderSection(item.key)}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MonProfilPage;
