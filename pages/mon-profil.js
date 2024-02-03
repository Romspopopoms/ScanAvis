import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MonProfil from '../components/mon-profil';

const menuItems = [
  { name: 'Profil', key: 'profil' },
  { name: 'Création de votre page', key: 'creation' },
  // Ajoutez d'autres éléments de menu ici
];

const variants = {
  open: { opacity: 1, x: 0 },
  collapsed: { opacity: 0, x: '-100%' },
};

const MonProfilPage = () => {
  const [activeSection, setActiveSection] = useState('profil');
  const [navbarHeight, setNavbarHeight] = useState(0);

  useEffect(() => {
    // Assurez-vous que l'ID ou la classe ciblée correspond à votre barre de navigation
    const navbar = document.getElementById('navbar'); // Utilisez l'ID ou la classe de votre barre de navigation
    if (navbar) {
      setNavbarHeight(navbar.offsetHeight);
    }
  }, []);

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
    <div className="bg-gradient-to-b from-purple-800 to-purple-500 min-h-screen" style={{ paddingTop: `${navbarHeight}px` }}>
      {/* Ici, nous avons supprimé la div shadow-md car vous vouliez enlever le fond */}
      <div className="flex justify-center space-x-4 p-4">
        {menuItems.map((item) => (
          <motion.div
            key={item.key}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`cursor-pointer px-4 py-2 rounded-lg text-white 
                ${activeSection === item.key ? 'bg-purple-600' : 'bg-purple-700 hover:bg-purple-600'}`}
            onClick={() => setActiveSection(item.key)}
          >
            {item.name}
          </motion.div>
        ))}
      </div>
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
  );
};

export default MonProfilPage;
