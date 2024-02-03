import React, { useState, useEffect, useRef } from 'react';
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
  const [navbarHeight, setNavbarHeight] = useState(0);
  const navbarRef = useRef(null);

  useEffect(() => {
    // À chaque rendu, mettez à jour la hauteur du navbar
    if (navbarRef.current) {
      setNavbarHeight(navbarRef.current.offsetHeight);
    }
  }, []); // Le tableau vide garantit que l'effet ne s'exécute qu'après le premier montage

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
    <div className="bg-gradient-to-b from-purple-800 to-purple-500">
      {/* Supposons que c'est votre barre de navigation et qu'elle a une ref attachée */}
      <div ref={navbarRef} className="fixed top-0 left-0 w-full z-50 ..."> {/* Barre de navigation ici */}</div>

      {/* Ajoutez du style en ligne ici pour la marge supérieure équivalente à la hauteur de la barre de navigation */}
      <div style={{ marginTop: `${navbarHeight}px` }} className="bg-purple-800 shadow-md">
        <div className="flex justify-center space-x-4 p-4">
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

      {/* Le contenu de la page en dessous du menu */}
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
