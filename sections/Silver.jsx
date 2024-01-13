'use client';

import React from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import styles from '../styles';

const SectionThree = () => {
  const youtubeVideoUrl = "https://www.youtube.com/embed/ljFkRR6ldMQ";
  const title = " Envoi Simplifié de Newsletters avec Scan'Avis";
  const subtitle = "Optimisez votre communication et fidélisez vos clients avec des newsletters personnalisées !";
  const descriptionPoints = [
    "Intégration et Sécurisation des Adresses Email : Nous exploitons la base de données des adresses email collectées via les Options de base et Bronze, en veillant à la sécurité et à la conformité de ces données.",
    "Formulaire Simplifié pour les Restaurateurs : Mettez en place des newsletters engageantes grâce à notre formulaire simple. Ajoutez facilement du texte et des images pour annoncer vos événements et promotions.",
    "Validation et Envoi Automatisé des Emails : Après votre validation, les emails sont envoyés pour approbation, puis distribués automatiquement à votre liste de clients, renforçant ainsi votre présence dans leur esprit.",
    "Gestion des Envois de Masse : Nous fournissons des solutions efficaces pour l'envoi de newsletters, quel que soit le volume, tout en évitant que vos messages soient marqués comme spam.",
    "Option de Désabonnement Facilitée : Chaque email inclut une option de désabonnement claire, respectant ainsi les préférences de vos clients et garantissant la conformité de votre liste de diffusion."
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
          Notre option Silver
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
export default SectionThree;
