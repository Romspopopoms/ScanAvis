'use client';

import React from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import styles from '../styles';

const SectionTwo = () => {
  const youtubeVideoUrl = 'https://www.youtube.com/embed/ccEDWbUHwGM?si=yriB0x3VB2zgHQk1';
  const title = " Collecte d'Adresses Email et Engagement Client avec Scan'Avis";
  const subtitle = 'Enrichissez votre marketing et renforcez la fidélité client !';
  const descriptionPoints = [
    'Création de QR Codes pour Formulaire : Nous développons un système qui génère des QR Codes redirigeant vers un formulaire en ligne. Vos clients peuvent facilement y entrer leur adresse email après avoir laissé un avis sur Google Business.',
    "Développement du Formulaire : Choisissez entre Google Forms pour une solution simple ou un formulaire personnalisé pour une redirection directe vers votre page Google Business après la soumission de l'email.",
    "Collecte et Gestion des Emails : Les adresses email collectées sont stockées dans une base de données sécurisée, facilitant l'envoi d'invitations à des événements spéciaux, d'offres exclusives ou de newsletters.",
    'Accès Facilité aux Données : Nous fournissons aux restaurateurs un accès facile à ces données, par extraction vers Excel, offrant une utilisation flexible et conforme aux normes de protection des données.',
    "Messages de Remerciement Personnalisés : Ajoutez une touche personnelle avec des messages de remerciement personnalisés, renforçant l'engagement et la fidélité de vos clients envers votre restaurant.",
  ];

  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: false });

  React.useEffect(() => {
    if (inView) {
      controls.start({ x: 0, opacity: 1, transition: { duration: 0.5 } });
    } else {
      controls.start({ x: '100%', opacity: 0, transition: { duration: 0.5 } });
    }
  }, [controls, inView]);

  return (
    <section ref={ref} className={`${styles.paddings} bg-dark`} id="world-1">
      <motion.div
        initial={{ x: '-100%', opacity: 0 }}
        animate={controls}
        className="flex flex-col items-center justify-center p-6 text-white"
      >
        <h1 className="text-5xl font-bold mb-4 text-center leading-tight">
          Notre option Bronze
        </h1>
        <div className="w-full max-w-4xl mb-6">
          <iframe
            src={youtubeVideoUrl}
            title="YouTube video"
            allowFullScreen
            className="w-full aspect-video shadow-lg rounded-lg"
          />
        </div>
        <div className="max-w-3xl text-center">
          <h2 className="text-4xl font-semibold mb-3 leading-normal">
            {title}
          </h2>
          <p className="text-2xl mb-4">{subtitle}</p>
          {descriptionPoints.map((point, index) => (
            <p key={index} className="text-xl mb-2 leading-relaxed">
              {point}
            </p>
          ))}
        </div>
      </motion.div>
    </section>
  );
};
export default SectionTwo;
