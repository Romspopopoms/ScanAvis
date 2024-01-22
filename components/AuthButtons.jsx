import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Assurez-vous d'avoir le bon chemin d'accès

// Composant pour le bouton de connexion
export const LoginButton = () => {
  const { getAuthUrl } = useContext(AuthContext);

  return (
    <button type="button" onClick={getAuthUrl} style={{ cursor: 'pointer' }}>
      Se connecter avec Google
    </button>
  );
};

// Composant pour le bouton de déconnexion
export const LogoutButton = () => {
  const { logout } = useContext(AuthContext);

  return (
    <button type="button" onClick={logout} style={{ cursor: 'pointer' }}>
      Déconnexion
    </button>
  );
};
