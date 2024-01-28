const FeatureRow = ({ title, imgSrc }) => (
  <div className="flex items-center space-x-2"> {/* Utilise flexbox pour aligner les éléments */}
    <img src={imgSrc} alt={title} className="w-4 h-4" /> {/* Rétrécit l'image à 1rem par 1rem */}
    <span className="text-sm">{title}</span> {/* Taille de texte ajustée si nécessaire */}
  </div>
);

export default FeatureRow;
