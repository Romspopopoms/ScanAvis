'use client';

import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const SectionOne = () => {
  const youtubeVideoUrl = 'https://www.youtube.com/embed/zoVBnmjNKUQ';
  const title = "Optimisation de la Visibilité en Ligne avec Scan'Avis";
  const subtitle = 'Boostez votre visibilité en ligne et attirez plus de clients !';
  const descriptionPoints = [
    'Génération de QR Codes Uniques pour une expérience utilisateur fluide.',
    "Liaison Directe avec Google Business pour faciliter l'accès aux commentaires.",
    'QR Codes sur Supports Durables pour une intégration élégante et résistante.',
    'Processus Automatisé et Intégratif pour une gestion simplifiée de vos QR Codes.',
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
    <section ref={ref} className="bg-gray-900 text-white py-16 px-4">
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
                <img src="/check.svg" alt="Check" />
              </span>
              {point}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default SectionOne;
