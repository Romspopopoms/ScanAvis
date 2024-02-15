import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MonProfil from '../components/mon-profil';
import PageForm from '../components/InterfaceCréationPage';
import AbonnementsComponent from '../components/AbonnementsComponent';
import EnvoyezVosMessages from '../components/EnvoyezVosMessages';
import CarteFideliteClient from '../components/CarteFidelite';
import { AuthContext } from '../context/AuthContext';
import { useNavbarHeight } from '../context/NavbarContext';

const MonProfilPage = () => {
  const [activeSection, setActiveSection] = useState('profil');
  const { navbarHeight } = useNavbarHeight();
  const { userSubscriptions } = useContext(AuthContext);

  const adjustedPaddingTop = navbarHeight > 64 ? `${navbarHeight - 30}px` : '60px';

  const checkAccess = (subscriptionKey) => {
    const accessLevels = {
      Base: ['profil', 'abonnement'],
      Bronze: ['profil', 'abonnement', 'creation'],
      Silver: ['profil', 'abonnement', 'creation', 'messages'],
      Gold: ['profil', 'abonnement', 'creation', 'messages', 'fidelite'],
    };

    // Rechercher le niveau d'accès le plus élevé parmi les abonnements de l'utilisateur
    let highestAccessLevel = 'Base'; // Valeur par défaut si aucun abonnement trouvé
    userSubscriptions.forEach((sub) => {
      if (Object.keys(accessLevels).includes(sub.items) && accessLevels[sub.items].includes(subscriptionKey)) {
        highestAccessLevel = sub.items; // Mettre à jour le niveau d'accès le plus élevé trouvé
      }
    });

    return accessLevels[highestAccessLevel].includes(subscriptionKey);
  };

  const menuItems = [
    { name: 'Profil', key: 'profil' },
    { name: 'Abonnements', key: 'abonnement' },
    { name: 'Création de votre page', key: 'creation' },
    { name: 'Envoyez vos messages', key: 'messages' },
    { name: 'Carte de fidélité client', key: 'fidelite' },
  ];

  const renderSection = (key) => {
    switch (key) {
      case 'profil': return <MonProfil />;
      case 'abonnement': return <AbonnementsComponent />;
      case 'creation': return <PageForm />;
      case 'messages': return <EnvoyezVosMessages />;
      case 'fidelite': return <CarteFideliteClient />;
      default: return <div>Section non trouvée</div>;
    }
  };

  return (
    <div className="bg-gradient-to-b from-purple-800 to-purple-500 min-h-screen" style={{ paddingTop: adjustedPaddingTop }}>
      <div className="flex justify-center space-x-4 p-4">
        {menuItems.map((item) => (
          checkAccess(item.key) && (
            <motion.div
              key={item.key}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`cursor-pointer px-4 py-2 rounded-lg text-white ${activeSection === item.key ? 'bg-purple-600' : 'bg-purple-700 hover:bg-purple-600'}`}
              onClick={() => setActiveSection(item.key)}
            >
              {item.name}
            </motion.div>
          )
        ))}
      </div>
      <AnimatePresence>
        {menuItems.map((item) => (
          activeSection === item.key && checkAccess(item.key) && (
            <motion.div
              key={item.key}
              initial="collapsed"
              animate="open"
              exit="collapsed"
              variants={{ open: { opacity: 1, height: 'auto' }, collapsed: { opacity: 0, height: 0 } }}
              transition={{ duration: 0.8 }}
              className="overflow-hidden"
            >
              {renderSection(item.key)}
            </motion.div>
          )
        ))}
      </AnimatePresence>
    </div>
  );
};

export default MonProfilPage;
