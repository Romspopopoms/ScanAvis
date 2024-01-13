import { useEffect } from 'react';
import netlifyIdentity from 'netlify-identity-widget';

const AuthMenu = ({ onClose }) => {
  useEffect(() => {
    // Ouvrir directement le dialogue de connexion lors du montage du composant
    netlifyIdentity.open('login');

    // Lorsque le widget de connexion est fermé, fermer également la modale
    netlifyIdentity.on('close', onClose);

    // Nettoyer l'écouteur d'événement lors du démontage du composant
    return () => {
      netlifyIdentity.off('close', onClose);
    };
  }, [onClose]);

  // Pas besoin de retourner un JSX ici puisque nous n'affichons pas de boutons
  return null;
};

export default AuthMenu;
