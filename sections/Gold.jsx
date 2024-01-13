'use client';

import React from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import styles from '../styles';

const SectionFour = () => {
  const youtubeVideoUrl = "https://www.youtube.com/embed/ljFkRR6ldMQ";
  const title = " Ciblage Avancé et Envoi de Mails Promotionnels Personnalisés avec Scan'Avis";
  const subtitle = "Développez une stratégie marketing personnalisée pour une fidélisation accrue de vos clients !";
  const descriptionPoints = [
    "Base de Données Complète et Personnalisée : Nous constituons une base de données détaillée, incluant des informations clés sur chaque client, afin de vous fournir un outil puissant pour des offres sur mesure.",
    "Gestion Intuitive des Promotions : Notre interface utilisateur permet aux restaurateurs de créer des promotions ciblées basées sur les habitudes de dépense et la fréquence des visites des clients, rendant chaque offre unique et attrayante.",
    "Utilisation de QR Codes pour la Fidélité : Chaque promotion envoyée comprend un QR Code, permettant une interaction facile et une mise à jour instantanée des données de fidélité du client à chaque visite.",
  ];

  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: false });

  React.useEffect(() => {
    if (inView) {
      controls.start({ x: 0, opacity: 1, transition: { duration: 0.5 } });
    } else {
      controls.start({ x: "100%", opacity: 0, transition: { duration: 0.5 } });
    }
  }, [controls, inView]);

  return (
    <section ref={ref} className={`${styles.paddings} bg-dark`} id="world-1">
      <motion.div
        initial={{ x: "-100%", opacity: 0 }}
        animate={controls}
        className="flex flex-col items-center justify-center p-6 text-white"
      >
        <h1 className="text-5xl font-bold mb-4 text-center leading-tight">
          Notre option Gold
        </h1>
        <div className="w-full max-w-4xl mb-6">
          <iframe
            src={youtubeVideoUrl}
            title="YouTube video"
            allowFullScreen
            className="w-full aspect-video shadow-lg rounded-lg"
          ></iframe>
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
export default SectionFour;
