import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// LoginButton.js
export const LoginButton = () => {
  const { getAuthUrl } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      console.log('Tentative de récupération de l\'URL d\'authentification...');
      const authUrl = await getAuthUrl();
      console.log('URL d\'authentification reçue:', authUrl);
      if (authUrl) {
        console.log('Redirection vers:', authUrl);
        window.location.href = authUrl; // La redirection doit se produire ici
      } else {
        console.error('L\'URL d\'authentification n\'a pas été reçue.');
      }
    } catch (error) {
      console.error('Erreur pendant la connexion:', error);
    }
  };

  return (
    <button type="button" onClick={handleLogin} style={{ cursor: 'pointer' }}>
      Se connecter avec Google
    </button>
  );
};

export const LogoutButton = () => {
  const { logout } = useContext(AuthContext);

  return (
    <button type="button" onClick={logout} style={{ cursor: 'pointer' }}>
      Déconnexion
    </button>
  );
};
