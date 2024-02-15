import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MonProfil from '../components/mon-profil';
import PageForm from '../components/InterfaceCréationPage';
import AbonnementsComponent from '../components/AbonnementsComponent';
import EnvoyezVosMessages from '../components/EnvoyezVosMessages';
import CarteFideliteClient from '../components/CarteFidelite';
import { AuthContext } from '../context/AuthContext';

import { useNavbarHeight } from '../context/NavbarContext';

const menuItems = [
  { name: 'Profil', key: 'profil' },
  { name: 'Abonnements', key: 'abonnement' },
  { name: 'Création de votre page', key: 'creation' },
  { name: 'Envoyez vos messages', key: 'messages' },
  { name: 'Carte de fidélité client', key: 'fidelite' },
];

const variants = {
  open: { opacity: 1, height: 'auto' },
  collapsed: { opacity: 0, height: 0 },
};

const MonProfilPage = () => {
  const [activeSection, setActiveSection] = useState('profil');
  const { navbarHeight } = useNavbarHeight();
  const { userSubscriptions } = useContext(AuthContext);

  const hasBronzeAccess = userSubscriptions.some((sub) => ['Bronze', 'Silver', 'Gold'].includes(sub.name));
  const hasSilverAccess = userSubscriptions.some((sub) => ['Silver', 'Gold'].includes(sub.name));
  const hasGoldAccess = userSubscriptions.some((sub) => sub.name === 'Gold');

  const adjustedPaddingTop = navbarHeight > 64 ? `${navbarHeight - 30}px` : '60px';

  const renderSection = (key) => {
    switch (key) {
      case 'profil':
      case 'abonnement':
        return key === 'profil' ? <MonProfil /> : <AbonnementsComponent />;
      case 'creation':
        return hasBronzeAccess ? <PageForm /> : <p>Accès restreint. Veuillez souscrire à l'abonnement Bronze ou supérieur.</p>;
      case 'messages':
        return hasSilverAccess ? <EnvoyezVosMessages /> : <p>Accès restreint. Veuillez souscrire à l'abonnement Silver ou supérieur.</p>;
      case 'fidelite':
        return hasGoldAccess ? <CarteFideliteClient /> : <p>Accès restreint. Veuillez souscrire à l'abonnement Gold.</p>;
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
