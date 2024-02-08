import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MonProfil from '../components/mon-profil';
import PageForm from '../components/InterfaceCréationPage';
import AbonnementsComponent from '../components/AbonnementsComponent'; // Assurez-vous que le chemin est correct
import { AuthContext } from '../context/AuthContext';

import { useNavbarHeight } from '../context/NavbarContext';

const menuItems = [
  { name: 'Profil', key: 'profil' },
  { name: 'Création de votre page', key: 'creation' },
  { name: 'Abonnements', key: 'abonnement' }, // Nouvel élément de menu ajouté ici
];

const variants = {
  open: { opacity: 1, height: 'auto' },
  collapsed: { opacity: 0, height: 0 },
};

const MonProfilPage = () => {
  const [activeSection, setActiveSection] = useState('profil');
  const { navbarHeight } = useNavbarHeight(); // Utilisez le hook pour obtenir la hauteur de la navbar
  const { fetchUserSubscriptions, user } = useContext(AuthContext);

  const adjustedPaddingTop = navbarHeight > 64 ? `${navbarHeight - 30}px` : '44px'; // Calculez le padding top ajusté

  useEffect(() => {
    if (user && user.uuid) {
      fetchUserSubscriptions(user.uuid);
    }
  }, [user, fetchUserSubscriptions]); // Assurez-vous d'inclure fetchUserSubscriptions dans le tableau de dépendances

  const renderSection = (key) => {
    switch (key) {
      case 'profil':
        return <MonProfil />;
      case 'abonnement': // Assurez-vous que la clé correspond à celle définie dans menuItems
        return <AbonnementsComponent />;
      case 'creation':
        return <PageForm />;

      default:
        return <div>Section non trouvée</div>;
    }
  };

  return (
    <div className="bg-gradient-to-b from-purple-800 to-purple-500 min-h-screen">
      <div style={{ paddingTop: adjustedPaddingTop }}>
        <div className="flex justify-center space-x-4 p-4">
          {menuItems.map((item) => (
            <motion.div
              key={item.key}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`cursor-pointer px-4 py-2 rounded-lg text-white ${activeSection === item.key ? 'bg-purple-600' : 'bg-purple-700 hover:bg-purple-600'}`}
              onClick={() => setActiveSection(item.key)}
            >
              {item.name}
            </motion.div>
          ))}
        </div>
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
