'use client';

import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const SectionTwo = () => {
  const youtubeVideoUrl = 'https://www.youtube.com/embed/ccEDWbUHwGM?si=yriB0x3VB2zgHQk1';
  const title = "Collecte d'Adresses Email et Engagement Client avec Scan'Avis";
  const subtitle = 'Enrichissez votre marketing et renforcez la fidélité client !';
  const descriptionPoints = [
    'Création de QR Codes pour Formulaire redirigeant vers un formulaire en ligne.',
    'Développement du Formulaire avec Google Forms ou solution personnalisée.',
    'Collecte et Gestion des Emails dans une base de données sécurisée.',
    'Accès Facilité aux Données par extraction vers Excel, conformément aux normes de protection des données.',
    "Messages de Remerciement Personnalisés pour renforcer l'engagement client.",
  ];

  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    if (inView) {
      controls.start({ x: 0, opacity: 1, transition: { duration: 0.5 } });
    } else {
      controls.start({ x: '100%', opacity: 0, transition: { duration: 0.5 } });
    }
  }, [controls, inView]);

  return (
    <section ref={ref} className=" text-white py-16 px-4">
      <motion.div
        initial={{ x: '-100%', opacity: 0 }}
        animate={controls}
        className="flex flex-col items-center justify-center space-y-8"
      >
        <h1 className="text-3xl md:text-5xl font-bold text-center">
          {title}
        </h1>
        <p className="text-xl md:text-2xl text-center">
          {subtitle}
        </p>
        <div className="w-full max-w-4xl">
          <iframe
            src={youtubeVideoUrl}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-64 md:h-96 rounded-lg shadow-xl"
          />
        </div>
        <div className="max-w-2xl space-y-4">
          {descriptionPoints.map((point, index) => (
            <div key={index} className="flex items-center text-lg md:text-xl">
              <span className="w-6 h-6 mr-2">
                <img src="/check.png" alt="Check" />
              </span>
              {point}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default SectionTwo;
