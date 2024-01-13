"use client";

import React from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import styles from "../styles";

const SectionOne = () => {
  const youtubeVideoUrl = "https://www.youtube.com/embed/zoVBnmjNKUQ";
  const title = "Optimisation de la Visibilité en Ligne avec Scan'Avis";
  const subtitle =
    "Boostez votre visibilité en ligne et attirez plus de clients !";
  const descriptionPoints = [
    "Génération de QR Codes Uniques : Nous créons automatiquement des QR Codes personnalisés pour votre établissement, assurant une expérience utilisateur fluide et sans effort.",
    "Liaison Directe avec Google Business : Chaque QR Code est associé à votre page Google Business, dirigeant vos clients directement vers votre espace de commentaires.",
    "QR Codes sur Supports Durables : Imprimés sur des plaques de Plexiglas, nos QR Codes sont à la fois élégants et résistants, intégrant votre branding pour une touche personnalisée.",
    "Processus Automatisé et Intégratif : Grâce à un formulaire en ligne intégré, commandez et gérez vos QR Codes facilement, avec une gestion automatisée des demandes.",
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
          Notre option de base
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

export default SectionOne;
